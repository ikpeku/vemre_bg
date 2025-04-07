import User from "../model/user"
import { Response, NextFunction } from 'express';
import { errorHandler } from "../utils/errorHandler";
import { IRequest } from "../types";
import { responseResult } from "../utils/response";
import { Notification, Transaction} from '../model';
import { processImage } from "../utils/cloudinaryPhoto";


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
        category,
        description,
    } = req.body
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

     const data =  new Transaction({
        user: req?.payload.userId,
        amount,
        // category,
        description,
        transactionReference: Math.random() * Math.random() * 3000,
        senderName: "Ken Simon" + Math.floor(Math.random() * 1000),
        type: "Received",
        transactionLink: "stripe.com"
      });

      data.save();

     
      if(!data) return errorHandler(res, 500,"failed" );

      res.status(200).json({message: "success", data});
  
      } catch (error:any) {
          next(error)
      }
  }
  

// transaction
export const userTransaction = async (req: IRequest, res: Response, next: NextFunction) => {
   
    try {
      if(!req.payload) return errorHandler(res, 500,"user not login in" );

     const data =  await Transaction.find({user:req?.payload.userId});

      res.status(200).json({data});
  
      } catch (error:any) {
          next(error)
      }
  }
  


