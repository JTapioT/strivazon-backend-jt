import path, { extname } from "path";

//import { fileURLToPath } from "url";
import fs from "fs-extra";
import multer from "multer";

// This is code written by team-mate
// commented out few lines of code

/* const _filename = fileURLToPath(import.meta.url);

const _dirname = dirname(_filename);

const publicFolderPath = path.join(_dirname, "../../public"); */

const publicFolderPath = path.join(process.cwd(), "/public");

export const parseFile = multer();

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    // Here, before it was req.param.id
    // Contained a typo but also it should be productId in this case
    const filename = `${req.params.productId}${extension}`;
    const pathToFile = path.join(publicFolderPath, filename);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${filename}`;
    req.file = link;
    next();
  } catch (error) {
    next(error);
  }
};
