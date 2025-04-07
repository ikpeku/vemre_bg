import jwt from "jsonwebtoken";

import { Response, NextFunction } from 'express';

import User from "../model/user"
import { IRequest } from "../types";




export const  getCurrentUser = async (req:IRequest, res:Response, next:NextFunction) => {
  const bearerHeader = req.headers["authorization"];


 

  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
   

    //expected out-put: { email: user.email, userId: user._id, status: user.account_type}
  const payload:any =  jwt.verify(token, process.env.JWT_SIGN!);

  if(payload) {
    const response = await User.findById(payload.userId)

    if (response) {
      req.payload = payload;
    }

  }


  }  
  next();
};
