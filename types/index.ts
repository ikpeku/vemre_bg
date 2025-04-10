import { Request } from "express"

export interface IuserSchema {
  avatar: string,
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