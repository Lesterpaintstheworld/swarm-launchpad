use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, TokenAccount, Transfer},
    token_interface::TokenInterface,
};
use std::str::FromStr;

#[constant]
pub const UPGRADE_AUTHORITY: &str = "4aBdwukwSS7pmGHiCdFFQ4fm6mUzMLFfXN87jBdWsCH2";
pub const ANCHOR_DISCRIMINATOR: usize = 8;
pub const SLIPPAGE_TOLERANCE: u64 = 5; // 5%

declare_id!("program_id");

#[program]
pub mod ubclaunchpad {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializePool>,
        pool_name: String,
        total_shares: u64,
        fee_ratio: u64, // typically 50 for 5%
        compute_mint: Pubkey,
        ubc_mint: Pubkey,
        partner_account: Pubkey,
        swarm_account: Pubkey,
        investor_redistribution_account: Pubkey,
        platform_account: Pubkey,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        pool.pool_name = pool_name;
        pool.admin_authority = ctx.accounts.authority.key();
        pool.total_shares = total_shares;
        pool.available_shares = total_shares;
        pool.is_frozen = false;

        pool.ubc_mint = ubc_mint;
        pool.compute_mint = compute_mint;
        pool.fee_ratio = fee_ratio;

        pool.partner_account = partner_account;
        pool.swarm_account = swarm_account;
        pool.investor_redistribution_account = investor_redistribution_account;
        pool.platform_account = platform_account;

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

    pub fn set_accounts(
        ctx: Context<UpdatePool>,
        partner_account: Pubkey,
        swarm_account: Pubkey,
        investor_redistribution_account: Pubkey,
        platform_account: Pubkey,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        pool.partner_account = partner_account;
        pool.swarm_account = swarm_account;
        pool.investor_redistribution_account = investor_redistribution_account;
        pool.platform_account = platform_account;

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

    pub fn purchase_shares(
        ctx: Context<CreateShareholder>,
        number_of_shares: u64,
        calculated_cost: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        // Check if pool is frozen
        require!(!pool.is_frozen, ErrorCode::PoolFrozen);

        // Check if enough shares are available
        require!(
            pool.available_shares >= number_of_shares,
            ErrorCode::InsufficientShares
        );

        // Calculate the price per share with bonding curve
        let price_per_share = calculate_share_price(pool.available_shares)?;

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

        // Fees
        let ubc_fee_amount = total_cost
            .checked_div(pool.fee_ratio)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Split fees equally between partner and investor
        let partner_fee = ubc_fee_amount
            .checked_div(2)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let platform_fee = ubc_fee_amount;

        // Transfer compute to swarm fund
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.sender_compute_account.to_account_info(),
                    to: ctx.accounts.swarm_compute_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            total_cost * 10u64.pow(ctx.accounts.compute_mint_account.decimals as u32),
        )?;

        // Transfer fees to partner
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.sender_ubc_account.to_account_info(),
                    to: ctx.accounts.partner_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            partner_fee * 10u64.pow(ctx.accounts.ubc_mint_account.decimals as u32),
        )?;

