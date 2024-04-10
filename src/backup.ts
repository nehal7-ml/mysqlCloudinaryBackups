import { unlink } from "fs";
import { exec } from "child_process";
import env from "./config";
import { cleanupOldAssets, deleteFromCloudinary, uploadToCloudinary } from "./cloudinary";
import yn from 'yn';


const dumpToFile = async (path: string) => {
  console.log("Dumping DB to file...");

  await new Promise((resolve, reject) => {
    const command = `mysqldump --user=${env.DATABASE.MYSQL_USERNAME} --password=${env.DATABASE.MYSQL_PASSWORD} --host=${env.DATABASE.MYSQL_HOST} --port=${env.DATABASE.MYSQL_PORT} --default-character-set=utf8mb4  --single-transaction --routines --triggers --databases ${env.DATABASE.MYSQL_DATABASE} > ${path}`;
    exec(command, (error, _, stderr) => {
      if (error) {
        reject({ error: JSON.stringify(error), stderr });
        return;
      }
      resolve(undefined);
    });
  });

  console.log("DB dumped to file...");
};

const deleteFile = async (path: string) => {
  console.log("Deleting file...");
  await new Promise((resolve, reject) => {
    unlink(path, (err) => {
      if (err) {
        reject({ error: JSON.stringify(err) });
        return;
      }
      resolve(undefined);
    });
  });
};



export const backup = async () => {
  console.log("Initiating DB backup...");
  let fileTag ='database-backup';
  let date = new Date()
  const timestamp = date.toISOString().replace(/[:.]+/g, "-");
  const filename = `backup-${timestamp}.sql`;

  const filepath = process.platform === 'win32' ? `./tmp/${filename}` : `/tmp/${filename}`;

  try {
    await dumpToFile(filepath);
    await uploadToCloudinary({ name: filename, path: filepath, tag: fileTag });

    await deleteFile(filepath);

    if(yn(env.CLOUDINARY.DELETE_OLD)) {
      await cleanupOldAssets(fileTag);
    }
  } catch (error) {
    console.log('An error ocurred!', error);
  }

  console.log("DB backup complete...");
};

