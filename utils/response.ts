
import { Types } from "mongoose";
import User from "../model/user"
import { errorHandler } from "./errorHandler";
// import authToken from "../utils/token";
import authToken from "./token";

import { Response } from 'express';

interface IresponseResult {
    userId: Types.ObjectId
    res: Response
}

export const responseResult = async({userId, res}:IresponseResult) => {

    const user = await User.findById(userId).select("-password");
    if(!user) return errorHandler(res, 500,"invalid credential" )

    const {token} = await authToken.createToken({email: user.email!, status: user.account_type, userId: user._id.toString()});
       res.status(200).json({token, data: user});
}