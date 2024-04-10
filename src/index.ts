import { backup } from "./backup";

// const job = new CronJob(env.CRON_SCHEDULE.MONTHLY, async () => {
//   try {
//     await backup();
//   } catch (error) {
//     console.error("Error while running backup: ", error);
//   }
// });

// job.start();

// uncomment this line below if you want to test/run the cron immediately after deploy your code
void backup();

