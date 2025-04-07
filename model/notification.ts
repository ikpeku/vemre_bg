
import { model, Schema , Types} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


interface InotificationSchema {
    user: Types.ObjectId,
    message: string
}


const notificationSchema = new Schema<InotificationSchema>(
  {

     user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      message: String
  },
  {
    timestamps: true,
  }
);



notificationSchema.plugin(aggregatePaginate);

const Notification = model<InotificationSchema>('Notification', notificationSchema);
export default Notification