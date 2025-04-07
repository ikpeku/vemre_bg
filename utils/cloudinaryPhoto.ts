
import { v2 as cloudinary } from "cloudinary";
import { getDataUri, IgetDataUri } from "./features";
import Photos from "../model/allVemrePhotos";


export async function processImage(image: IgetDataUri, userId: string) {
      
    const file = getDataUri(image);

    const result = await cloudinary.uploader.upload(file.content!, {
        folder: "vemre", 
      });

      if(result){

        const url =  cloudinary.url(result?.public_id, {
            transformation: [
              {
                quality: "auto",
                fetch_format: "auto",
              },
              {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "auto",
              },
        
            ],
           
        
          });

        const isAvatarSaved = await Photos.findOne({user: userId});

        if(isAvatarSaved) {
            await cloudinary.uploader.destroy(isAvatarSaved.public_id);

            isAvatarSaved.public_id = result?.public_id;
            isAvatarSaved.save()

        } else {
            await Photos.create({public_id: result?.public_id, user: userId})
        }

        return url;

      } else {
        return ""
      }
    
    }