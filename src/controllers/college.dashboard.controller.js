// import Course from "../models/college.courses.model.js";
// import Admission from "../models/college.admission.model.js";
// import Payment from "../models/college.payment.model.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const collegeId = req.user.collegeId;

//     if (!collegeId) {
//       return res.status(400).json({
//         message: "College ID missing in token",
//       });
//     }

//     /* ===============================
//        COURSES
//     =============================== */
//     const totalCourses = await Course.countDocuments({ collegeId });

//     const courses = await Course.find({ collegeId });

//     const totalSeats = courses.reduce(
//       (sum, c) => sum + (c.totalSeats || 0),
//       0
//     );

//     const availableSeats = courses.reduce(
//       (sum, c) => sum + (c.availableSeats || 0),
//       0
//     );

//     /* ===============================
//        ADMISSIONS
//     =============================== */
//     const totalAdmissions = await Admission.countDocuments({
//       collegeId,
//       status: "approved",
//     });

//     const pendingAdmissions = await Admission.countDocuments({
//       collegeId,
//       status: "pending",
//     });

//     const recentAdmissions = await Admission.find({ collegeId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("courseId", "name");

//     /* ===============================
//        PAYMENTS
//     =============================== */
//     const payments = await Payment.find({ collegeId });

//     let collected = 0;
//     let pending = 0;

//     payments.forEach((p) => {
//       const total = Number(p.totalAmount || 0);
//       const paid = Number(p.paidAmount || 0);

//       collected += paid;
//       pending += Math.max(total - paid, 0);
//     });

//     const recentPayments = await Payment.find({ collegeId })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     /* ===============================
//        RESPONSE
//     =============================== */
//     res.json({
//       totalCourses,
//       totalAdmissions,
//       pendingAdmissions,

//       revenue: {
//         collected,
//         pending,
//       },

//       seats: {
//         total: totalSeats,
//         filled: totalSeats - availableSeats,
//         available: availableSeats,
//       },

//       recentAdmissions,
//       recentPayments,
//     });
//   } catch (err) {
//     console.error("DASHBOARD ERROR:", err);
//     res.status(500).json({ message: "Dashboard failed" });
//   }
// };
 



//////////////////////////////////////////////////////////////////////////




import Course from "../models/college.courses.model.js";
import CollegeAdmission from "../models/college.admission.model.js";
import CollegePayment from "../models/college.payment.model.js";

export const getDashboardStats = async (req, res) => {
  try {

    
    const collegeId = req.user._id;

    /* ================= COURSES ================= */
    const courses = await Course.find({
      college: collegeId,   // ✅ CORRECT FIELD
    });

    const totalCourses = courses.length;

    const totalSeats = courses.reduce(
      (sum, c) => sum + (c.totalSeats || 0),
      0
    );

    const availableSeats = courses.reduce(
      (sum, c) => sum + (c.availableSeats || 0),
      0
    );

    /* ================= ADMISSIONS ================= */
    const totalAdmissions = await CollegeAdmission.countDocuments({
      college: collegeId,
      status: "approved",
    });

    const pendingAdmissions = await CollegeAdmission.countDocuments({
      college: collegeId,
      status: "pending",
    });

    /* ================= PAYMENTS ================= */
    const payments = await CollegePayment.find({
      userId: collegeId,   // matches your payment model
    });

    let collected = 0;
    let pending = 0;

    payments.forEach((p) => {
      const total = Number(p.totalAmount || 0);
      const paid = Number(p.paidAmount || 0);

      collected += paid;
      pending += Math.max(total - paid, 0);
    });

    res.json({
      totalCourses,
      totalAdmissions,
      pendingAdmissions,
      revenue: {
        collected,
        pending,
      },
      seats: {
        total: totalSeats,
        filled: totalSeats - availableSeats,
        available: availableSeats,
      },
    });
  } catch (err) {
    console.error("COLLEGE DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard failed" });
  }
};
