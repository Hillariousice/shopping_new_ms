import { genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import {Request} from 'express'
import axios from 'axios'

import { APP_SECRET } from "../config";

//Utility functions
export async function GenerateSalt() {
  return await genSalt();
}

export async function GeneratePassword(password: string | Buffer, salt: string) {
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

export async function ValidateSignature(req:Request | any) {
  try {
    const signature:any = req.get("Authorization");
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

export const PublishedCustomerEvent = async(payload:any)=>{
 
  axios.post('http://localhost:8000/customer/app-events', {
    payload
  })

}

