import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDirectory = path.join(process.cwd(), 'uploads','profile')

if(!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {recursive: true})
}

// setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${extension}`);
  }
});

// file validation
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WEBP'), false);
  }
};


export const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024
  }
})
