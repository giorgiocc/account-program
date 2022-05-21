import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import * as borsh from 'borsh';
import {getPayer, getRpcUrl, createKeypairFromFile} from './utils';
import question from "./question"


let connection: Connection;
let payer: Keypair;
let programId: PublicKey;
let greetedPubkey: PublicKey;

const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'accountprogram.so');
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'accountprogram-keypair.json');

class GreetingAccount {
  id = 0;
  name = "0";
  constructor(fields: {name: string, id: number}| undefined = undefined) {
    if (fields) {
      this.id = fields.id;
      this.name = fields.name
    }
  }
}

const GreetingSchema = new Map([
  [GreetingAccount, {kind: 'struct', fields: [['id', 'u32'], ['name', 'string']]}],
]);

const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount(),
).length;

export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
}

export async function establishPayer(): Promise<void> {
  let fees = 0;
  if (!payer) {
    const {lastValidBlockHeight} = await connection.getLatestBlockhash();
    fees += await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);
    payer = await getPayer();
  }

  let lamports = await connection.getBalance(payer.publicKey);
  if (lamports < fees) {
    const sig = await connection.requestAirdrop(
      payer.publicKey,
      fees - lamports,
    );
    await connection.confirmTransaction(sig);
    lamports = await connection.getBalance(payer.publicKey);
  }

  console.log(
    'Using account',
    payer.publicKey.toBase58(),
    'containing',
    lamports / LAMPORTS_PER_SOL,
    'SOL to pay for fees',
  );
}

export async function checkProgram(): Promise<void> {
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/accountprogram.so\``,
    );
  }

  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        'Program needs to be deployed with `solana program deploy dist/program/accountprogram.so`',
      );
    } else {
      throw new Error('Program needs to be built and deployed');
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);



  const GREETING_SEED = "saeed";
  greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId,
  );

  const greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      'Creating account',
      greetedPubkey.toBase58(),
      'to store',
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}


export async function sendTrans(): Promise<void> {
  const userName = await question("What is your name?: ");
  console.log('Creating account for: ', userName)
  console.log('Sending Transaction', greetedPubkey.toBase58());
  const instruction = new TransactionInstruction({
    keys: [{pubkey: greetedPubkey, isSigner: false, isWritable: true}],
    programId,
    data: Buffer.from(borsh.serialize(
      GreetingSchema,
      new GreetingAccount({id: 25, name: userName}),
    )),
  });
  await sendAndConfirmTransaction(
    connection, 
    new Transaction().add(instruction),
    [payer],
  );
}