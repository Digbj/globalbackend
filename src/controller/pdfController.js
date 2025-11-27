const PDFDocument = require("pdfkit");
const UserForm = require("../model/Form");

exports.getPdf = async (req, res) => {
  try {
    const form = await UserForm.findById(req.params.id).lean();

    if (!form) return res.status(404).json({ msg: "Form not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=form-${form._id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("User Form Submission", { align: "center" });

    Object.entries(form).forEach(([key, value]) => {
      if (key === "photo") return;
      if (value) doc.fontSize(12).text(`${key}: ${value}`);
    });

    if (form.photo) {
      const img = form.photo.replace(/^data:image\/\w+;base64,/, "");
      const imgBuffer = Buffer.from(img, "base64");
      doc.addPage();
      doc.text("Photo:");
      doc.image(imgBuffer, { width: 120 });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generating PDF" });
  }
};
