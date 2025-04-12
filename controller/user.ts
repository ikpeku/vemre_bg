import User from "../model/user"
import { Response, NextFunction } from 'express';
import { errorHandler } from "../utils/errorHandler";
import { IRequest } from "../types";
import { responseResult } from "../utils/response";
import { Notification, Transaction} from '../model';
import { processImage } from "../utils/cloudinaryPhoto";

import Stripe from "stripe"


const stripe = new Stripe(process.env.Secret_Key!);


export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
    const {
        dob,
        fullname,
        gender,
        country,
        city,
        phone_number,
        facebook,
        instagram,
        twitter

    } = req.body;


    try {
       
        if(!req.payload) return errorHandler(res, 500,"user not login in" );

        const user = await User.findById(req?.payload.userId);

        if(!user) return errorHandler(res, 500,"failed" );

            user.fullname = fullname
            user.gender = gender
            user.dob = dob
            user.country = country
            user.city = city
            user.phone_number = phone_number
            user.social.facebook = facebook
            user.social.instagram = instagram
            user.social.twitter = twitter
    
            if(req.file) {
            const image  =  await processImage(req?.file!, req?.payload?.userId!);
    
            if(image) {
                user.avatar = image;
            }
            }
    
            user.save()

        await responseResult({res, userId: user._id})

    } catch (error:any) {
        next(error)
    }

}


export const others = async (req: IRequest, res: Response, next: NextFunction) => {
    const {
        fullname,
    } = req.body;


    try {

         const user = await User.findById(req?.payload?.userId);

        if (!user) return errorHandler(res, 500, " Not a register user.");


        if(fullname){
            user.fullname = fullname;
        }

        if(req.file) {
        const image  =  await processImage(req?.file!, req?.payload?.userId!);

        if(image) {
            user.avatar = image;
        }
        }

        user.save()

        await responseResult({res, userId: user._id});
       

    } catch (error: any) {
        next(error)
    }

}



export const userNotifications = async (req: IRequest, res: Response, next: NextFunction) => {
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );
      const data = await Notification.find({user: req?.payload.userId}).sort("-createdAt")
  
      res.status(200).json({data})
  
      } catch (error:any) {
          next(error)
      }
  
  }
  



// transaction
export const createTransaction = async (req: IRequest, res: Response, next: NextFunction) => {
    const {
         amount,
        // category,
        description,
        senderName,
        senderEmail,
        senderPhoneNumber,
    } = req.body;
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

      if(amount && description && senderEmail && senderName &&  senderPhoneNumber){
      } else {
        return errorHandler(res, 500,"failed" );
      }



    //   console.log({body: req.body})

    const unit_amount =  parseFloat(amount) * 100;


      const product = await stripe.products.create({
        name: "Pay with Vemre",
        description
      });


      if(!product) return errorHandler(res, 500,"failed" );

        const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount,
        product: product.id,
        });

if(!price) return errorHandler(res, 500,"failed" );

const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  });


if(!paymentLink) return errorHandler(res, 500,"failed" );

     const data =  new Transaction({
        user: req?.payload.userId,
        amount,
        description,
        transactionReference: paymentLink.id,
        type: "Received",
        transactionLink: paymentLink.url,
        // category,
        senderName,
        senderEmail,
        senderPhoneNumber
      });

      data.save();

     
      if(!data) return errorHandler(res, 500,"failed" );

      res.status(200).json({message: "success", data });

  
      } catch (error:any) {
          next(error)
      }
  }
  

// transaction
export const userTransaction = async (req: IRequest, res: Response, next: NextFunction) => {
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

     const data =  await Transaction.find({user:req?.payload.userId}).populate("user", "fullname").sort("-updatedAt");

      res.status(200).json({data});
  
      } catch (error:any) {
          next(error)
      }
  };

// transaction
export const AllUsersTransactions = async (req: IRequest, res: Response, next: NextFunction) => {
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

     const data =  await Transaction.find().populate("user", "fullname").sort("-updatedAt");

      res.status(200).json({data});
  
      } catch (error:any) {
          next(error)
      }
  };


  
export const deleteTransaction = async (req: IRequest, res: Response, next: NextFunction) => {
    const { txndId } = req.params;
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

      const txn =  await Transaction.findOne({user:req?.payload.userId, _id: txndId });

      if(!txn) return errorHandler(res, 500,"failed" );



      const paymentLink = await stripe.paymentLinks.update(txn.transactionReference!,
        {
          active: false
        }
      );

      if(!paymentLink) return errorHandler(res, 500,"failed" );

         await Transaction.deleteOne({user:req?.payload.userId, _id: txndId });

      res.status(200).json({message: "success"});
  
      } catch (error:any) {
          next(error)
      }
  }
  


