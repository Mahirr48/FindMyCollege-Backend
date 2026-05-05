import Student from "../models/agent.student.model.js";
import Course from "../models/college.courses.model.js";

/* ===========================================================
   GET ALL STUDENTS
=========================================================== */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      agentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error("GET ALL STUDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ===========================================================
   GET SINGLE STUDENT
=========================================================== */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

/* ===========================================================
   DELETE STUDENT
=========================================================== */
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete student" });
  }
};

/* ===========================================================
   STEP 1 — SAVE PERSONAL DETAILS
=========================================================== */
export const savePersonalDetails = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    Object.assign(student, {
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      dob: req.body.dob,
      gender: req.body.gender,
      state: req.body.state,
      city: req.body.city,
      pincode: req.body.pincode,
      fullAddress: req.body.fullAddress,
    });

    await student.save();

    res.json({ message: "Step 1 saved successfully" });
  } catch (err) {
    console.error("STEP 1 ERROR:", err);
    res.status(500).json({ message: "Failed to save personal details" });
  }
};

/* ===========================================================
   STEP 2 — SAVE EDUCATION DETAILS
=========================================================== */
export const saveEducationDetails = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    Object.assign(student, {
      tenthBoard: req.body.tenthBoard,
      tenthYear: req.body.tenthYear,
      tenthMarksObtained: req.body.tenthMarksObtained,
      tenthTotalMarks: req.body.tenthTotalMarks,
      tenthPercentage:
        (req.body.tenthMarksObtained / req.body.tenthTotalMarks) * 100,

      twelfthBoard: req.body.twelfthBoard,
      twelfthYear: req.body.twelfthYear,
      twelfthMarksObtained: req.body.twelfthMarksObtained,
      twelfthTotalMarks: req.body.twelfthTotalMarks,
      twelfthPercentage:
        (req.body.twelfthMarksObtained / req.body.twelfthTotalMarks) * 100,
    });

    await student.save();

    res.json({ message: "Step 2 saved successfully" });
  } catch (err) {
    console.error("STEP 2 ERROR:", err);
    res.status(500).json({ message: "Failed to save education details" });
  }
};

/* ===========================================================
   STEP 3 — UPLOAD DOCUMENTS
=========================================================== */
export const uploadStudentDocuments = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const files = req.files;

    if (files.passportPhoto)
      student.documents.photo = files.passportPhoto[0].path;

    if (files.signature)
      student.documents.signature = files.signature[0].path;

    if (files.aadhaarCard)
      student.documents.aadhaar = files.aadhaarCard[0].path;

    if (files.tenthMarksheet)
      student.documents.tenthMarksheet = files.tenthMarksheet[0].path;

    if (files.twelfthMarksheet)
      student.documents.twelfthMarksheet = files.twelfthMarksheet[0].path;

    if (files.leavingCertificate)
      student.documents.leavingCertificate =
        files.leavingCertificate[0].path;

    if (files.lastSemesterMarksheet)
      student.documents.lastSemesterMarksheet =
        files.lastSemesterMarksheet[0].path;

    await student.save();

    res.json({ message: "Step 3 documents uploaded successfully" });
  } catch (err) {
    console.error("STEP 3 ERROR:", err);
    res.status(500).json({ message: "Document upload failed" });
  }
};

/* ===========================================================
   STEP 4 — SAVE SELECTED COLLEGES (DRAFT)
=========================================================== */
export const saveSelectedColleges = async (req, res) => {
  try {
    const { selectedColleges } = req.body;

    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (!selectedColleges || !selectedColleges.length)
      return res.status(400).json({ message: "No colleges selected" });

    student.appliedColleges = selectedColleges;

    await student.save();

    res.json({ message: "Step 4 saved successfully" });
  } catch (err) {
    console.error("STEP 4 ERROR:", err);
    res.status(500).json({ message: "Failed to save colleges" });
  }
};

/* ===========================================================
   STEP 5 — FINAL SUBMIT
=========================================================== */
export const finalSubmitApplication = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user._id,
    });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (!student.appliedColleges.length)
      return res.status(400).json({ message: "No colleges selected" });

    const createdApplications = [];

    for (const item of student.appliedColleges) {
      const course = await Course.findById(item.courseId);

      if (!course || course.availableSeats <= 0) continue;

      const exists = await Application.findOne({
        studentId: student._id,
        courseId: item.courseId,
      });

      if (exists) continue;

      const application = await Application.create({
        agentId: req.user._id,
        studentId: student._id,
        collegeId: item.collegeId,
        courseId: item.courseId,
        status: "APPLIED",
      });

      course.availableSeats -= 1;
      await course.save();

      createdApplications.push(application);
    }

    student.finalSubmitted = true;
    student.profileCompleted = true;
    student.declarationAccepted = true;

    await student.save();

    res.json({
      message: "Application submitted successfully",
      totalApplications: createdApplications.length,
    });

  } catch (err) {
    console.error("FINAL SUBMIT ERROR:", err);
    res.status(500).json({ message: "Final submission failed" });
  }
};