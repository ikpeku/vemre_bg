import express from "express"
import { updateUser,  userNotifications,  userTransaction, createTransaction, others, deleteTransaction, AllUsersTransactions, userReadNotifications, createWithdrawal} from "../controller/user";
import { onlyAdminUser, onlyLoginUser } from "../utils/helper";

import { singleupload } from "../middleware/multer";
import { sendMoney } from "../controller/paystack";

const userroute = express.Router();

userroute.patch("/update", onlyLoginUser, singleupload, updateUser);
userroute.post("/other", onlyLoginUser, singleupload, others);


userroute.get("/notify", onlyLoginUser, userNotifications);
userroute.post("/readnotify", onlyLoginUser, userReadNotifications);

// transaction
userroute.post("/createtransaction", onlyLoginUser, createTransaction);
userroute.get("/alltransactions", onlyLoginUser, userTransaction);
userroute.post("/createwithdrawal", onlyLoginUser, createWithdrawal);

userroute.get("/transactions", onlyAdminUser, AllUsersTransactions);
userroute.post("/sendmoney", onlyAdminUser, sendMoney);

userroute.delete("/deletetransaction/:txndId", onlyLoginUser, deleteTransaction);

export default userroute;