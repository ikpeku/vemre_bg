const axios = require('axios');

import { Notification, Transaction } from "../model";
import { type Transfer } from "../types";


async function payoutToUser ({userId, amount, recipientCode}: Transfer) {


    const wallet = await Transaction.findOne({ userId });




    // if (!wallet || wallet.balance < amount) {
    //     throw new Error('Insufficient balance');
    // }

    // Call Paystack Transfer API
    const response = await axios.post(
        'https://api.paystack.co/transfer',
        {
            source: 'balance',
            amount: amount * 100, // Paystack uses kobo
            recipient: recipientCode,
            reason: 'Wallet withdrawal',
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    // On success, deduct from wallet
    if (response.data.status) {
        // wallet.balance -= amount;
        // await wallet.save();
        return response.data;
    } else {
        throw new Error('Transfer failed');
    }
}



const recipientRes =  axios.post(
    'https://api.paystack.co/transferrecipient',
    {
        type: 'nuban',
        name: 'John Doe',
        account_number: '0123456789',
        bank_code: '058', // GTBank for example
        currency: 'NGN',
    },
    {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    }
);

// recipientCode = recipientRes.data.data.recipient_code;
