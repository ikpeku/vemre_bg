import  DataUriParser from "datauri/parser.js";
import path from "path";

export interface IgetDataUri {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        buffer: Buffer
        size: number
}


export const getDataUri = (file:IgetDataUri) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString()

    return parser.format(extName, file.buffer);
}