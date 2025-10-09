import multer from 'multer'
import path from 'path'
import fs from 'fs'

const photoDirectory = path.join(process.cwd(), 'uploads', 'profile')
const gradesDirectory = path.join(process.cwd(), 'uploads', 'grades')

if (!fs.existsSync(photoDirectory)) {
  fs.mkdirSync(photoDirectory, { recursive: true })
}

if (!fs.existsSync(gradesDirectory)) {
  fs.mkdirSync(gradesDirectory, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      cb(null, photoDirectory)
    } else if (file.fieldname === 'grades') {
      cb(null, gradesDirectory)
    } else {
      cb(new Error('Campo de archivo no válido'), '')
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);

    if (file.fieldname === 'photo') {
      cb(null, `profile-${uniqueSuffix}${extension}`);
    } else if (file.fieldname === 'grades') {
      cb(null, `grades-${uniqueSuffix}${extension}`);
    }
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'photo') {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de imagen no permitido. Solo se permiten: JPG, PNG, WEBP'), false);
    }
  } else if (file.fieldname === 'grades') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF para las notas'), false);
    }
  } else {
    cb(new Error('Campo de archivo no válido'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

export const uploadPhoto = upload;