        // Transfer fees to platform
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.sender_ubc_account.to_account_info(),
                    to: ctx.accounts.platform_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            platform_fee * 10u64.pow(ctx.accounts.ubc_mint_account.decimals as u32),
        )?;

        Ok(())
    }

    pub fn create_listing(
        ctx: Context<CreateListing>,
        listing_id: String,
        number_of_shares: u64,
        price_per_share: u64,
        wanted_token_mint: Pubkey,
    ) -> Result<()> {
        // Check if shareholder has enough available shares
        require!(
            ctx.accounts.shareholder.available_shares >= number_of_shares,
            ErrorCode::InsufficientShares
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
        listing.is_active = true;
        listing.listing_id = listing_id;

        // If this token is not UBC or COMPUTE, UBC will be used on sale.
        listing.wanted_token_mint = wanted_token_mint;

        Ok(())
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        let listing = &mut ctx.accounts.share_listing;
        let shareholder = &mut ctx.accounts.shareholder;
        let receiver = &mut ctx.accounts.seller;

        require!(listing.is_active, ErrorCode::ListingNotActive);

        // Return shares to seller's available balance
        shareholder.available_shares = shareholder
            .available_shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Deactivate the listing
        listing.close(receiver.to_account_info())?;

        Ok(())
    }

    pub fn buy_listing(ctx: Context<BuyListing>) -> Result<()> {
        let listing = &mut ctx.accounts.share_listing;
        let buyer_shareholder = &mut ctx.accounts.buyer_shareholder;
        let seller_shareholder = &mut ctx.accounts.seller_shareholder;
        let receiver = &mut ctx.accounts.seller_account;
        let pool = &mut ctx.accounts.pool;

        require!(listing.is_active, ErrorCode::ListingNotActive);

        // Update buyer's share counts
        buyer_shareholder.shares = buyer_shareholder
            .shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        buyer_shareholder.available_shares = buyer_shareholder
            .available_shares
            .checked_add(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        buyer_shareholder.owner = ctx.accounts.buyer.key();

        // Update seller's share count
        seller_shareholder.shares = seller_shareholder
            .shares
            .checked_sub(listing.number_of_shares)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let total_cost: u64 = listing
            .number_of_shares
            .checked_mul(listing.price_per_share)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Fees
        let ubc_fee_amount = total_cost
            .checked_div(pool.fee_ratio)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let ubc_fee_fraction = ubc_fee_amount
            .checked_div(5)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        // Split fees equally between partner and investor
        let partner_fee = ubc_fee_fraction
            .checked_mul(2)
            .ok_or(error!(ErrorCode::InvalidAmount))?;

        let platform_fee = ubc_fee_amount;

        let investor_fee = ubc_fee_fraction;

        // Transfer compute to seller
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_compute_account.to_account_info(),
                    to: ctx.accounts.seller_compute_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            total_cost * 10u64.pow(ctx.accounts.compute_mint_account.decimals as u32),
        )?;

        // Transfer fees to partner
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_ubc_account.to_account_info(),
                    to: ctx.accounts.partner_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            partner_fee * 10u64.pow(ctx.accounts.ubc_mint_account.decimals as u32),
        )?;

        // Transfer fees to platform
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_ubc_account.to_account_info(),
                    to: ctx.accounts.platform_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            platform_fee * 10u64.pow(ctx.accounts.ubc_mint_account.decimals as u32),
        )?;

        // Transfer fees to investors
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer_ubc_account.to_account_info(),
                    to: ctx.accounts.investor_ubc_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            investor_fee * 10u64.pow(ctx.accounts.ubc_mint_account.decimals as u32),
        )?;

        // Deactivate the listing
        listing.close(receiver.to_account_info())?;

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
    #[max_len(64)]
    pub pool_name: String,
    pub admin_authority: Pubkey, // 32 bytes
    pub total_shares: u64,       // 8 bytes
    pub available_shares: u64,   // 8 bytes
    pub is_frozen: bool,         // 1 byte

    // Fees
    pub ubc_mint: Pubkey,     // 32 bytes
    pub compute_mint: Pubkey, // 32 bytes
    pub fee_ratio: u64,       // 8 bytes

    // Recipients
    pub partner_account: Pubkey,
    pub swarm_account: Pubkey,
    pub investor_redistribution_account: Pubkey,
    pub platform_account: Pubkey,
}

