const express = require("express");
const cors = require("cors");

const userRoutes = require("./route/UserRoute");
const testRoutes = require("./route/TestRoute");
const formRoutes = require("./route/FormRoute");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// routes
app.use("/api/user", userRoutes);
app.use("/api", testRoutes);
app.use("/api/form", formRoutes);

module.exports = app;
