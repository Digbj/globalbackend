const express = require("express");
const router = express.Router();

const { submitForm } = require("../controller/formController");
const { getPdf } = require("../controller/pdfController");

router.post("/submit", submitForm);
router.get("/:id/pdf", getPdf);

module.exports = router;
