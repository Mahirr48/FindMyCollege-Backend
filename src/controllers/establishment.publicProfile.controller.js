import EstablishmentProfile from "../models/establishment.profile.model.js";
import EstablishmentCourse from "../models/establishment.course.model.js";
import EstablishmentProject from "../models/establishment.projects.model.js";
import EstablishmentGallery from "../models/establishment.gallery.model.js";
import EstablishmentAbout from "../models/establishment.about.model.js";
import EstablishmentContact from "../models/establishment.contact.model.js";

/* ================= HELPER ================= */

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeFileUrl = (fileUrl = "") => {
  if (!fileUrl) return "";

  const normalized = String(fileUrl).replace(/\\/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const getDocumentFile = (documents = [], documentType) => {
  const match = documents.find((doc) => doc.documentType === documentType);
  return normalizeFileUrl(match?.fileUrl || "");
};

const getGalleryWithFallback = (establishment, gallery) => {
  const fallbackLogo = getDocumentFile(
    establishment?.documents || [],
    "companyLogo",
  );
  const fallbackBanner = fallbackLogo;

  if (gallery) {
    return {
      ...gallery,
      logo: gallery.logo || fallbackLogo,
      banner: gallery.banner || fallbackBanner,
    };
  }

  if (!fallbackLogo && !fallbackBanner) return null;

  return {
    logo: fallbackLogo,
    banner: fallbackBanner,
    images: [],
  };
};

/* ======================================================
   GET ESTABLISHMENTS BY DISTRICT
   Used in EstablishmentDirectory.jsx
====================================================== */

export const getEstablishmentsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;

    const establishments = await EstablishmentProfile.find({
      "address.district": new RegExp(district, "i")
    }).lean();

    const userIds = establishments.map((e) => e.userId);

    const galleries = await EstablishmentGallery.find({
      establishment: { $in: userIds }
    });

    const courses = await EstablishmentCourse.find({
      establishment: { $in: userIds }
    });

    const galleryMap = {};
    galleries.forEach((g) => {
      galleryMap[g.establishment] = g;
    });

    const courseMap = {};
    courses.forEach((c) => {
      if (!courseMap[c.establishment]) {
        courseMap[c.establishment] = [];
      }
      courseMap[c.establishment].push(c);
    });

    const enriched = establishments.map((est) => ({
      ...est,
      gallery: getGalleryWithFallback(est, galleryMap[est.userId] || null),
      courses: courseMap[est.userId] || []
    }));

    res.json(enriched);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: error.message });

  }
};

/* ======================================================
   GET ESTABLISHMENT BY DISTRICT + SLUG
====================================================== */

export const getEstablishmentBySlug = async (req, res) => {
  try {

    const { district, slug } = req.params;

    const establishments = await EstablishmentProfile.find({
      "address.district": new RegExp(district, "i")
    }).lean();

    const establishment = establishments.find(
      (e) => slugify(e.establishmentName) === slug
    );

    if (!establishment) {
      return res.status(404).json({ message: "Establishment not found" });
    }

    const gallery = await EstablishmentGallery.findOne({
      establishment: establishment.userId
    });

    const courses = await EstablishmentCourse.find({
      establishment: establishment.userId
    });

    const projects = await EstablishmentProject.find({
      establishment: establishment.userId
    });

    const about = await EstablishmentAbout.findOne({
      establishment: establishment.userId
    });

    const contact = await EstablishmentContact.findOne({
      establishment: establishment.userId
    });

    res.json({
      ...establishment,
      gallery: getGalleryWithFallback(establishment, gallery),
      courses,
      projects,
      about,
      contact
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

/* ======================================================
   GET ESTABLISHMENT BY ID
====================================================== */

export const getEstablishmentById = async (req, res) => {
  try {

    const { establishmentId } = req.params;

    const establishment = await EstablishmentProfile.findById(establishmentId);

    if (!establishment) {
      return res.status(404).json({ message: "Not Found" });
    }

    const gallery = await EstablishmentGallery.findOne({
      establishment: establishment.userId
    });

    const courses = await EstablishmentCourse.find({
      establishment: establishment.userId
    });

    const projects = await EstablishmentProject.find({
      establishment: establishment.userId
    });

    const about = await EstablishmentAbout.findOne({
      establishment: establishment.userId
    });

    const contact = await EstablishmentContact.findOne({
      establishment: establishment.userId
    });

    res.json({
      ...establishment.toObject(),
      gallery: getGalleryWithFallback(establishment.toObject(), gallery),
      courses,
      projects,
      about,
      contact
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};
