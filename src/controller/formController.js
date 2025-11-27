const UserForm = require("../model/Form");

//submit form controller
exports.submitForm = async (req, res) => {
  try {
    const userId = req.body.userId;

    const encoded = req.body.encodedData;
    if (!encoded) {
      return res.status(400).json({ msg: "encodedData required" });
    }

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
    const decoded = JSON.parse(
      Buffer.from(encoded, "base64").toString("utf-8")
    );

    decoded.userId = userId;

    const newForm = await UserForm.create(decoded);

    res.status(201).json({
      msg: "Form submitted successfully",
      formId: newForm._id,
    });
  } catch (err) {
    console.error("Error details:", err);
    console.error("Error message:", err.message);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        msg: "Validation error",
        errors: err.errors,
        details: Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        })),
      });
    }

    res.status(500).json({
      msg: "Error saving form",
      error: err.message,
    });
  }
};

//get form controller
exports.getUserForms = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const forms = await UserForm.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!forms || forms.length === 0) {
      return res.status(404).json({
        msg: "No forms found for this user",
        forms: [],
      });
    }

    res.status(200).json({
      msg: "Forms retrieved successfully",
      count: forms.length,
      forms: forms,
    });
  } catch (err) {
    console.error("Error fetching user forms:", err);
    res.status(500).json({
      msg: "Error fetching forms",
      error: err.message,
    });
  }
};
