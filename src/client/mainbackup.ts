import {
  establishConnection,
  establishPayer,
  checkProgram,
  sendTrans,
  sendEmptyTrans,
} from './accountprogram';

async function main() {

  await establishConnection();
  await establishPayer();
  await checkProgram();
  // await sendTrans();
  await sendEmptyTrans()

}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
