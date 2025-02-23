use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, TokenAccount, Transfer},
    token_interface::TokenInterface,
};
use std::str::FromStr;

#[constant]
pub const UPGRADE_AUTHORITY: &str = "DKc63ukZvHo1vfQMYWxk27EconWJ5tMjYrEaFmhpejZf";
pub const ANCHOR_DISCRIMINATOR: usize = 8;
pub const SLIPPAGE_TOLERANCE: u64 = 5; // 5%
pub const WHITELISTED_TOKENS: &[&str] = &[
    "9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump", // UBC
    "B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo", // COMPUTE
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    "11111111111111111111111111111111",             // SOL (Use system program as identifier)
];

declare_id!("4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf");

#[program]
pub mod ubclaunchpad {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializePool>,
        pool_name: String,
        total_shares: u64,
        fee_ratio: u64, // typically 20 for 5%
        compute_mint: Pubkey,
        ubc_mint: Pubkey,
        custodial_account: Pubkey,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        pool.pool_name = pool_name;
        pool.admin_authority = ctx.accounts.authority.key();
        pool.total_shares = total_shares;
        pool.available_shares = total_shares;
        pool.is_frozen = true;
        pool.fee_ratio = fee_ratio;

        pool.ubc_mint = ubc_mint;
        pool.compute_mint = compute_mint;

        pool.custodial_account = custodial_account;

