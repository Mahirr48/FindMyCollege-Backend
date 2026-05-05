import express from "express";
import cors from "cors";
import path from "path";

/* =========================
   ROUTES - ADMIN PANEL
========================= */

import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/Admin/routes/dashboard.routes.js";
import applicationRoutes from "./routes/Admin/routes/application.routes.js";
import notificationRoutes from "./routes/Admin/routes/notification.routes.js";
import withdrawalRoutes from "./routes/Admin/routes/withdrawal.routes.js";
import requestRoutes from "./routes/Admin/routes/request.routes.js";
import agentRoutes from "./routes/Admin/routes/agent.routes.js";
import studentRoutes from "./routes/Admin/routes/student.routes.js";
import collegeRoutes from "./routes/Admin/routes/college.routes.js";
import establishmentRoutes from "./routes/Admin/routes/establishment.routes.js";

/* =========================
   ROUTES - AUTH
========================= */

import authRoutes from "./routes/auth.routes.js";
import adminAuthRoutes from "./routes/admin.auth.routes.js";

/* =========================
   ROUTES - REGISTER
========================= */

import studentRegisterRoutes from "./routes/student.register.routes.js";
import agentRegisterRoutes from "./routes/agent.register.routes.js";
import collegeApplicationRoutes from "./routes/college.application.routes.js";
import establishmentApplicationRoutes from "./routes/establishment.application.routes.js";

/* =========================
   ROUTES - STUDENT MODULE
========================= */

import studentProfileRoutes from "./routes/student.profile.routes.js";
import studentApplyRoutes from "./routes/student.apply.routes.js";

/* =========================
   ROUTES - AGENT MODULE
========================= */

import agentProfileRoutes from "./routes/agent.profile.routes.js";
import agentDashboardRoutes from "./routes/agent.dashboard.routes.js";
import agentStudentsRoutes from "./routes/agent.students.routes.js";
import agentApplicationsRoutes from "./routes/agent.application.routes.js";
import agentPartnerRoutes from "./routes/agent.partner.routes.js";

/* =========================
   ROUTES - COLLEGE MODULE
========================= */

import collegeProfileRoutes from "./routes/college.profile.routes.js";
import collegeCourseRoutes from "./routes/college.courses.routes.js";
import collegeAdmissionRoutes from "./routes/college.admission.routes.js";
import collegePaymentRoutes from "./routes/college.payment.routes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegePartnerRoutes from "./routes/college.partner.routes.js";
import collegePublicRoutes from "./routes/college.publicProfile.routes.js";
import collegeAboutRoutes from "./routes/college.about.routes.js";
import collegeContactRoutes from "./routes/college.contact.routes.js";
import collegeGalleryRoutes from "./routes/college.gallery.routes.js";
import collegeStudentApplicationRoutes from "./routes/college.studentApplication.routes.js";
/* =========================
   ROUTES - ESTABLISHMENT
========================= */

import establishmentProfileRoutes from "./routes/establishment.profile.routes.js";
import establishmentStudentRoutes from "./routes/establishment.students.routes.js";
import establishmentCourseRoutes from "./routes/establishment.courses.routes.js";
import establishmentPaymentRoutes from "./routes/establishment.payments.routes.js";
import establishmentDashboardRoutes from "./routes/establishment.dashboard.routes.js";
import publicEstablishmentRoutes from "./routes/establishement.publicProfile.routes.js";
import establishmentContactRoutes from "./routes/establishment.contact.routes.js";
import establishmentGalleryRoutes from "./routes/establishment.gallery.routes.js";
import establishmentProjectRoutes from "./routes/establishment.projects.routes.js";
import establishmentAboutRoutes from "./routes/establishment.about.routes.js";
/* =========================
   EXPRESS APP
========================= */

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: "https://fm-college.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ✅ IMPORTANT (this fixes preflight)
// app.options("*", cors());

/* =========================
   BODY PARSER
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   PUBLIC ROUTES
========================= */

app.use("/api/student", studentRegisterRoutes);
app.use("/api/agent", agentRegisterRoutes);
app.use("/api/college", collegeApplicationRoutes);
app.use("/api/establishment", establishmentApplicationRoutes);

app.use("/api/auth", authRoutes);

/* ✅ FIXED ADMIN AUTH ROUTE */
app.use("/api/admin", adminAuthRoutes);

/* =========================
   ADMIN PANEL ROUTES
========================= */

app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/admin/students", studentRoutes);
app.use("/api/colleges", collegeRoutes);

/* =========================
   STUDENT MODULE
========================= */

app.use("/api/student/profile", studentProfileRoutes);
app.use("/api/student", studentApplyRoutes);

/* =========================
   AGENT MODULE
========================= */

app.use("/api/agent/profile", agentProfileRoutes);
app.use("/api/agent/dashboard", agentDashboardRoutes);
app.use("/api/agent/students", agentStudentsRoutes);
app.use("/api/agent/applications", agentApplicationsRoutes);
app.use("/api/agent/partners", agentPartnerRoutes);

/* =========================
   COLLEGE MODULE
========================= */

app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/courses", collegeCourseRoutes);
app.use("/api/college/admissions", collegeAdmissionRoutes);
app.use("/api/college/payments", collegePaymentRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);
app.use("/api/college/partners", collegePartnerRoutes);
app.use("/api/college/applications", collegeStudentApplicationRoutes);
app.use("/api/college", collegeGalleryRoutes);
app.use("/api/college", collegePublicRoutes);
app.use("/api/college", collegeAboutRoutes);
app.use("/api/college", collegeContactRoutes);

/* =========================
   ESTABLISHMENT MODULE
========================= */

app.use("/api/establishment/profile", establishmentProfileRoutes);
app.use("/api/establishment/students", establishmentStudentRoutes);
app.use("/api/establishment/courses", establishmentCourseRoutes);
app.use("/api/establishment/payments", establishmentPaymentRoutes);
app.use("/api/establishment/dashboard", establishmentDashboardRoutes);
app.use("/api/establishment", publicEstablishmentRoutes);

app.use("/api/establishment", establishmentContactRoutes);
app.use("/api/establishment", establishmentAboutRoutes);
app.use("/api/establishment", establishmentGalleryRoutes);
app.use("/api/establishment", establishmentProjectRoutes);

/* =========================
   STATIC FILES
========================= */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Find My College API running 🚀",
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
