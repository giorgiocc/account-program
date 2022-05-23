use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    // log::{sol_log_slice},
    program_error::ProgramError,
    pubkey::Pubkey};
// use {std::str::FromStr};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
    pub id: u32,
    pub name: String
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo], 
    instruction_data: &[u8], 
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }
    let msg = GreetingAccount::deserialize(&mut &instruction_data[..])?;

    // msg!("formatted {}: {:?}", "message", instruction_data);
    msg!("formatted {}: {:?}", "message", msg);

    


    Ok(())
}