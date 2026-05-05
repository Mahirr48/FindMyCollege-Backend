import CollegeProfile from "../models/college.profile.model.js";
import AgentStudentApplication from "../models/agent.stuApplication.model.js";
import StudentApplication from "../models/student.apply.model.js";

export const getCollegeApplications = async (req, res) => {

  try {

    const college = await CollegeProfile.findOne({
      userId: req.user._id
    });

    if (!college) {
      return res.json([]);
    }

    /* AGENT APPLICATIONS */

    const agentApps = await AgentStudentApplication
      .find({
        collegeId: college._id,
        status: "APPLIED"
      })
      .populate("studentId", "fullName mobile")
      .populate("courseId", "name");

    /* SELF APPLICATIONS */

   const selfApps = await StudentApplication.find({
  collegeId: college._id,
  status: { $in: ["SUBMITTED","UNDER_REVIEW"] }
});

    const formattedAgent = agentApps.map(app => ({
      _id: app._id,
      source: "AGENT",
      studentId: app.studentId,
      courseId: app.courseId
    }));

    const formattedSelf = selfApps.map(app => ({
  _id: app._id,
  source: "SELF",
  studentId:{
    fullName: app.fullName,
    mobile: app.mobile
  },
  courseId:{
    name: app.stream
  }
}));

    res.json([...formattedAgent, ...formattedSelf]);

  } catch (err) {

    console.error("APPLICATION FETCH ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch applications"
    });

  }

};

/* ================= VIEW APPLICATION ================= */

export const viewApplication = async (req,res)=>{

  try{

    const id=req.params.id;

    const agentApp = await AgentStudentApplication
    .findById(id)
    .populate("studentId")
    .populate("courseId");

    if(agentApp) return res.json(agentApp);

    const selfApp = await StudentApplication.findById(id);

    if(selfApp) return res.json(selfApp);

    res.status(404).json({
      message:"Application not found"
    });

  }catch(err){

    res.status(500).json({
      message:"Failed to view application"
    });

  }

};



/* ================= APPROVE ================= */

export const approveApplication = async (req,res)=>{

  try{

    const id=req.params.id;

    const agentApp = await AgentStudentApplication.findById(id);

    if(agentApp){

      agentApp.status="APPROVED";

      await agentApp.save();

      return res.json({
        message:"Application approved"
      });

    }

    const selfApp = await StudentApplication.findById(id);

    if(selfApp){

      selfApp.status="APPROVED";

      await selfApp.save();

      return res.json({
        message:"Application approved"
      });

    }

  }catch(err){

    res.status(500).json({
      message:"Approval failed"
    });

  }

};



/* ================= REJECT ================= */

export const rejectApplication = async (req,res)=>{

  try{

    const id=req.params.id;

    const agentApp = await AgentStudentApplication.findById(id);

    if(agentApp){

      agentApp.status="REJECTED";

      await agentApp.save();

      return res.json({
        message:"Application rejected"
      });

    }

    const selfApp = await StudentApplication.findById(id);

    if(selfApp){

      selfApp.status="REJECTED";

      await selfApp.save();

      return res.json({
        message:"Application rejected"
      });

    }

  }catch(err){

    res.status(500).json({
      message:"Reject failed"
    });

  }

};