import express from "express"
import { updateUser,  userNotifications,  userTransaction, createTransaction, others, deleteTransaction, AllUsersTransactions} from "../controller/user";
import { onlyAdminUser, onlyLoginUser } from "../utils/helper";

import { singleupload } from "../middleware/multer";

const userroute = express.Router();

userroute.patch("/update", onlyLoginUser, singleupload, updateUser);
userroute.post("/other", onlyLoginUser, singleupload, others);


userroute.get("/notify", onlyLoginUser, singleupload, userNotifications);

// transaction
userroute.post("/createtransaction", onlyLoginUser, createTransaction);
userroute.get("/alltransactions", onlyLoginUser, userTransaction);

userroute.get("/transactions", onlyAdminUser, AllUsersTransactions);

userroute.delete("/deletetransaction/:txndId", onlyLoginUser, deleteTransaction);

export default userroute;