const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const {
  isAuthenticated,
  isAutherized,
} = require("../middleware/auth-middleware");

// Get all contacts
router.get("/", isAuthenticated, contactController.getContacts);

//****** *updated route for front end/
// New route to fetch a contact by ID
router.get("/:id", isAuthenticated, contactController.getContactById);

//******* */

// Get All contacts of a users
router.get(
  "/by-user/:id",
  isAuthenticated,
  isAutherized("superadmin"),
  contactController.getContactsByUser
);

router.post("/", isAuthenticated, contactController.createContact);
// Create a new contact through super admin
router.post(
  "/by-user/:id",
  isAuthenticated,
  isAutherized("superadmin"),
  contactController.createContactByUser
);

// Update a contact by ID
router.put("/:id", isAuthenticated, contactController.updateContact);
router.put(
  "/by-user/:id",
  isAuthenticated,
  isAutherized("superadmin"),
  contactController.updateContactByUser
);

// Delete a contact by ID
router.delete("/:id", isAuthenticated, contactController.deleteContact);

router.delete(
  "/by-user/:id",
  isAuthenticated,
  isAutherized("superadmin"),
  contactController.deleteContactByUser
);

module.exports = router;
