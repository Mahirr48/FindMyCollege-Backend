import CollegeProfile from "../models/college.profile.model.js";
import CollegeCourse from "../models/college.courses.model.js";
import CollegeGallery from "../models/college.gallery.model.js";
import CollegeAbout from "../models/college.about.model.js";
import CollegeContact from "../models/college.contact.model.js";

/* ================= HELPER ================= */

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeRegExp = (str = "") =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildLocationRegex = (districtKey = "") => {
  const normalized = districtKey.trim().replace(/-/g, " ");
  const flexibleSeparators = escapeRegExp(normalized).replace(
    /\s+/g,
    "[^a-z0-9]*",
  );

  return new RegExp(`\\b${flexibleSeparators}\\b`, "i");
};

const buildFullAddress = (address = {}) =>
  [address.address, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");

const withPublicCollegeShape = (college, extras = {}) => ({
  ...college,
  address: {
    ...(college.address || {}),
    fullAddress: buildFullAddress(college.address || {}),
  },
  gallery: extras.gallery || null,
  courses: extras.courses || [],
  about: extras.about || [],
  contact: extras.contact || null,
});

/* ======================================================
   GET COLLEGES BY DISTRICT
   Used in CollegeDirectory.jsx
====================================================== */

export const getCollegesByDistrict = async (req, res) => {

  try {

    const { districtKey } = req.params;
    const locationRegex = buildLocationRegex(districtKey);

    const colleges = await CollegeProfile.find({
      $or: [
        { "address.city": locationRegex },
        { "address.district": locationRegex },
      ],
    }).lean();

    const userIds = colleges.map((c) => c.userId);

    const galleries = await CollegeGallery.find({
      college: { $in: userIds }
    }).lean();

    const courses = await CollegeCourse.find({
      college: { $in: userIds }
    }).lean();

    const contacts = await CollegeContact.find({
      college: { $in: userIds }
    }).lean();

    /* ===== MAP GALLERY ===== */

    const galleryMap = {};

    galleries.forEach((g) => {
      galleryMap[String(g.college)] = g;
    });

    /* ===== MAP COURSES ===== */

    const courseMap = {};

    courses.forEach((c) => {
      const collegeKey = String(c.college);

      if (!courseMap[collegeKey]) {
        courseMap[collegeKey] = [];
      }

      courseMap[collegeKey].push(c);

    });

    /* ===== MAP CONTACT ===== */

    const contactMap = {};

    contacts.forEach((contact) => {
      contactMap[String(contact.college)] = contact;
    });

    /* ===== MERGE DATA ===== */

    const enriched = colleges.map((college) =>
      withPublicCollegeShape(college, {
        gallery: galleryMap[String(college.userId)] || null,
        courses: courseMap[String(college.userId)] || [],
        contact: contactMap[String(college.userId)] || null,
      })
    );

    res.json(enriched);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};


/* ======================================================
   GET COLLEGE BY DISTRICT + SLUG
   Used in CollegePage.jsx
====================================================== */

export const getCollegeBySlug = async (req, res) => {

  try {

    const { districtKey, slug } = req.params;
    const locationRegex = buildLocationRegex(districtKey);

    const colleges = await CollegeProfile.find({
      $or: [
        { "address.city": locationRegex },
        { "address.district": locationRegex },
      ],
    }).lean();

    const college = colleges.find(
      (c) => slugify(c.collegeName) === slug
    );

    if (!college) {

      return res.status(404).json({
        message: "College not found"
      });

    }

    const gallery = await CollegeGallery.findOne({
      college: college.userId
    });

    const courses = await CollegeCourse.find({
      college: college.userId
    });

    const about = await CollegeAbout.find({
      college: college.userId
    });

    const contact = await CollegeContact.findOne({
      college: college.userId
    });

    res.json(
      withPublicCollegeShape(college, {
        gallery,
        courses,
        about,
        contact,
      })
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/* ======================================================
   GET COLLEGE BY ID
====================================================== */

export const getCollegeById = async (req, res) => {

  try {

    const { collegeId } = req.params;

    const college = await CollegeProfile.findById(collegeId);

    if (!college) {

      return res.status(404).json({
        message: "College not found"
      });

    }

    const gallery = await CollegeGallery.findOne({
      college: college.userId
    });

    const courses = await CollegeCourse.find({
      college: college.userId
    });

    const about = await CollegeAbout.find({
      college: college.userId
    });

    const contact = await CollegeContact.findOne({
      college: college.userId
    });

    res.json(
      withPublicCollegeShape(college.toObject(), {
        gallery,
        courses,
        about,
        contact,
      })
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
