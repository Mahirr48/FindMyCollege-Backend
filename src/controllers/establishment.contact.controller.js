import Contact from "../models/establishment.contact.model.js";

/* ================= GET CONTACT ================= */

export const getContact = async (req, res) => {
  try {

    const estId = req.user.id;

    const contact = await Contact.findOne({
      establishment: estId
    });

    res.json(contact || {});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= UPDATE CONTACT ================= */

export const updateContact = async (req, res) => {
  try {

    const estId = req.user.id;

    const updated = await Contact.findOneAndUpdate(

      { establishment: estId },

      {
        ...req.body,
        establishment: estId
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