import express from "express"
import { createUser, loginUser , changeUserPassword, forgetPassword, } from "../controller/auth";
import { onlyLoginUser } from "../utils/helper";

const authroute = express.Router();

authroute.post("/register", createUser);
authroute.post("/login", loginUser);
authroute.post("/forgetPassword", forgetPassword);
authroute.post("/changepassword", changeUserPassword)




export default authroute;