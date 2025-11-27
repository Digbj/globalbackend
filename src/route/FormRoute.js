const express = require("express");
const router = express.Router();

const { submitForm } = require("../controller/formController");
const { getPdf } = require("../controller/pdfController");
const { getUserForms}=require('../controller/formController')
router.post("/submit", submitForm);
router.get("/user/:userId", getUserForms);
router.get("/:id/pdf", getPdf);

module.exports = router;