        Ok(())
    }

    pub fn remove_pool(ctx: Context<UpdatePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let receiver = &ctx.accounts.authority;
        pool.close(receiver.to_account_info())?;
        Ok(())
    }

    pub fn increase_supply(ctx: Context<UpdatePool>, number_of_shares: u64) -> Result<()> {

        let pool = &mut ctx.accounts.pool;

        pool.available_shares = pool
            .available_shares
            .checked_add(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        pool.total_shares = pool
            .total_shares
            .checked_add(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        Ok(())
    }

    pub fn freeze_pool(ctx: Context<UpdatePool>, state: bool) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.is_frozen = state;
        Ok(())
    }

    pub fn set_custodial_account(
        ctx: Context<UpdatePool>,
        custodial_account: Pubkey,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.custodial_account = custodial_account;
        Ok(())
    }

    pub fn set_mints(
        ctx: Context<UpdatePool>,
        ubc_mint: Pubkey,
        compute_mint: Pubkey,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.ubc_mint = ubc_mint;
        pool.compute_mint = compute_mint;
        Ok(())
    }
    
    pub fn set_fee_ratio(
        ctx: Context<UpdatePool>,
        fee_ratio: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.fee_ratio = fee_ratio;
        Ok(())
    }

    pub fn purchase_shares(
        ctx: Context<CreateShareholder>,
        number_of_shares: u64,
        calculated_cost: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        require!(number_of_shares <= 1000, ErrorCode::TooManyShares);

        // Check if enough shares are available
        require!(
            pool.available_shares >= number_of_shares,
            ErrorCode::InsufficientShares
        );

        let n = pool.total_shares.checked_sub(pool.available_shares).ok_or(error!(ErrorCode::MathError))?;

        // Calculate the price per share with bonding curve
        let price_per_share = calculate_share_price(n);

        // Temporary total cost calculation until bonding curve correctly calculates cost;
        let total_cost: u64 = number_of_shares
            .checked_mul(price_per_share)
            .ok_or(error!(ErrorCode::InvalidPaymentAmount))?;

        // Calculate 5% bounds
        let slippage = total_cost
            .checked_mul(SLIPPAGE_TOLERANCE)
            .ok_or(error!(ErrorCode::InvalidAmount))?
            .checked_div(100)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let lower_bound = total_cost
            .checked_sub(slippage)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let upper_bound = total_cost
            .checked_add(slippage)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Verify calculated_cost is within ±[SLIPPAGE_TOLERANCE]% of total_cost
        require!(
            calculated_cost >= lower_bound && calculated_cost <= upper_bound,
            ErrorCode::InvalidPaymentAmount
        );

        let shareholder = &mut ctx.accounts.shareholder;

        shareholder.shares = shareholder
            .shares
            .checked_add(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;
        shareholder.available_shares = shareholder
            .available_shares
            .checked_add(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        shareholder.owner = ctx.accounts.buyer.key();
        shareholder.pool = pool.key();

        // Update pool's available shares
        pool.available_shares = pool
            .available_shares
            .checked_sub(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let fee = total_cost
            .checked_div(pool.fee_ratio)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Transfer compute to swarm fund
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.sender_compute_account.to_account_info(),
                    to: ctx.accounts.custodial_compute_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            total_cost,
        )?;

        // Transfer fees to platform
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.sender_ubc_account.to_account_info(),
                    to: ctx.accounts.custodial_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            fee,
        )?;

        emit!(PurchaseSharesEvent {
            transaction_type: "Primary Sale".to_string(),
            pool: pool.key(),
            buyer: ctx.accounts.buyer.key(),
            number_of_shares: number_of_shares,
            price_per_share: price_per_share,
            amount: total_cost,
            fee: fee,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn create_listing(
        ctx: Context<CreateListing>,
        listing_id: String,
        number_of_shares: u64,
        price_per_share: u64,
        desired_token: Pubkey,
    ) -> Result<()> {

        // Check if shareholder has enough available shares
        require!(
            ctx.accounts.shareholder.available_shares >= number_of_shares,
            ErrorCode::InsufficientShares
        );

        require!(
            validate_whitelisted_token(&desired_token),
            ErrorCode::TokenNotWhitelisted
        );


        let listing = &mut ctx.accounts.share_listing;
        let shareholder = &mut ctx.accounts.shareholder;

        // Update shareholder's available shares
        shareholder.available_shares = shareholder
            .available_shares
            .checked_sub(number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Initialize the listing
        listing.pool = ctx.accounts.pool.key();
        listing.seller = ctx.accounts.seller.key();
        listing.shareholder = shareholder.key();
        listing.number_of_shares = number_of_shares;
        listing.price_per_share = price_per_share;
        listing.listing_id = listing_id;
        listing.desired_token = desired_token;

        Ok(())
    }
    
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {

        let listing = &mut ctx.accounts.share_listing;
        let shareholder = &mut ctx.accounts.shareholder;
        let receiver = &mut ctx.accounts.seller;

        // Return shares to seller's available balance
        shareholder.available_shares = shareholder
            .available_shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Deactivate the listing
        listing.close(receiver.to_account_info())?;

        Ok(())
    }

    pub fn buy_listing(ctx: Context<BuyListing>, transaction_fee: u64) -> Result<()> {
        
        let listing = &mut ctx.accounts.share_listing;
        let buyer_shareholder = &mut ctx.accounts.buyer_shareholder;
        let seller_shareholder = &mut ctx.accounts.seller_shareholder;
        let seller = &mut ctx.accounts.seller_account;
        let pool = &mut ctx.accounts.pool;

        // Check seller does not want SOL.
        require!(
            listing.desired_token.to_string() != "11111111111111111111111111111111",
            ErrorCode::InvalidToken
        );

        // Validate the listing PDA (Done here to reduce stack size)
        let (expected_listing_pda, _bump) = Pubkey::find_program_address(
            &[
                b"listing",
                pool.key().as_ref(),
                seller.key().as_ref(),
                listing.listing_id.as_bytes(),
            ],
            ctx.program_id,
        );
    
        require!(
            listing.key() == expected_listing_pda,
            ErrorCode::InvalidListingAccount
        );

        // Update buyers share counts
        buyer_shareholder.shares = buyer_shareholder
            .shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        buyer_shareholder.available_shares = buyer_shareholder
            .available_shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Properly initialise data if buyer is a new shareholder
        buyer_shareholder.owner = ctx.accounts.buyer.key();
        buyer_shareholder.pool = pool.key();

        // Update sellers share count
        seller_shareholder.shares = seller_shareholder
            .shares
            .checked_sub(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let total_cost: u64 = listing
            .number_of_shares
            .checked_mul(listing.price_per_share)
            .ok_or(error!(ErrorCode::MathError))?;

        // Fees
        let percent_fee = total_cost
            .checked_div(pool.fee_ratio)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let final_calculated_fee = percent_fee
            .checked_add(transaction_fee)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Transfer token to seller
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_token_account.to_account_info(),
                    to: ctx.accounts.seller_token_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            total_cost,
        )?;

        // Transfer token fee to platform for distribution
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_token_account.to_account_info(),
                    to: ctx.accounts.custodial_token_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            final_calculated_fee,
        )?;

        // Close shareholder account if seller has no more shares
        if seller_shareholder.shares == 0 {
            seller_shareholder.close(seller.to_account_info())?;
        }

        emit!(BuyListingEvent {
            listing_id: listing.listing_id.to_string(),
            transaction_type: "P2P Sale".to_string(),
            pool: pool.key(),
            token: listing.desired_token,
            buyer: buyer_shareholder.owner,
            seller: seller_shareholder.owner,
            number_of_shares: listing.number_of_shares,
            price_per_share: listing.price_per_share,
            amount: total_cost,
            fee: final_calculated_fee,
            timestamp: Clock::get()?.unix_timestamp,
        });


        Ok(())
    }
    
    pub fn buy_listing_with_lamports(ctx: Context<BuyListingWithLamports>, transaction_fee: u64) -> Result<()> {
        
        let listing = &mut ctx.accounts.share_listing;
        let buyer_shareholder = &mut ctx.accounts.buyer_shareholder;
        let seller_shareholder = &mut ctx.accounts.seller_shareholder;
        let seller = &mut ctx.accounts.seller_account;
        let pool = &mut ctx.accounts.pool;

        // Check seller wants SOL
        require!(
            listing.desired_token.to_string() == "11111111111111111111111111111111",
            ErrorCode::InvalidToken
        );

        // Validate the listing PDA (Done here to reduce stack size)
        let (expected_listing_pda, _bump) = Pubkey::find_program_address(
            &[
                b"listing",
                pool.key().as_ref(),
                seller.key().as_ref(),
                listing.listing_id.as_bytes(),
            ],
            ctx.program_id,
        );
    
        require!(
            listing.key() == expected_listing_pda,
            ErrorCode::InvalidListingAccount
        );

        // Update buyers share counts
        buyer_shareholder.shares = buyer_shareholder
            .shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        buyer_shareholder.available_shares = buyer_shareholder
            .available_shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Properly initialise data if buyer is a new shareholder
        buyer_shareholder.owner = ctx.accounts.buyer.key();
        buyer_shareholder.pool = pool.key();

        // Update sellers share count
        seller_shareholder.shares = seller_shareholder
            .shares
            .checked_sub(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let total_cost: u64 = listing
            .number_of_shares
            .checked_mul(listing.price_per_share)
            .ok_or(error!(ErrorCode::MathError))?;

        // Fees
        let percent_fee = total_cost
            .checked_div(pool.fee_ratio)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let final_calculated_fee = percent_fee
            .checked_add(transaction_fee)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Transfer SOL to seller
        let transfer_to_seller_instruction = anchor_lang::solana_program::system_instruction::transfer(&ctx.accounts.buyer.key(), &seller.key(), total_cost);

        anchor_lang::solana_program::program::invoke(
            &transfer_to_seller_instruction,
            &[
                ctx.accounts.buyer.to_account_info(),
                seller.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Transfer fee to custodial account
        let transfer_fee_instruction = anchor_lang::solana_program::system_instruction::transfer(&ctx.accounts.buyer.key(), &ctx.accounts.custodial_account.key(), final_calculated_fee);

        anchor_lang::solana_program::program::invoke(
            &transfer_fee_instruction,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.custodial_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Close shareholder account if seller has no more shares
        if seller_shareholder.shares == 0 {
            seller_shareholder.close(seller.to_account_info())?;
        }

        emit!(BuyListingEvent {
            listing_id: listing.listing_id.to_string(),
            transaction_type: "P2P Sale".to_string(),
            pool: pool.key(),
            token: listing.desired_token,
            buyer: buyer_shareholder.owner,
            seller: seller_shareholder.owner,
            number_of_shares: listing.number_of_shares,
            price_per_share: listing.price_per_share,
            amount: total_cost,
            fee: final_calculated_fee,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

/// State
#[derive(Accounts)]
#[instruction(pool_name: String)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR + Pool::INIT_SPACE,
        seeds = [
            b"pool",
            authority.key().as_ref(),
            pool_name.as_bytes(),
        ],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        mut,
        constraint = validate_authority(authority.key(), UPGRADE_AUTHORITY) @ ErrorCode::InvalidAuthority
    )]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(InitSpace)]
#[account]
pub struct Pool {
    #[max_len(32)]
    pub pool_name: String,          // 32 bytes
    pub admin_authority: Pubkey,    // 32 bytes
    pub total_shares: u64,          // 8 bytes
    pub available_shares: u64,      // 8 bytes
    pub is_frozen: bool,            // 1 byte

    // Fees
    pub ubc_mint: Pubkey,           // 32 bytes
    pub compute_mint: Pubkey,       // 32 bytes
    pub fee_ratio: u64,             // 8 bytes

    // Recipients
    pub custodial_account: Pubkey,  // 32 bytes
}

#[derive(Accounts)]
pub struct CreateShareholder<'info> {
    #[account(
        mut,
        constraint = !pool.is_frozen @ ErrorCode::PoolFrozen,  // Pool should NOT be frozen
        constraint = pool.available_shares > 0 @ ErrorCode::InsufficientShares  // Should have shares available
    )]
    pub pool: Box<Account<'info, Pool>>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = ANCHOR_DISCRIMINATOR + Shareholder::INIT_SPACE,
        seeds = [
            b"shareholder",
            pool.key().as_ref(),
            buyer.key().as_ref()
        ],
        bump
    )]
    pub shareholder: Box<Account<'info, Shareholder>>,

    #[account(
        mut,
        constraint = compute_mint_account.key() == pool.compute_mint @ ErrorCode::InvalidToken
    )]
    pub compute_mint_account: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = ubc_mint_account.key() == pool.ubc_mint @ ErrorCode::InvalidToken
    )]
    pub ubc_mint_account: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = compute_mint_account,
        associated_token::authority = buyer,
    )]
    pub sender_compute_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = buyer,
    )]
    pub sender_ubc_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: This is the platform account that receives fees and is verified by pool.custodial_account
    #[account(
        constraint = custodial_account.key() == pool.custodial_account @ ErrorCode::InvalidAuthority
    )]
    pub custodial_account: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = compute_mint_account,
        associated_token::authority = custodial_account,
    )]
    pub custodial_compute_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = custodial_account,
    )]
    pub custodial_ubc_account: Box<Account<'info, TokenAccount>>,

    // The account that will own the shares
    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(InitSpace)]
