const PDFDocument = require("pdfkit");
const UserForm = require("../model/Form");

exports.getPdf = async (req, res) => {
  try {
    const form = await UserForm.findById(req.params.id).lean();

    if (!form) return res.status(404).json({ msg: "Form not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=application-form-${form.firstName}-${form.lastName}.pdf`
    );
    doc.pipe(res);

    const addSectionHeader = (title) => {
      doc
        .moveDown(0.5)
        .fontSize(14)
        .fillColor("#2563eb")
        .text(title, { underline: true })
        .moveDown(0.3)
        .fillColor("#000000");
    };

    const addField = (label, value) => {
      if (value) {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`${label}: `, { continued: true })
          .font("Helvetica")
          .text(value || "N/A")
          .moveDown(0.2);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    let photoBottomY = 50;
    if (form.photo) {
      try {
        const img = form.photo.replace(/^data:image\/\w+;base64,/, "");
        const imgBuffer = Buffer.from(img, "base64");

        const photoWidth = 100;
        const photoHeight = 120;
        const photoX = doc.page.width - photoWidth - 50;
        const photoY = 50;

        doc.image(imgBuffer, photoX, photoY, {
          width: photoWidth,
          height: photoHeight,
        });

        photoBottomY = photoY + photoHeight + 10;
      } catch (imgError) {
        console.error("Error adding image to PDF:", imgError);
      }
    }

    doc
      .fontSize(22)
      .fillColor("#1e40af")
      .font("Helvetica-Bold")
      .text("APPLICATION FORM", 50, 50, { align: "left", width: 350 })
      .moveDown(0.3);

    doc
      .fontSize(10)
      .fillColor("#666666")
      .font("Helvetica")
      .text(`Form ID: ${form._id}`, 50, doc.y, { align: "left", width: 350 })
      .text(`Submitted on: ${formatDate(form.submissionDate)}`, 50, doc.y, {
        align: "left",
        width: 350,
      });

    const lineY = Math.max(doc.y + 20, photoBottomY);

    doc
      .strokeColor("#2563eb")
      .lineWidth(2)
      .moveTo(50, lineY)
      .lineTo(550, lineY)
      .stroke();

    doc.y = lineY + 20;

    //personal details
    addSectionHeader("PERSONAL INFORMATION");
    addField("First Name", form.firstName);
    addField("Last Name", form.lastName);
    addField("Father's Name", form.fatherName);
    addField("Mother's Name", form.motherName);
    addField("Date of Birth", formatDate(form.dob));
    addField("Email", form.email);

    // educational qualification
    addSectionHeader("EDUCATIONAL & OTHER DETAILS");
    addField("Education", form.education);
    addField("Religion", form.religion);
    if (form.religionOther) {
      addField("Religion (Other)", form.religionOther);
    }
    if (form.languages && Array.isArray(form.languages)) {
      addField("Languages", form.languages.join(", "));
    }
    addField("Category", form.category);
    addField("Disabled", form.disabled);
    if (form.disabilityType) {
      addField("Disability Type", form.disabilityType);
    }

    // address details
    addSectionHeader("ADDRESS");
    addField("Address Line 1", form.line1);
    if (form.line2) {
      addField("Address Line 2", form.line2);
    }
    addField("City", form.city);
    addField("State", form.state);
    addField("Pincode", form.pincode);

    // declaration
    addSectionHeader("DECLARATION");
    addField("Place", form.place);
    addField("Date", formatDate(form.submissionDate));

    // footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text("___________________________", { align: "center" })
      .moveDown(0.3)
      .text("Applicant's Signature", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(`Generated on ${new Date().toLocaleString()}`, {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);

    if (!res.headersSent) {
      res.status(500).json({
        msg: "Error generating PDF",
        error: err.message,
      });
    }
  }
};
