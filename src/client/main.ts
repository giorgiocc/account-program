import {
  establishConnection,
  establishPayer,
  checkProgram,
  sendTrans,
} from './accountprogram';

async function main() {

  await establishConnection();
  await establishPayer();
  await checkProgram();
  await sendTrans();

}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
