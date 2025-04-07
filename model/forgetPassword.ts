
import { model, Schema , Types} from "mongoose";

interface IPasswordSchema {
    user: Types.ObjectId,
    token: string,
  
}


const PasswordResetSchema = new Schema<IPasswordSchema>(
  {
     user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      token: String,
  },
  {
    timestamps: true,
  }
);


const PasswordReset = model<IPasswordSchema>('passwordreset', PasswordResetSchema);
export default PasswordReset;