#[account]
pub struct Shareholder {
    pub pool: Pubkey,          // 32 bytes
    pub owner: Pubkey,         // 32 bytes
    pub shares: u64,           // 8 bytes
    pub available_shares: u64, // 8 bytes
}

#[derive(Accounts)]
pub struct UpdatePool<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,

    #[account(
        mut,
        constraint = authority.key() == pool.admin_authority.key() @ ErrorCode::InvalidAuthority,
    )]
    pub authority: Signer<'info>,
}

#[derive(InitSpace)]
#[account]
pub struct ShareListing {
    pub pool: Pubkey,              // 32 bytes
    pub seller: Pubkey,            // 32 bytes
    pub shareholder: Pubkey,       // 32 bytes
    pub number_of_shares: u64,     // 8 bytes
    pub price_per_share: u64,      // 8 bytes
    pub desired_token: Pubkey,     // 32 bytes
    #[max_len(32)]
    pub listing_id: String, // 32 bytes
}

#[derive(Accounts)]
#[instruction(listing_id: String)]
pub struct CreateListing<'info> {
    #[account(
        mut,
        constraint = shareholder.owner == seller.key() @ ErrorCode::InvalidAuthority,
        constraint = shareholder.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub shareholder: Account<'info, Shareholder>,

    #[account(
        init,
        payer = seller,
        space = ANCHOR_DISCRIMINATOR + ShareListing::INIT_SPACE,
        seeds = [
            b"listing",
            pool.key().as_ref(),
            seller.key().as_ref(),
            listing_id.as_bytes()
        ],
        bump
    )]
    pub share_listing: Account<'info, ShareListing>,

    #[account(mut)]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(
        mut,
        constraint = share_listing.seller == seller.key() @ ErrorCode::InvalidAuthority,
        constraint = share_listing.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub share_listing: Account<'info, ShareListing>,

    #[account(
        mut,
        constraint = shareholder.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub shareholder: Account<'info, Shareholder>,

    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyListing<'info> {
    #[account(
        mut,
        constraint = share_listing.seller != buyer.key() @ ErrorCode::CannotPurchaseOwnListing,
        constraint = share_listing.pool == pool.key() @ ErrorCode::InvalidPool,
        close = seller_account
    )]
    pub share_listing: Box<Account<'info, ShareListing>>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = ANCHOR_DISCRIMINATOR + Shareholder::INIT_SPACE,
        seeds = [
            b"shareholder",
            pool.key().as_ref(),
            buyer.key().as_ref()
        ],
        bump
    )]
    pub buyer_shareholder: Box<Account<'info, Shareholder>>,

    #[account(
        mut,
        constraint = seller_shareholder.owner == share_listing.seller @ ErrorCode::InvalidAuthority,
        constraint = seller_shareholder.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub seller_shareholder: Box<Account<'info, Shareholder>>,

    #[account(mut)]
    pub token_mint_account: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint_account,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: This is the seller account that receives funds
    #[account(
        mut,
        constraint = seller_account.key() == share_listing.seller @ ErrorCode::InvalidAuthority
    )]
    pub seller_account: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = token_mint_account,
        associated_token::authority = seller_account,
    )]
    pub seller_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: This is the platform account from pool
    #[account(
        mut,
        constraint = custodial_account.key() == pool.custodial_account @ ErrorCode::InvalidAuthority
    )]
    pub custodial_account: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = token_mint_account,
        associated_token::authority = custodial_account,
    )]
    pub custodial_token_account: Box<Account<'info, TokenAccount>>,

    pub pool: Box<Account<'info, Pool>>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct BuyListingWithLamports<'info> {
    #[account(
        mut,
        constraint = share_listing.seller != buyer.key() @ ErrorCode::CannotPurchaseOwnListing,
        constraint = share_listing.pool == pool.key() @ ErrorCode::InvalidPool,
        close = seller_account
    )]
    pub share_listing: Box<Account<'info, ShareListing>>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = ANCHOR_DISCRIMINATOR + Shareholder::INIT_SPACE,
        seeds = [
            b"shareholder",
            pool.key().as_ref(),
            buyer.key().as_ref()
        ],
        bump
    )]
    pub buyer_shareholder: Box<Account<'info, Shareholder>>,

    #[account(
        mut,
        constraint = seller_shareholder.owner == share_listing.seller @ ErrorCode::InvalidAuthority,
        constraint = seller_shareholder.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub seller_shareholder: Box<Account<'info, Shareholder>>,

    /// CHECK: This is the seller account that receives funds
    #[account(
        mut,
        constraint = seller_account.key() == share_listing.seller @ ErrorCode::InvalidAuthority
    )]
    pub seller_account: AccountInfo<'info>,

    /// CHECK: This is the platform account from pool
    #[account(
        mut,
        constraint = custodial_account.key() == pool.custodial_account.key() @ ErrorCode::InvalidAuthority
    )]
    pub custodial_account: AccountInfo<'info>,

    pub pool: Box<Account<'info, Pool>>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Utility & Shared Functions

