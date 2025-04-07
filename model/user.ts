
import { model, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
import { IuserSchema } from "../types";

const userSchema = new Schema<IuserSchema>(
  {
    avatar: String,
    email: {
      type: String,
      required: [true, 'Please add the user email address'],
      unique: [true, 'Email address already in used'],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please add the user password'],
    },
    fullname: String,
    phone_number: String,
    gender: String,
    dob:Date,
    country: String,
    city: String,
    social: {
      facebook:String,
      twitter: String,
      instagram: String,
    },
    account_type: {
      type: String,
      enum: [
        "User",
        'Admin',
      ],
      default: 'User',
    },
    verify_account: {
      type: Boolean,
      default: false,
    },
  
  },
  {
    timestamps: true,
  }
);

userSchema.post('save', function(doc, next) {
  if(!doc.avatar && 
    !doc.fullname && 
    !doc.phone_number && 
    !doc.gender && 
    !doc.dob && 
    !doc.country && 
    !doc.country && 
    !doc.city
  ) {
    doc.verify_account = false

  

  } else {
    doc.verify_account = true
  }

  doc.save()

  next();
});

userSchema.plugin(aggregatePaginate);

export default model<IuserSchema>('user', userSchema);
