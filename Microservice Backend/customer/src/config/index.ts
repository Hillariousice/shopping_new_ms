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
  export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL as string
  export const EXCHANGE_NAME = 'ONLINE_SHOPPING' 
  export const CUSTOMER_BINDING_KEY = 'CUSTOMER_SERVICE'
  export const QUEUE_NAME = 'CUSTOMER_QUEUE'