use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("your_program_id_here");

#[program]
pub mod compute_claim {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        merkle_root: [u8; 32],
        max_total_claims: u64,
        tokens_per_claim: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.merkle_root = merkle_root;
        state.max_total_claims = max_total_claims;
        state.tokens_per_claim = tokens_per_claim;
        state.total_claimed = 0;
        state.authority = ctx.accounts.authority.key();
        state.token_vault = ctx.accounts.token_vault.key();
        Ok(())
    }

    pub fn claim(
        ctx: Context<Claim>,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;

        // Verify not already claimed
        require!(!state.is_claimed(&ctx.accounts.claimer.key()), ErrorCode::AlreadyClaimed);

        // Verify within max claims
        require!(
            state.total_claimed < state.max_total_claims,
            ErrorCode::MaxClaimsReached
        );

        // Verify merkle proof
        require!(
            verify_proof(&proof, &state.merkle_root, &ctx.accounts.claimer.key()),
            ErrorCode::InvalidProof
        );

        // Transfer tokens
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.token_vault.to_account_info(),
                to: ctx.accounts.claimer_token_account.to_account_info(),
                authority: ctx.accounts.state.to_account_info(),
            },
        );

        token::transfer(
            transfer_ctx.with_signer(&[&[
                b"state",
                &[*ctx.bumps.get("state").unwrap()],
            ]]),
            state.tokens_per_claim,
        )?;

        // Mark as claimed
        state.mark_claimed(&ctx.accounts.claimer.key());
        state.total_claimed += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StateAccount::SPACE,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, StateAccount>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut, seeds = [b"state"], bump)]
    pub state: Account<'info, StateAccount>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub claimer_token_account: Account<'info, TokenAccount>,
    
    pub claimer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct StateAccount {
    pub merkle_root: [u8; 32],
    pub max_total_claims: u64,
    pub tokens_per_claim: u64,
    pub total_claimed: u64,
    pub authority: Pubkey,
    pub token_vault: Pubkey,
    pub claimed_bitmap: Vec<u8>,
}

impl StateAccount {
    pub const SPACE: usize = 32 + 8 + 8 + 8 + 32 + 32 + 1024; // Adjust bitmap size as needed

    pub fn is_claimed(&self, address: &Pubkey) -> bool {
        let index = self.get_claim_index(address);
        let byte_index = index / 8;
        let bit_index = index % 8;
        
        if byte_index >= self.claimed_bitmap.len() {
            return false;
        }
        
        (self.claimed_bitmap[byte_index] & (1 << bit_index)) != 0
    }

    pub fn mark_claimed(&mut self, address: &Pubkey) {
        let index = self.get_claim_index(address);
        let byte_index = index / 8;
        let bit_index = index % 8;
        
        if byte_index >= self.claimed_bitmap.len() {
            self.claimed_bitmap.resize(byte_index + 1, 0);
        }
        
        self.claimed_bitmap[byte_index] |= 1 << bit_index;
    }

    fn get_claim_index(&self, address: &Pubkey) -> usize {
        // Simple hash-based index
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        address.hash(&mut hasher);
        (hasher.finish() % 8192) as usize // Adjust max claims as needed
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Address has already claimed")]
    AlreadyClaimed,
    #[msg("Maximum number of claims reached")]
    MaxClaimsReached,
    #[msg("Invalid merkle proof")]
    InvalidProof,
}

// Helper function for merkle proof verification
fn verify_proof(proof: &Vec<[u8; 32]>, root: &[u8; 32], leaf: &Pubkey) -> bool {
    // TODO: Implement merkle proof verification
    // This should match the client-side merkle tree implementation
    true
}
