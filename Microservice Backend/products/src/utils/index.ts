import { genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Request } from "express";
import amqplib, { Channel, Connection } from "amqplib";

import { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME } from "../config";

//Utility functions
export async function GenerateSalt() {
  return await genSalt();
}

export async function GeneratePassword(
  password: string | Buffer,
  salt: string
) {
  return await hash(password, salt);
}

export async function ValidatePassword(
  enteredPassword: any,
  savedPassword: any,
  salt: any
) {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
}

export async function GenerateSignature(payload: string | object | Buffer) {
  try {
    return sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function ValidateSignature(req: Request | any) {
  try {
    const signature: any = req.get("Authorization");
    console.log(signature);
    const payload = verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function FormateData(data: any) {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
}

/* ================ Message broker ================== */

//Create a channel
export const CreateChannel = async () => {
  try {
    const connection: Connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel: Channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct");
    return channel;
  } catch (err) {
    throw err;
  }
};

//Publish message
export const PublishMessage = async (channel:Channel, binding_key: string, message: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
  try {
    channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (err) {
    throw err;
  }
};

// Subcribe message
export const SubscribeMessage = async (channel:Channel, binding_key: string) => {
  const appQueue = await channel.assertQueue('QUEUE_NAME');
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
  channel.consume(appQueue.queue, (data: any) => {
    console.log("recieved data");
    console.log(data.content.toString());
    channel.ack(data);
  });
};
