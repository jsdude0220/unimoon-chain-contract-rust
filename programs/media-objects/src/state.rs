use anchor_lang::prelude::*;

#[account]
pub struct Post {
    pub views: u64,
    pub likes: u64,
    pub shares: u64,
    pub total_comments: u64,
    pub downloads: u64,
    pub sac: u64,
    pub creator: Pubkey,
    pub token_account: Pubkey,
}