#[derive(Accounts)]
pub struct CreateShareholder<'info> {
    #[account(
        mut,
        constraint = !pool.is_frozen @ ErrorCode::PoolFrozen,  // Pool should NOT be frozen
        constraint = pool.available_shares > 0 @ ErrorCode::InsufficientShares  // Should have shares available
    )]
    pub pool: Account<'info, Pool>,

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
    pub shareholder: Account<'info, Shareholder>,

    #[account(mut)]
    pub compute_mint_account: Account<'info, Mint>,

    #[account(mut)]
    pub ubc_mint_account: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = compute_mint_account,
        associated_token::authority = buyer,
    )]
    pub sender_compute_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = compute_mint_account,
        associated_token::authority = buyer,
    )]
    pub sender_ubc_account: Account<'info, TokenAccount>,

    // CHECK: This is the swarm account from pool
    #[account(
        constraint = swarm_account.key() == pool.swarm_account @ ErrorCode::InvalidAuthority
    )]
    pub swarm_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = compute_mint_account,
        associated_token::authority = swarm_account,
    )]
    pub swarm_compute_account: Account<'info, TokenAccount>,

    // CHECK: This is the partner account from pool
    #[account(
        constraint = partner_account.key() == pool.partner_account @ ErrorCode::InvalidAuthority
    )]
    pub partner_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = partner_account,
    )]
    pub partner_ubc_account: Account<'info, TokenAccount>,

    // CHECK: This is the platform account from pool
    #[account(
        constraint = platform_account.key() == pool.platform_account @ ErrorCode::InvalidAuthority
    )]
    pub platform_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = platform_account,
    )]
    pub platform_ubc_account: Account<'info, TokenAccount>,

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
    pub is_active: bool,           // 1 byte
    pub wanted_token_mint: Pubkey, // 32 bytes
    #[max_len(64)]
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
        constraint = share_listing.is_active @ ErrorCode::ListingNotActive,
        constraint = share_listing.seller != buyer.key() @ ErrorCode::CannotPurchaseOwnListing,
        constraint = share_listing.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub share_listing: Account<'info, ShareListing>,

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
    pub buyer_shareholder: Account<'info, Shareholder>,

    #[account(
        mut,
        constraint = seller_shareholder.owner == share_listing.seller @ ErrorCode::InvalidAuthority,
        constraint = seller_shareholder.pool == pool.key() @ ErrorCode::InvalidPool,
    )]
    pub seller_shareholder: Account<'info, Shareholder>,

    #[account(mut)]
    pub compute_mint_account: Account<'info, Mint>,

    #[account(mut)]
    pub ubc_mint_account: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = compute_mint_account,
        associated_token::authority = buyer,
    )]
    pub buyer_compute_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = compute_mint_account,
        associated_token::authority = buyer,
    )]
    pub buyer_ubc_account: Account<'info, TokenAccount>,

    #[account(
        constraint = seller_account.key() == share_listing.seller @ ErrorCode::InvalidAuthority
    )]
    pub seller_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = compute_mint_account,
        associated_token::authority = seller_account,
    )]
    pub seller_compute_account: Account<'info, TokenAccount>,

    #[account(
        constraint = investor_account.key() == pool.investor_redistribution_account @ ErrorCode::InvalidAuthority
    )]
    pub investor_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = compute_mint_account,
        associated_token::authority = investor_account,
    )]
    pub investor_ubc_account: Account<'info, TokenAccount>,

    #[account(
        constraint = partner_account.key() == pool.partner_account @ ErrorCode::InvalidAuthority
    )]
    pub partner_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = partner_account,
    )]
    pub partner_ubc_account: Account<'info, TokenAccount>,

    #[account(
        constraint = platform_account.key() == pool.platform_account @ ErrorCode::InvalidAuthority
    )]
    pub platform_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = ubc_mint_account,
        associated_token::authority = platform_account,
    )]
    pub platform_ubc_account: Account<'info, TokenAccount>,

    // Transfer accounts
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

/// Utility & Shared Functions

pub fn validate_authority(key: Pubkey, authority: &str) -> bool {
    if let Ok(auth_key) = Pubkey::from_str(authority) {
        key == auth_key
    } else {
        false
    }
}

