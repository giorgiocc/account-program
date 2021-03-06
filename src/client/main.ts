import {
  establishConnection,
  establishPayer,
  checkProgram,
  sendTrans,
  getAccountData,
} from './accountprogram';

async function main() {

  await establishConnection();
  await establishPayer();
  await checkProgram();
  await sendTrans();
  await getAccountData();
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
