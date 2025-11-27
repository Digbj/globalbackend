const express = require("express");
const router = express.Router();
// test Route
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route is working!" });
});
module.exports = router;