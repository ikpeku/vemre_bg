import express from "express"
import { Request, Response, NextFunction } from 'express';
const stripeRoute = express.Router();
// import { onlyAdminUser, onlyLoginUser } from "../utils/helper";
import Stripe from "stripe"
import { Notification, Transaction } from "../model";
import { sendNotification } from "../utils/mailer";

const stripe = new Stripe(process.env.Secret_Key!);

const endpointSecret = process.env.endpointSecret!;

// stripe trigger payment_intent.succeeded

stripeRoute.post("/webhook", express.raw({ type: 'application/json' }), async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body;

    // console.log("ennnnnnnterrr")

    // const sig = req.headers['stripe-signature'];

    // console.log({sig})

    // let event;
    // // console.log("event1: ", {event})
  
    // try {
    //   event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    //   console.log("event2: ", {event})
    // }
    // catch (err:any) {
    //  return res.status(400).send(`Webhook Error: ${err.message}`);
    // }


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

          let message = `Your account has been credited with $${txn.amount} from  ${txn.senderName}.`

        await Notification.create({user: txn.user, message });

        sendNotification({email: txn.senderEmail!, message})

        break;
  
      default:
        break;
    }
    res.json({received: true});

});



export default stripeRoute;