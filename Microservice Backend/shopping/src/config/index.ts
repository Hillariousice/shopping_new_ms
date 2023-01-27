import dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `.env.dev`;
  require('dotenv').config({
    path: configFile
  })
} else {
  dotEnv.config();
}


  export const PORT = process.env.PORT as string
  console.log(PORT)
  export const DB_URL=  process.env.MONGODB_URI as string
  export const APP_SECRET = process.env.APP_SECRET as string

