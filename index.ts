
import bodyParser from "body-parser";
import { v2 as cloudinary } from 'cloudinary';
import express, { Response , Express, NextFunction, ErrorRequestHandler} from 'express';
import mongoose from 'mongoose';

import cors from 'cors';

import 'dotenv/config'
import authroute from "./routes/auth";
import userroute from "./routes/user";
import { getCurrentUser } from "./utils/bearerToken";

import { IRequest } from "./types";
import stripeRoute from "./routes/stripe";

const app: Express = express();

var corsOptions = {
    origin: ['http://localhost:3001', 'https://vemre-dashbroad.vercel.app'],
    credentials:true,            //access-control-allow-credentials:true
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.use(cors(corsOptions))

const PORT = process.env.PORT || 5000;


//// DATABASE URL local: process.env.MONGODB_URI ||| cloud:process.env.databaseUrl
const dbUrl = process.env.databaseUrl || process.env.MONGODB_URI;

// create application/json parser
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));


app.use(getCurrentUser)

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    api_key:  process.env.API_KEY
})


app.use("/api/auth", authroute);
app.use("/api/user", userroute);
app.use("/api/stripe", stripeRoute);


// suspend account

/**
 * test route
 */
app.get("/", (req, res, next) => {
    res.status(200).send("API is running");
});

app.use((error:ErrorRequestHandler, req:IRequest, res:Response, next: NextFunction) => {

    const message = error;
    res.status(500).json({message})
})


mongoose
    .connect(dbUrl!, {
        autoIndex: true
    })
    .then((response) => {
        if (response) {
            app.listen(PORT, () => {
                console.log(`Connected on PORT ${PORT}`);
            });
        }
    })
    .catch((e) => {
        console.log(e);
    });

// Export the Express API
module.exports = app;

