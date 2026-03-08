const express = require("express");
const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  markContactAsRepliedController,
} = require("../controllers/contactUsController");

const router = express.Router();

/** GET /contact-us? **/
router.get("/", getAllContactsController);

/** GET /contact-us/:id **/
router.get("/:id", getContactByIdController);

/** POST * body: { name, email, order_code? | orderNumber?, phone?, subject, message }*/
router.post("/", createContactController);

/**  PATCH /contact-us/:id/reply **/
router.patch("/:id/reply", markContactAsRepliedController);

module.exports = router;
