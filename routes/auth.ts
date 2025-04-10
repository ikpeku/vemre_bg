import express from "express"
import { createUser, loginUser , changeUserPassword, forgetPassword,loginAdmin } from "../controller/auth";

const authroute = express.Router();

authroute.post("/register", createUser);
authroute.post("/login", loginUser);
authroute.post("/adminlogin", loginAdmin);
authroute.post("/forgetPassword", forgetPassword);
authroute.post("/changepassword", changeUserPassword)




export default authroute;