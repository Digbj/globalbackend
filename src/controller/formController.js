exports.submitForm = async (req, res) => {
  try {
    const encoded = req.body.encodedData;
    if (!encoded) return res.status(400).json({ msg: "encodedData required" });

    const decoded = JSON.parse(
      Buffer.from(encoded, "base64").toString("utf-8")
    );

    decoded.userId = req.user.id;

    const newForm = await UserForm.create(decoded);

    res.status(201).json({
      msg: "Form submitted successfully",
      formId: newForm._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error saving form" });
  }
};
