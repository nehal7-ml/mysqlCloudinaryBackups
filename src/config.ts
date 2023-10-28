import dotenv from "dotenv";
dotenv.config();

const env = process.env;
const config = {
  DATABASE: {
    MYSQL_USERNAME: env.MYSQL_USERNAME,
    MYSQL_PASSWORD: env.MYSQL_PASSWORD,
    MYSQL_HOST: env.MYSQL_HOST,
    MYSQL_PORT: env.MYSQL_PORT,
    MYSQL_DATABASE: env.MYSQL_DATABASE,
  },
  CLOUDINARY: {
    CLOUD_NAME: env.CLOUD_NAME,
    API_KEY: env.API_KEY,
    API_SECRET: env.API_SECRET,
  },
  CRON_SCHEDULE: {
    DAILY: '0 1 * * *', //daily at 01 AM
    WEEKLY: '0 3 * * 1', //weekly on mondays at 3 AM
    MONTHLY: '0 6 1 * *', //first day of month at 6 AM
    EVERY_TWO_DAYS: '0 23 */2 * *' //every two days at 11 PM
    //feel free to add your personal preferences
  },
  DEFAULT_CRON_SCHEDULE: env.BACKUP_CRON_SCHEDULE ?? '0 1 * * *', //daily at 01 AM,
  ZIP_PASSWORD: env.ZIP_PASSWORD
};

export default config;
