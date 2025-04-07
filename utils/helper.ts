import { NextFunction, Response } from "express"
import { IRequest } from "../types"
import { errorHandler } from "./errorHandler"
import User from "../model/user"


export const onlyLoginUser = async (req: IRequest, res: Response, next: NextFunction) => {

    if (!req.payload) return errorHandler(res, 401, "not a login user")

    const isRegisterUser = await User.findById(req?.payload.userId)

    if (!isRegisterUser) return errorHandler(res, 403, "invalid credential")

    next()
}

export const onlyAdminUser = async (req: IRequest, res: Response, next: NextFunction) => {

    if (!req.payload) return errorHandler(res, 401, "not a login user")

    const isRegisterUser = await User.findById(req?.payload.userId)

    if (!isRegisterUser) return errorHandler(res, 403, "invalid credential")

    if(isRegisterUser.account_type !== "Admin") return errorHandler(res, 403, "unauthorise")

    next()
}



