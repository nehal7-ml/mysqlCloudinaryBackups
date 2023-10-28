import { CronJob } from "cron";
import { backup } from "./backup";
import env from "./config";

const job = new CronJob(env.DEFAULT_CRON_SCHEDULE, async () => {
  try {
    await backup();
  } catch (error) {
    console.error("Error while running backup: ", error);
  }
});

job.start();

// uncomment this line below if you want to test/run the cron immediately after deploy your code
void backup();

console.log("Backup cron scheduled...");
