import { config } from 'dotenv';
const dev = process.env.NODE_ENV !== 'production';
config({ path: `.env.${dev ? 'development' : process.env.NODE_ENV}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MONGODB_URI,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRY,
  FORGET_PASSWORD_EXPIRE,
  BASE_URL,

  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID,
  APP_NAME,
} = process.env;
