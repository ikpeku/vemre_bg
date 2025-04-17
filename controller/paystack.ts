
import { Response, NextFunction } from 'express';
import { IRequest } from '../types';
import { errorHandler } from '../utils/errorHandler';
import paystackInstance from '../paystackinstance';
import { getError } from '../utils/requestError';
import { Notification, Transaction } from '../model';
import { formatInky } from '../utils/curreency';
import { sendNotification } from '../utils/mailer';
import User from "../model/user";

export const listBanks = async (req: IRequest, res: Response, next: NextFunction) => {

    try {

       const data = await paystackInstance.get("/bank?country=nigeria");

       if(!data.data){

           return errorHandler(res, 500,"failed" );
       }

        res.status(200).json({...data.data})

    } catch (error) {
        next(error)
    }

}


export const resolveAccountNumber = async (req: IRequest, res: Response, next: NextFunction) => {

    const {account_number, bank_code} = req.body; 

    try {

       const data = await paystackInstance.get(`/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`);

       if(!data.data){

           return errorHandler(res, 500,"failed" );
       }

        res.status(200).json({...data.data})

    } catch (error) {
        const Error = getError(error);
        return errorHandler(res, 500, Error);
    }

}


export const sendMoney = async (req: IRequest, res: Response, next: NextFunction) => {

    const {txnId} = req.body; 

    try {


        // Notification,  

        const response = await Transaction.findById(txnId);


        if(!response){
           return errorHandler(res, 500,"invalid transaction" );
        }

         const user = await User.findById(response.user);

         /**
         *  Create Transfer Recipient
         */

       const  CreateTransferRecipient = await paystackInstance.post("/transferrecipient", {
        type: response?.paystacktype,
        name: response?.recipientName,
        account_number: response?.account_number,
        bank_code: response?.bank_code,
        currency: response?.currency
      });



    if(!CreateTransferRecipient?.data?.data.recipient_code){
           return errorHandler(res, 500,"failed" );
       }
       
        /**
         *  Create Transfer
         */

        const unit_amount =  parseFloat(response?.amount?.toString()!) * 100;

       const  transfer = await paystackInstance.post("/transfer", {
        source: "balance", 
       reason: "self", 
       amount: unit_amount, 
       recipient: CreateTransferRecipient?.data?.data.recipient_code
      });



    if(!transfer?.data?.data.transfer_code){
           return errorHandler(res, 500,"failed" );
       }

   

/**
 * finalize transfer
 */

      const  finalize_transfer = await paystackInstance.post("/transfer/finalize_transfer", {
        transfer_code: transfer?.data?.data.transfer_code
      });

      if(!finalize_transfer?.data){
        return errorHandler(res, 500,"failed" );
      }

       let message = `Your account has been debited with ${formatInky((response.amount!).toString())} withdrawal awas successfully.`

      await Notification.create({user: response.user, message});
       sendNotification({email: user?.email!, message});

        res.status(200).json({message: "success"});


    } catch (error) {
        const Error = getError(error);
        return errorHandler(res, 500, Error);
    }

}




