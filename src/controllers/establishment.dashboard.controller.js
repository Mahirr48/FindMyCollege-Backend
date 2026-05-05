// import EstablishmentCourse from "../models/establishment.course.model.js";
// import EstablishmentStudent from "../models/establishment.student.model.js";
// import EstablishmentPayment from "../models/establishment.payment.model.js";
// import EstablishmentProfile from "../models/establishment.profile.model.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const establishmentId = req.user._id; // 🔥 secure source

//     /* ================= COUNTS ================= */
//     const totalCourses = await EstablishmentCourse.countDocuments({
//       establishment: establishmentId,
//     });

//     const totalStudents = await EstablishmentStudent.countDocuments({
//       establishment: establishmentId,
//     });

//     /* ================= FINANCE ================= */
//     const payments = await EstablishmentPayment.find({
//       establishment: establishmentId,
//     });

//     const totalRevenue = payments.reduce(
//       (sum, p) => sum + (p.amount || 0),
//       0
//     );

//     const students = await EstablishmentStudent.find({
//       establishment: establishmentId,
//     });

//     let pendingAdmissions = 0;
//     students.forEach((s) => {
//       if ((s.totalFees || 0) - (s.paidFees || 0) > 0) {
//         pendingAdmissions++;
//       }
//     });

//     /* ================= RECENT ADMISSIONS ================= */
//     const recentAdmissionsRaw = await EstablishmentStudent.find({
//       establishment: establishmentId,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select("firstName lastName");

//     const recentAdmissions = recentAdmissionsRaw.map((s) => ({
//       name: `${s.firstName} ${s.lastName}`,
//     }));

//     /* ================= RECENT PAYMENTS ================= */
//     const recentPaymentsRaw = await EstablishmentPayment.find({
//       establishment: establishmentId,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("student", "firstName lastName");

//     const recentPayments = recentPaymentsRaw.map((p) => ({
//       name: `${p.student?.firstName || ""} ${p.student?.lastName || ""}`,
//       amount: p.amount,
//     }));

//     /* ================= PROFILE STATUS ================= */
//     const profile = await EstablishmentProfile.findOne({
//       user: establishmentId,
//     }).select("status");

//     res.json({
//       totalCourses,
//       totalStudents,
//       newLeads: pendingAdmissions,
//       revenue: totalRevenue,
//       recentAdmissions,
//       recentPayments,
//       status: profile?.status || "draft",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Dashboard fetch failed",
//       error: error.message,
//     });
//   }
// };




////////////////////////////////////////////





import EstablishmentCourse from "../models/establishment.course.model.js";
import EstablishmentStudent from "../models/establishment.student.model.js";
import EstablishmentPayment from "../models/establishment.payment.model.js";
import EstablishmentProfile from "../models/establishment.profile.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const establishmentId = req.user._id;

    /* ================= COUNTS ================= */
    const totalCourses = await EstablishmentCourse.countDocuments({
      establishment: establishmentId,
    });

    const totalStudents = await EstablishmentStudent.countDocuments({
      establishment: establishmentId,
    });

    /* ================= FINANCE ================= */
    const payments = await EstablishmentPayment.find({
      establishment: establishmentId,
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const students = await EstablishmentStudent.find({
      establishment: establishmentId,
    });

    let pendingAdmissions = 0;
    students.forEach((s) => {
      if ((s.totalFees || 0) - (s.paidFees || 0) > 0) {
        pendingAdmissions++;
      }
    });

    /* ================= RECENT ADMISSIONS ================= */
    const recentAdmissionsRaw = await EstablishmentStudent.find({
      establishment: establishmentId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName");

    const recentAdmissions = recentAdmissionsRaw.map((s) => ({
      name: `${s.firstName} ${s.lastName}`,
    }));

    /* ================= RECENT PAYMENTS ================= */
    const recentPaymentsRaw = await EstablishmentPayment.find({
      establishment: establishmentId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "firstName lastName");

    const recentPayments = recentPaymentsRaw.map((p) => ({
      name: `${p.student?.firstName || ""} ${p.student?.lastName || ""}`,
      amount: p.amount,
    }));

    /* ================= PROFILE STATUS (🔥 FIXED) ================= */
    const profile = await EstablishmentProfile.findOne({
      userId: establishmentId, // ✅ correct field
    }).select("status completionPercentage");

    res.json({
      totalCourses,
      totalStudents,
      newLeads: pendingAdmissions,
      revenue: totalRevenue,
      recentAdmissions,
      recentPayments,

      // 🔥 NEW DYNAMIC FIELDS
      profileCompletion: profile?.completionPercentage || 0,
      profileStatus: profile?.status || "draft",
    });
  } catch (error) {
    res.status(500).json({
      message: "Dashboard fetch failed",
      error: error.message,
    });
  }
};