// Calculate price for shares based on position and bonding curve
pub fn calculate_share_price(position: u64) -> Result<u64> {
    // Constants
    const CYCLE_SIZE: u64 = 5000;
    const PHASE_SIZE: u64 = 1250;
    const BASE_PRICE: u64 = 1_000_000; // 1.0 with 6 decimals precision
    const THIRTY_PERCENT: u64 = 300_000; // 0.3 with 6 decimals precision
    const GROWTH_RATE: u64 = 1_350_000; // 1.35 with 6 decimals precision

    // Calculate cycle and position within cycle
    let cycle = position
        .checked_div(CYCLE_SIZE)
        .ok_or(error!(ErrorCode::MathError))?;
    let x = position
        .checked_rem(CYCLE_SIZE)
        .ok_or(error!(ErrorCode::MathError))?;

    // Calculate base price with 35% growth per cycle
    let mut base = BASE_PRICE;
    for _ in 0..cycle {
        base = base
            .checked_mul(GROWTH_RATE)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?;
    }

    // Calculate modifier based on position within cycle
    let modifier = if x <= PHASE_SIZE {
        // Phase 1: Linear up to +30%
        let ratio = x
            .checked_mul(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(PHASE_SIZE)
            .ok_or(error!(ErrorCode::MathError))?;
        BASE_PRICE
            .checked_add(
                THIRTY_PERCENT
                    .checked_mul(ratio)
                    .ok_or(error!(ErrorCode::MathError))?
                    .checked_div(BASE_PRICE)
                    .ok_or(error!(ErrorCode::MathError))?,
            ).ok_or(error!(ErrorCode::MathError))?
    } else if x <= PHASE_SIZE
        .checked_mul(2)
        .ok_or(error!(ErrorCode::MathError))?
    {
        // Phase 2: Linear down to base
        let adjusted_x = x
            .checked_sub(PHASE_SIZE)
            .ok_or(error!(ErrorCode::MathError))?;
        let ratio = adjusted_x
            .checked_mul(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(PHASE_SIZE)
            .ok_or(error!(ErrorCode::MathError))?;
        let reduction = THIRTY_PERCENT
            .checked_mul(ratio)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?;
        BASE_PRICE
            .checked_add(THIRTY_PERCENT)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_sub(reduction)
            .ok_or(error!(ErrorCode::MathError))?
    } else if x <= PHASE_SIZE
        .checked_mul(3)
        .ok_or(error!(ErrorCode::MathError))?
    {
        // Phase 3: Linear down to -30%
        let adjusted_x = x
            .checked_sub(
                PHASE_SIZE
                    .checked_mul(2)
                    .ok_or(error!(ErrorCode::MathError))?,
            ).ok_or(error!(ErrorCode::MathError))?;
        let ratio = adjusted_x
            .checked_mul(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(PHASE_SIZE)
            .ok_or(error!(ErrorCode::MathError))?;
        BASE_PRICE
            .checked_sub(
                THIRTY_PERCENT
                    .checked_mul(ratio)
                    .ok_or(error!(ErrorCode::MathError))?
                    .checked_div(BASE_PRICE)
                    .ok_or(error!(ErrorCode::MathError))?,
            ).ok_or(error!(ErrorCode::MathError))?
    } else {
        // Phase 4: Linear up to base
        let adjusted_x = x
            .checked_sub(
                PHASE_SIZE
                    .checked_mul(3)
                    .ok_or(error!(ErrorCode::MathError))?,
            ).ok_or(error!(ErrorCode::MathError))?;
        let ratio = adjusted_x
            .checked_mul(BASE_PRICE)
            .ok_or(error!(ErrorCode::MathError))?
            .checked_div(PHASE_SIZE)
            .ok_or(error!(ErrorCode::MathError))?;
        let base_70 = BASE_PRICE
            .checked_sub(THIRTY_PERCENT)
            .ok_or(error!(ErrorCode::MathError))?;
        base_70
            .checked_add(
                THIRTY_PERCENT
                    .checked_mul(ratio)
                    .ok_or(error!(ErrorCode::MathError))?
                    .checked_div(BASE_PRICE)
                    .ok_or(error!(ErrorCode::MathError))?,
            ).ok_or(error!(ErrorCode::MathError))?
    };

    // Calculate final price
    base.checked_mul(modifier)
        .ok_or(error!(ErrorCode::MathError))?
        .checked_div(BASE_PRICE)
        .ok_or(error!(ErrorCode::MathError))
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
}