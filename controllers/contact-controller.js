const { Contact } = require("../models");

exports.getContactsByUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    let contacts = await Contact.findAll({
      where: { userId },
      raw: true,
    });

    return res.send({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { user } = res.locals;
    let contacts;

    if (user.role === "superadmin") {
      contacts = await Contact.findAll({ raw: true });
    } else {
      contacts = await Contact.findAll({ where: { userId: user.id } });
    }

    return res.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createContactByUser = async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  const { name, email } = req.body;

  try {
    const newContact = await Contact.create({
      name,
      email,
      userId: user.id, // Set the correct userId based on your data
    });

    return res
      .status(201)
      .json({ message: "Contact created", contact: newContact });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createContact = async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  const { name, email } = req.body;

  try {
    // Check if the user is a superadmin
    if (user.role === "superadmin") {
      // Create the contact without associating it to any specific user
      const newContact = await Contact.create({
        name,
        email,
        userId: null, // Set userId to null for superadmin-created contacts
      });

      return res.status(201).json({
        message: "Contact created by superadmin",
        contact: newContact,
      });
    } else {
      // Create the contact and associate it with the current user
      const newContact = await Contact.create({
        name,
        email,
        userId: user.id,
      });

      return res
        .status(201)
        .json({ message: "Contact created", contact: newContact });
    }
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a contact by ID
exports.updateContactByUser = async (req, res) => {
  const { user } = res.locals;
  const contactId = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    const contact = await Contact.findOne({ where: { id: contactId } });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    contact.name = name;
    contact.email = email;

    await contact.save();

    return res.json({ message: "Contact updated", contact });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//***********Updation */

// Update a contact by ID
exports.updateContact = async (req, res) => {
  const { user } = res.locals;
  const contactId = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Check if the user is a superadmin or the contact owner
    if (user.role === "superadmin" || contact.userId === user.id) {
      contact.name = name;
      contact.email = email;

      await contact.save();

      return res.json({ message: "Contact updated", contact });
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a contact by ID
exports.deleteContactByUser = async (req, res) => {
  const { user } = res.locals;
  const contactId = parseInt(req.params.id);

  try {
    const contact = await Contact.findOne({ where: { id: contactId } });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    await contact.destroy();

    return res.json({ message: "Contact deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a contact by ID (for superadmin)
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteContact = async (req, res) => {
  const { user } = res.locals;
  const contactId = parseInt(req.params.id);

  try {
    const contact = await Contact.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (contact.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    // Check if the user is a superadmin
    if (user.role === "superadmin") {
      await contact.destroy();
      return res.json({ message: "Contact deleted by superadmin" });
    } else {
      // Check if the contact is associated with the user

      await contact.destroy();

      return res.json({ message: "Contact deleted" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

///*****New updated code as per the front end  */
// New controller function to get a contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.json({ contact });
  } catch (error) {
    console.error("Error fetching contact details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
