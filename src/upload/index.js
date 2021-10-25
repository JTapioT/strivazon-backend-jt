import path, { dirname, extname } from "path";

import { fileURLToPath } from "url";
import fs from "fs-extra";
import multer from "multer";

const _filename = fileURLToPath(import.meta.url);

const _dirname = dirname(_filename);

const publicFolderPath = path.join(_dirname, "../../public");

export const parseFile = multer();

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const filename = `${req.param.id}${extension}`;
    const pathToFile = path.join(publicFolderPath, filename);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${filename}`;
    req.file = link;
    next();
  } catch (error) {
    next(error);
  }
};
