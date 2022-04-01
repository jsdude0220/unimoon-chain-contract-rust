use anchor_lang::prelude::*;

declare_id!("ErjUjtqKE5AGWUsjseSJCVLtddM6rhaMbDqmhzraF9h6");

#[program]
pub mod capture_actions {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
