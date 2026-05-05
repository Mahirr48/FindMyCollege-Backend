// import EstablishmentStudent from "../models/establishment.student.model.js";
// import EstablishmentCourse from "../models/establishment.course.model.js";

// /* ================= ADD STUDENT ================= */
// export const addStudent = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       courseId,
//       installmentAllowed,
//       installmentDetails,
//       totalFees,
//     } = req.body;

//     if (!firstName || !lastName || !courseId) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     if (installmentAllowed && !installmentDetails) {
//       return res.status(400).json({ message: "Installment details required" });
//     }

//     // 🔒 Ensure course belongs to THIS establishment
//     const course = await EstablishmentCourse.findOne({
//       _id: courseId,
//       establishment: req.user.id,
//     });

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const student = await EstablishmentStudent.create({
//       establishment: req.user.id,
//       firstName,
//       lastName,
//       email,
//       phone,
//       course: courseId,
//       installmentAllowed,
//       installmentDetails,
//       totalFees: totalFees || 0,
//       paidFees: 0,
//     });

//     // increment student count in course
//     course.totalStudents += 1;
//     await course.save();

//     res.status(201).json(student);
//   } catch (err) {
//     res.status(500).json({
//       message: "Student creation failed",
//       error: err.message,
//     });
//   }
// };

// /* ================= GET STUDENTS ================= */
// // export const getStudents = async (req, res) => {
// //   try {
// //     const students = await EstablishmentStudent.find({
// //       establishment: req.user.id,
// //     })
// //       .populate("course", "title duration mode fees")
// //       .sort({ createdAt: -1 });

// //     const result = students.map((s) => {
// //       const remaining = (s.totalFees || 0) - (s.paidFees || 0);
// //       const financeStatus = remaining <= 0 ? "FEES_COMPLETED" : "PENDING";

// //       return {
// //         ...s.toObject(),
// //         financeStatus,
// //         remaining,
// //       };
// //     });

// //     res.json(result);
// //   } catch (err) {
// //     res.status(500).json({
// //       message: "Failed to fetch students",
// //       error: err.message,
// //     });
// //   }
// // };

// export const getStudents = async (req, res) => {
//   try {
//     console.log("REQ.USER:", req.user);

//     const students = await EstablishmentStudent.find({
//       establishment: req.user.id,
//     });

//     res.json(students);
//   } catch (err) {
//     console.error("FULL ERROR:", err); // 🔥 IMPORTANT
//     res.status(500).json({
//       message: "Failed to fetch students",
//       error: err.message,
//     });
//   }
// };





import EstablishmentStudent from "../models/establishment.student.model.js";
import EstablishmentCourse from "../models/establishment.course.model.js";

/* ================= ADD STUDENT ================= */
export const addStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      courseId,
      installmentAllowed,
      installmentDetails,
      totalFees,
    } = req.body;

    if (!firstName || !lastName || !courseId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (installmentAllowed && !installmentDetails) {
      return res.status(400).json({ message: "Installment details required" });
    }

    // 🔒 Ensure course belongs to THIS establishment
    const course = await EstablishmentCourse.findOne({
      _id: courseId,
      establishment: req.user.id,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await EstablishmentStudent.create({
      establishment: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      courseId, // ✅ FIXED (was "course")
      installmentAllowed,
      installmentDetails,
      totalFees: totalFees || 0,
      paidFees: 0,
    });

    // Increment student count in course
    course.totalStudents += 1;
    await course.save();

    res.status(201).json(student);
  } catch (err) {
    console.error("ADD STUDENT ERROR:", err);
    res.status(500).json({
      message: "Student creation failed",
      error: err.message,
    });
  }
};


/* ================= GET STUDENTS ================= */
export const getStudents = async (req, res) => {
  try {
    const students = await EstablishmentStudent.find({
      establishment: req.user.id,
    })
      .populate("courseId", "title duration mode fees") // ✅ MUST MATCH SCHEMA
      .sort({ createdAt: -1 });

    const result = students.map((s) => {
      const remaining = (s.totalFees || 0) - (s.paidFees || 0);
      const financeStatus =
        remaining <= 0 ? "FEES_COMPLETED" : "PENDING";

      return {
        ...s.toObject(),
        financeStatus,
        remaining,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch students",
      error: err.message,
    });
  }
};
