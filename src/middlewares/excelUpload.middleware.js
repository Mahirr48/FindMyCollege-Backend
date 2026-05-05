// import ExcelJS from "exceljs";
// import Student from "../models/agent.student.model.js";

// export const importStudents = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "File missing" });
//     }

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(req.file.path);

//     const worksheet = workbook.worksheets[0];

//     let success = 0;
//     const failed = [];

//     const headerRow = worksheet.getRow(1);
//     const headers = headerRow.values.map((h) =>
//       String(h || "").trim()
//     );

//     for (let i = 2; i <= worksheet.rowCount; i++) {
//       const row = worksheet.getRow(i);

//       try {
//         const rowData = {};

//         headers.forEach((key, index) => {
//           rowData[key] = row.getCell(index).value;
//         });

//         if (!rowData.fullName || !rowData.mobile) {
//           throw "fullName or mobile missing";
//         }

//         const mobile = String(rowData.mobile).trim();

//         /* Prevent duplicate under same agent */
//         const exists = await Student.findOne({
//           mobile,
//           agentId: req.user._id,
//         });

//         if (exists) {
//           throw "Student already exists for this agent";
//         }

//         await Student.create({
//           fullName: String(rowData.fullName).trim(),
//           mobile,
//           city: rowData.city || "",
//           state: rowData.state || "",
//           createdVia: "EXCEL",
//           agentId: req.user._id,
//         });

//         success++;
//       } catch (err) {
//         failed.push({
//           row: i,
//           reason: err.toString(),
//         });
//       }
//     }

//     res.json({
//       totalRows: worksheet.rowCount - 1,
//       success,
//       failedCount: failed.length,
//       failed,
//     });
//   } catch (err) {
//     console.error("Excel import error:", err);
//     res.status(500).json({ message: "Import failed" });
//   }
// };

import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= CREATE FOLDER IF NOT EXISTS ================= */

const uploadDir = "uploads/excel";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= STORAGE CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".xlsx", ".xls"];

  if (!allowed.includes(ext)) {
    return cb(new Error("Only Excel files (.xlsx, .xls) are allowed"));
  }

  cb(null, true);
};

/* ================= MULTER INSTANCE ================= */

const uploadExcel = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default uploadExcel;