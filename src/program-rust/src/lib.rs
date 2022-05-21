use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    // log::{sol_log_slice},
    program_error::ProgramError,
    pubkey::Pubkey,
    
};

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
/////////////////////////////////////////////////////////////////////
    // let mut accounts_iter = GreetingAccount::deserialize(&mut &account.data.borrow()[..])?;
    // let msg = GreetingAccount::deserialize(&mut &instruction_data[..])?;
    // accounts_iter.id = msg.id;
    // accounts_iter.name = msg.name;
    // accounts_iter.serialize(&mut &mut account.data.borrow_mut()[..])?;
    // msg!("Greeted {} time(s)!", accounts_iter.name);

/////////////////////////////////////////////////////////////////////

    let msg = GreetingAccount::deserialize(&mut &instruction_data[..])?;

    msg!("formatted {}: {:?}", "message", instruction_data);
    msg!("formatted {}: {:?}", "message", msg);

    
    Ok(())
}