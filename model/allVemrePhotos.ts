
import { model, Schema , Types} from "mongoose";

interface IphotoSchema {
    user: Types.ObjectId,
    public_id: string,
  
}


const PhotoSchema = new Schema<IphotoSchema>(
  {
     user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      public_id: String,
  },
  {
    timestamps: true,
  }
);


const Photos = model<IphotoSchema>('photos', PhotoSchema);
export default Photos;