import httpResponse from "../helpers/http_responses/index.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { v7 as uuidv7 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../images/profiles');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, `${uuidv7()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
}).single('file');

const fileUploader = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return new httpResponse.BadRequest().setMessage("Format Image tidak sesuai").send(res);
    } else if (err) {
      return new httpResponse.BadRequest().setMessage("Format Image tidak sesuai").send(res);
    } else if (!req.file) {
      return new httpResponse.BadRequest().setMessage("Format Image tidak sesuai").send(res);
    }

    next()
  });
};

export default fileUploader;