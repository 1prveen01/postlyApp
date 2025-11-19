import multer from "multer";
import fs from "fs";
import path from "path";

// Resolve folder path correctly
const tempPath = path.join(process.cwd(), "public", "temp");

// Ensure folder exists (works on Render + local)
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export { upload };