pub fn validate_authority(key: Pubkey, authority: &str) -> bool {
    if let Ok(auth_key) = Pubkey::from_str(authority) {
        key == auth_key
    } else {
        false
    }
}

pub fn validate_whitelisted_token(token: &Pubkey) -> bool {
    WHITELISTED_TOKENS.contains(&token.to_string().as_str())
}

pub fn calculate_share_price(n: u64) -> u64 {
    // Convert to f64 for floating point calculations
    let n_f64 = n as f64;
        
    // Calculate cycle and position within cycle
    let cycle = (n_f64 / 5000.0).floor();
    let x = n_f64 % 5000.0;
    
    // Calculate base price with 35% growth per cycle
    let base = (1.35f64).powf(cycle);
    
    // Calculate multiplier based on position in cycle
    let multiplier = if x <= 1250.0 {
        // Phase 1: Linear up to +30%
        1.0 + (0.30 * x / 1250.0)
    } else if x <= 2500.0 {
        // Phase 2: Linear down to base
        1.30 - (0.30 * (x - 1250.0) / 1250.0)
    } else if x <= 3750.0 {
        // Phase 3: Linear down to -30%
        1.0 - (0.30 * (x - 2500.0) / 1250.0)
    } else {
        // Phase 4: Linear up to base
        0.70 + (0.30 * (x - 3750.0) / 1250.0)
    };
    
    // Calculate final price and convert to u64 with 6 decimal places
    return (base * multiplier * 1_000_000.0).round() as u64
}

