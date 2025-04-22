import express from "express"
import { Request, Response, NextFunction } from 'express';
const stripeRoute = express.Router();
import Stripe from "stripe"
import { Notification, Transaction , } from "../model";
import { sendNotification } from "../utils/mailer";
import User from "../model/user"
import { formatInky } from "../utils/curreency";

const stripe = new Stripe(process.env.Secret_Key!);

const endpointSecret = process.env.endpointSecret!;

// stripe trigger payment_intent.succeeded

stripeRoute.post("/webhook", async (req: Request, res: Response, next: NextFunction) => {
    // const event = req.body;

    const sig = req.headers['stripe-signature'];

    if(!sig) {
      console.log("no sig")
      return
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err:any) {
     return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // console.log("event3: ", {event, data: event?.data})

    // Handle the event
    switch (event.type) {

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
       
         const txn =  await Transaction.findOne({transactionReference: metadata.transactionReference});

         if(!txn) {
            break
         }

         txn.isPending = false;

         txn.save();

        await stripe.paymentLinks.update(txn.transactionReference!,
            {
              active: false
            }
          );

          let message = `Your account has been credited with ${formatInky((txn.amount!).toString())} from  ${txn.senderName}.`

         const user = await User.findById(txn.user);

        await Notification.create({user: txn.user, message });

        sendNotification({email: user?.email!, message});
       

        // commission

          let commissionmessage = `Your account has been debited with ${formatInky((txn.amount! * 0.2).toString())  } as stamp duty on electronic funds transfer.`

        const data =  new Transaction({
                user: txn.user,
                amount: txn.amount! * 0.2,
                description: "Stamp Duty On Electronic Funds Transfer",
                transactionReference: txn.transactionReference,
                type: "Withdraw",
                transactionLink: txn.transactionLink,
                isPending: false,
                isVemreCharge: true,
                recipientName: "Vemre Stamp Duty",
                senderEmail: "",
                senderPhoneNumber: ""
              });
        
              data.save();


              await Notification.create({user: txn.user, message:commissionmessage });

              sendNotification({email: user?.email!, message: commissionmessage});
              


        break;
  
      default:
        break;
    }
    res.json({received: true});

});



export default stripeRoute;