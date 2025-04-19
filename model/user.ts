
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
    account_status: {
      type: String,
      default: "Basic",
      enum: ["Basic", "Platinum", "Gold"]
    },
    fullname: String,
    phone_number: String,
    gender: String,
    dob:Date,
    subscribeAt:Date,
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

userSchema.post('findOne', function(doc, next) {

  if(!doc.subscribeAt){
    return next();
  }

  if(isSubscriptionExpiredToday({account_status: doc.account_status, startDate: doc.subscribeAt })){

    doc.account_status = "Basic"
  }

  doc.save()

  next();
});





userSchema.plugin(aggregatePaginate);

export default model<IuserSchema>('user', userSchema);



function isSubscriptionExpiredToday({startDate, account_status}: {startDate: Date, account_status: "Basic" | "Platinum" | "Gold",}) {
  const start = new Date(startDate);
  const expiration = new Date(start);

  if(account_status !== "Basic"){
    expiration.setFullYear(start.getFullYear() + 1);
  }

  const today = new Date();

  const formatDate = (date:Date) => date.toISOString().split('T')[0];

  return formatDate(today) === formatDate(expiration);
}