import {
  establishConnection,
  establishPayer,
  checkProgram,
  sayHello,
} from './accountprogram';

async function main() {

  await establishConnection();
  await establishPayer();
  await checkProgram();
  await sayHello();
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
