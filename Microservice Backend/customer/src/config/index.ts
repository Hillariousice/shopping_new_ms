import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `.env.${process.env.NODE_ENV}`;
  require('dotenv').config({
    path: configFile
  })
} else {
  dotEnv.config();
}


  export const PORT = process.env.PORT as string
  export const DB_URL=  process.env.MONGODB_URI as string
  export const APP_SECRET = process.env.APP_SECRET as string

