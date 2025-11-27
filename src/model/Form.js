const mongoose = require("mongoose");

const UserFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },

    education: { type: String, required: true },
    religion: { type: String, required: true },
    religionOther: { type: String },
    languages: { type: [String], required: true },
    category: { type: String, required: true },
    disabled: { type: String, enum: ["Yes", "No"], required: true },
    disabilityType: { type: String },

    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    photo: { type: String, required: true },
    place: { type: String, required: true },
    submissionDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserForm", UserFormSchema);
