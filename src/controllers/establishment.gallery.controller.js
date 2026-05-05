import Gallery from "../models/establishment.gallery.model.js";

/* ================= GET GALLERY ================= */

export const getGallery = async (req, res) => {
  try {

    const estId = req.user.id;

    let gallery = await Gallery.findOne({ establishment: estId });

    if (!gallery) {
      gallery = await Gallery.create({
        establishment: estId,
        logo: "",
        banner: "",
        images: [],
      });
    }

    res.json(gallery);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE OR UPDATE ================= */

export const createOrUpdateGallery = async (req, res) => {
  try {

    const estId = req.user.id;

    const logo = req.files?.logo?.[0]?.filename;
    const banner = req.files?.banner?.[0]?.filename;

    const images =
      req.files?.images?.map((file) => "/uploads/" + file.filename) || [];

    let gallery = await Gallery.findOne({ establishment: estId });

    if (!gallery) {

      gallery = await Gallery.create({
        establishment: estId,
        logo: logo ? "/uploads/" + logo : "",
        banner: banner ? "/uploads/" + banner : "",
        images,
      });

    } else {

      if (logo) gallery.logo = "/uploads/" + logo;

      if (banner) gallery.banner = "/uploads/" + banner;

      if (images.length > 0) {
        gallery.images = [...gallery.images, ...images];
      }

      await gallery.save();
    }

    res.json(gallery);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE IMAGE ================= */

export const deleteSingleImage = async (req, res) => {
  try {

    const { imageUrl } = req.body;
    const estId = req.user.id;

    const gallery = await Gallery.findOne({ establishment: estId });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    gallery.images = gallery.images.filter(
      (img) => img !== imageUrl
    );

    await gallery.save();

    res.json({ message: "Image deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};