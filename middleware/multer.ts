import multer from "multer";

const storage = multer.memoryStorage();

export const singleupload = multer({storage}).single("file");


export const multipleupload = multer({storage}).fields([{name: "document_front_view", maxCount: 1} ,{name: "document_back_view", maxCount: 1}, {name: "avatar"}]);