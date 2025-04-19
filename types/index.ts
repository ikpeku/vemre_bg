import { Request } from "express"
import { Types} from "mongoose";
export interface IuserSchema {
  avatar: string,
  account_status: "Basic" | "Platinum" | "Gold",
  subscribeAt: Date,
  email: string,
  password: string,
  fullname: string,
  phone_number: string,

  gender: string,
  dob:Date,
  country: string,
  city: string,
  social: {
    facebook:string,
    twitter: string,
    instagram: string,
  },
  
  account_type: "User" | 'Admin',
  verify_account: boolean
}


export interface IRequest extends Request {
  payload?: {
    email: string,
    userId: string,
    status: 'User' | "Admin",
  }
}


export type Transfer = {
  userId: Types.ObjectId,
  amount: number, 
  recipientCode: string
}