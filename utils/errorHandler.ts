import { Response } from "express";


export const errorHandler = (res: Response, statusCode: number, message: string) => {

    const status = statusCode || 500;
    
  return  res.status(status).json({ message })
}