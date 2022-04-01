use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod unimoon_base {
    use super::*;

    /// initialize users SAC
    pub fn initialize_users(_ctx: Context<InitializeUsers>) -> Result<()> {
        Ok(())
    }

    /// initialize SAC of media objects
    pub fn initialize_posts(_ctx: Context<InitializePosts>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUsers<'info> {
    #[account(zero)]
    pub unimoon_users: AccountLoader<'info, UnimoonUsers>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializePosts<'info> {
    #[account(zero)]
    pub unimoon_posts: AccountLoader<'info, UnimoonPosts>,
    pub rent: Sysvar<'info, Rent>,
}

#[zero_copy]
pub struct UserSacPair {
    pub user: Pubkey,
    pub sac: u64,
}

#[account(zero_copy)]
pub struct UnimoonUsers {
    pub pairs: [UserSacPair; 25000],
}

#[zero_copy]
pub struct PostSacPair {
    pub post: Pubkey,
    pub sac: u64,
}

#[account(zero_copy)]
pub struct UnimoonPosts {
    pub pairs: [PostSacPair; 25000],
}
