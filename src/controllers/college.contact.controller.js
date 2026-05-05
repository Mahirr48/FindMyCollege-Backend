import CollegeContact from "../models/college.contact.model.js";

/* ================= GET CONTACT ================= */

export const getCollegeContact = async (req, res) => {
  try {

    const collegeId = req.user.id;

    const contact = await CollegeContact.findOne({
      college: collegeId
    });

    res.json(contact || {});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= UPDATE CONTACT ================= */

export const updateCollegeContact = async (req, res) => {
  try {

    const collegeId = req.user.id;

    const updated = await CollegeContact.findOneAndUpdate(

      { college: collegeId },

      {
        ...req.body,
        college: collegeId
      },

      {
        new: true,
        upsert: true
      }

    );

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};