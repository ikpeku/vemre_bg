
import express from "express"
import { onlyAdminUser, onlyLoginUser } from "../utils/helper";

import { listBanks, resolveAccountNumber } from "../controller/paystack";

const paystackroute = express.Router();

paystackroute.get("/banks", onlyLoginUser, listBanks);
paystackroute.post("/resolveAccountNumber", onlyLoginUser, resolveAccountNumber);


export default paystackroute;