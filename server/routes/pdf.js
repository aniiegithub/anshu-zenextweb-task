const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// If your main app does not have bodyParser or express.json(), uncomment this:
// router.use(express.json());

router.post('/generate-pdf', (req, res) => {
  try {
    const data = req.body; // Expect scanned QR data as JSON

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=output.pdf',
        'Content-Length': pdfData.length,
      });
      res.end(pdfData);
    });

    // PDF content - customize based on your required format
    doc.fontSize(20).text('User Details', { underline: true, align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${data.name || ''}`);
    doc.text(`Email: ${data.email || ''}`);
    doc.text(`Phone: ${data.phone || ''}`);

    // Add more fields as needed here, example:
    // doc.text(`Address: ${data.address || ''}`);
    // doc.text(`DOB: ${data.dob || ''}`);

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;
