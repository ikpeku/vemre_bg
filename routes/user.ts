import express from "express"
import { updateUser,  userNotifications,  userTransaction, createTransaction, others} from "../controller/user";
import { onlyLoginUser } from "../utils/helper";

import { multipleupload, singleupload } from "../middleware/multer";

const userroute = express.Router();

userroute.patch("/update", onlyLoginUser, singleupload, updateUser);
userroute.post("/other", onlyLoginUser, singleupload, others);


userroute.get("/notify", onlyLoginUser, singleupload, userNotifications);

// transaction
userroute.post("/createtransaction", onlyLoginUser, createTransaction);
userroute.get("/alltransactions", onlyLoginUser, userTransaction);

export default userroute;