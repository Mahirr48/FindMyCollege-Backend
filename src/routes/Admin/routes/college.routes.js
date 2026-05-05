import express from "express";
import * as controller from "../../../controllers/Admin/Controller/college.controller.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import College from "../../../models/Admin/models/College.js";
import { protect } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

/* REGISTER COLLEGE */
router.post("/", controller.registerCollege);

/* GET ALL COLLEGES */
router.get("/", controller.getColleges);

/* DELETE COLLEGE */
router.delete("/:id", controller.deleteCollege);

/* GET COLLEGE BY ID */
router.get("/:id", protect, allowRoles("ADMIN"), controller.getCollegeById);

/* APPROVE COLLEGE REQUEST */
router.patch("/:id/approve", allowRoles("ADMIN"), controller.approveCollege);

/* REJECT COLLEGE REQUEST */
router.delete("/:id/reject", allowRoles("ADMIN"), controller.rejectCollege);

/* UPDATE COLLEGE */
router.put("/:id", async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
