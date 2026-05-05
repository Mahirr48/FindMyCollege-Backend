import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

/* Create uploads folder if it doesn't exist */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ================= STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const nameSource =
      req.body.authorizedPerson ||
      req.body.fullName ||
      "user";

    const cleanName = nameSource
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .toLowerCase();

    cb(null, `${file.fieldname}_${Date.now()}_${cleanName}${ext}`);
  },
});

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpg|jpeg|png/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, PNG allowed"));
  }
};

/* ================= MULTER INSTANCE ================= */

const multerInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

/* ================= GALLERY UPLOAD ================= */

export const uploadGallery = multerInstance.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

/* ================= PROJECT UPLOAD ================= */

export const uploadProject = multerInstance.single("image");

/* ================= DEFAULT EXPORT ================= */

export default multerInstance;