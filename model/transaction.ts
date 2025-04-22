
import { model, Schema , Types} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


interface ITransactionSchema {
  user: Types.ObjectId,
  type?: "Received" | "Withdraw";
  isPending: boolean,
  isVemreCharge: boolean, //this is vemre charges
  description?: string;
  transactionReference?: string;
  senderName?: string;
  senderEmail?: string;
  senderPhoneNumber?: string;
  amount?: number;
  category?: string;
  transactionLink?: string;

  recipientName?: string;
  account_number?: string;
  bank_code?: string;
  currency?: string;
  paystacktype?: "nuban"

}


// name: "Tolu Robert",
//   account_number: "01000000010",
//   bank_code: "058",
  // currency: "NGN"


const TransactionSchema = new Schema<ITransactionSchema>(
  {
     user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      isPending: {
        type: Boolean,
        default: true,
      },
      isVemreCharge: {
        type: Boolean,
        default: false,
      },
      senderEmail: {
        type: String,
        lowercase: true
      },
      type: {
        type: String,
        default: "Received",
        enum: ["Received" , "Withdraw"]
      },
      transactionLink: String,
      description: String,
      transactionReference: String,
      senderName: String,
      senderPhoneNumber: String,
      amount: Number,
      category: String,
      account_number: String,
      bank_code: String,
      recipientName: String,
      currency: {
        type: String,
        default: "USD"
      },
      paystacktype: {
        type: String,
        default: "nuban"
      },

  },
  {
    timestamps: true,
  }
);


TransactionSchema.plugin(aggregatePaginate);

const Transaction = model<ITransactionSchema>('transaction', TransactionSchema);
export default Transaction;