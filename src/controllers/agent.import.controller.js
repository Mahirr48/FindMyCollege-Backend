import ExcelJS from "exceljs";
import Student from "../models/agent.student.model.js";

export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res.status(400).json({ message: "Invalid Excel file" });
    }

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      rows.push({
        fullName: row.getCell(1).value,
        mobile: row.getCell(2).value,
        city: row.getCell(3).value,
        state: row.getCell(4).value,
        educationLevel: row.getCell(5).value,
      });
    });

    let success = 0;
    const failed = [];

    for (const row of rows) {
      try {
        if (!row.fullName || !row.mobile) {
          throw new Error("fullName or mobile missing");
        }

        const mobile = String(row.mobile).trim();

        /* 🔥 Check duplicate under same agent */
        const exists = await Student.findOne({
          mobile,
          agentId: req.user._id,
        });

        if (exists) {
          throw new Error("Student already exists for this agent");
        }

        await Student.create({
          fullName: String(row.fullName).trim(),
          mobile,
          city: row.city ? String(row.city).trim() : "",
          state: row.state ? String(row.state).trim() : "",
          educationLevel: row.educationLevel
            ? String(row.educationLevel).trim()
            : "",
          createdVia: "EXCEL",
          agentId: req.user._id,
        });

        success++;
      } catch (err) {
        failed.push({
          row,
          reason: err.message,
        });
      }
    }

    res.json({
      total: rows.length,
      success,
      failedCount: failed.length,
      failed,
    });

  } catch (err) {
    console.error("Excel import error:", err);
    res.status(500).json({ message: "Import failed" });
  }
};