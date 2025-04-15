
import { model, Schema , Types} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


interface ITransactionSchema {
  user: Types.ObjectId,
  type?: "Received" | "Withdraw";
  isPending: boolean,
  description?: string;
  transactionReference?: string;
  senderName?: string;
  senderEmail?: string;
  senderPhoneNumber?: string;
  amount?: number;
  category?: string;
  transactionLink?: string
}


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
      senderEmail: {
        type: String,
        lowercase: true
      },
      type: String,
      transactionLink: String,
      description: String,
      transactionReference: String,
      senderName: String,
      senderPhoneNumber: String,
      amount: Number,
      category: String,
  },
  {
    timestamps: true,
  }
);


TransactionSchema.plugin(aggregatePaginate);

const Transaction = model<ITransactionSchema>('transaction', TransactionSchema);
export default Transaction;