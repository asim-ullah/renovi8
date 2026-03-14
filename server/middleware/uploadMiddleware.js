const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const processImage = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  const processFile = async (file) => {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(uploadDir, filename);
    await sharp(file.buffer).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(outputPath);
    return `/uploads/${filename}`;
  };

  try {
    if (req.file) {
      req.file.processedPath = await processFile(req.file);
    }
    if (req.files) {
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          file.processedPath = await processFile(file);
        }
      } else {
        for (const key of Object.keys(req.files)) {
          for (const file of req.files[key]) {
            file.processedPath = await processFile(file);
          }
        }
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImage };
