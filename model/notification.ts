
import { model, Schema , Types} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


interface InotificationSchema {
    user: Types.ObjectId,
    message: string,
    isReaded: boolean
}


const notificationSchema = new Schema<InotificationSchema>(
  {

     user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      message: String,
      isReaded: {
        type: Boolean,
        default: false
      }
  },
  {
    timestamps: true,
  }
);


// notificationSchema.post('find', function(doc, next) {

//   doc.isReaded = true
//   doc.save()

//   next();
// });


notificationSchema.plugin(aggregatePaginate);

const Notification = model<InotificationSchema>('Notification', notificationSchema);
export default Notification