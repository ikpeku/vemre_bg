
import User from "../model/user"
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from "../utils/errorHandler";
import bcrypt from "bcryptjs"
import { IRequest } from "../types";
import { responseResult } from "../utils/response";
import { Notification, PasswordReset } from "../model";

import crypto from "crypto"
import { sendMail, sendNotification } from "../utils/mailer";



export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password,
    } = req.body


    try {

        const isRegisterUser = await User.findOne({ email: email?.toLowerCase() })

        if (isRegisterUser) return errorHandler(res, 500, "user with the email already exist.")


        const hashedPassword = await bcrypt.hash(password, 12);


        const user = await User.create({email, password: hashedPassword});

        if (!user) return errorHandler(res, 500, "registration failed.")
        
             let message = `Welcome to Vemre.`
            
             await Notification.create({user: user._id, message });
            
            sendNotification({email, message})
            
        await responseResult({res, userId: user._id})
        

    } catch (error: any) {
        next(error)
    }

}



export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password
    } = req.body


    try {

        const user = await User.findOne({ email: email?.toLowerCase() });

        if (!user) return errorHandler(res, 500, " Not a register user.")


        const isEqual = await bcrypt.compare(password, user.password);


        if (!isEqual) return errorHandler(res, 500, "Invalid credential")

            await PasswordReset.deleteMany({user: user._id});

            await responseResult({res, userId: user._id})
       

    } catch (error: any) {
        next(error)
    }

}


export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password
    } = req.body


    try {

        const user = await User.findOne({ email: email?.toLowerCase() });

        if (!user) return errorHandler(res, 500, " Not a register user.")


        if (user.account_type === "User") return errorHandler(res, 401, "Not authorise, contact admin")

        


        const isEqual = await bcrypt.compare(password, user.password);


        if (!isEqual) return errorHandler(res, 500, "Invalid credential");



            await PasswordReset.deleteMany({user: user._id});

            await responseResult({res, userId: user._id})
       

    } catch (error: any) {
        next(error)
    }

}



export const forgetPassword = async (req: IRequest, res: Response, next: NextFunction) => {
    const {email} = req.body

   
    // 
    try {

        const isRegisterUser = await User.findOne({ email: email?.toLowerCase()  })

        if (!isRegisterUser) return errorHandler(res, 500, "Not a register user. please check email and try again.");


        const token = crypto.randomInt(1000, 9999).toString();

        await PasswordReset.create({token, user: isRegisterUser._id});

        sendMail({email, verificationToken: token});


        res.status(200).json({message: "successfull"});


    } catch (error: any) {
        next(error)
    }

}

export const changeUserPassword = async (req: IRequest, res: Response, next: NextFunction) => {
    const {
        password,
        code
    } = req.body;

   
    try {

       const isPasswordRequest = await PasswordReset.findOne({token: code});


        if (!isPasswordRequest) return errorHandler(res, 500, "invalid code");

        const user = await User.findById(isPasswordRequest.user)
        if (!user) return errorHandler(res, 500, "failed")

        
        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;

        user.save();

        let message = `Hello ${user.fullname ? "user.fullname" : "user"}, your password was recently changed.`
            
        await Notification.create({user: user._id, message });
       
       sendNotification({email: user.email, message});

        res.status(200).json({message: "successfull"});


    } catch (error: any) {
        next(error)
    }

}