/// Events
#[event]
pub struct BuyListingEvent {
    pub listing_id: String,
    pub transaction_type: String,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub pool: Pubkey,
    pub token: Pubkey,
    pub number_of_shares: u64,
    pub price_per_share: u64,
    pub amount: u64,
    pub fee: u64,
    pub timestamp: i64,
}

#[event]
pub struct PurchaseSharesEvent {
    pub transaction_type: String,
    pub buyer: Pubkey,
    pub pool: Pubkey,
    pub number_of_shares: u64,
    pub price_per_share: u64,
    pub amount: u64,
    pub fee: u64,
    pub timestamp: i64,
}

/// Error Codes

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid Authority")]
    InvalidAuthority,
    #[msg("Pool is frozen")]
    PoolFrozen,
    #[msg("Insufficient shares available")]
    InsufficientShares,
    #[msg("Maximum number of whitelisted tokens reached")]
    MaxWhitelistedTokensReached,
    #[msg("Invalid payment amount")]
    InvalidPaymentAmount,
    #[msg("Invalid token account owner")]
    InvalidTokenAccountOwner,
    #[msg("Invalid token")]
    InvalidToken,
    #[msg("Invalid payment token")]
    InvalidPaymentToken,
    #[msg("Invalid fee token")]
    InvalidFeeToken,
    #[msg("Invalid amount for operation")]
    InvalidAmount,
    #[msg("Listing is not active")]
    ListingNotActive,
    #[msg("Cannot purchase your own listing")]
    CannotPurchaseOwnListing,
    #[msg("Invalid pool for operation")]
    InvalidPool,
    #[msg("Pool name exceeds maximum length")]
    InvalidPoolNameLength,
    #[msg("Math operation failed")]
    MathError,
    #[msg("Too many shares, limit 1000")]
    TooManyShares,
    #[msg("Token not in whitelist")]
    TokenNotWhitelisted,
    #[msg("Could not initialise new shareholder account")]
    ShareholderInitialisationFailed,
    #[msg("Invalid listing account")]
    InvalidListingAccount,
}