const path = require('path');
const fs = require('fs');
const { generatePdf } = require('../utils/pdfGenerator');

// Dummy in-memory store for demo; replace with DB in production
const reportStore = {};

exports.createReport = async (req) => {
  try {
    // Instead of parsing JSON from req.body.data, use req.body directly:
    // multer automatically parses multipart/form-data fields into req.body as strings
    const data = { ...req.body };

    // Assign an _id (you can use a better ID generation method or DB-generated IDs)
    data._id = Date.now().toString();

    // Image path (relative to your server folder)
    const imagePath = req.file?.path;

    // Call PDF generator with full data and image path
    const pdfPath = await generatePdf(data, imagePath);

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      throw new Error('PDF generation failed');
    }

    // Save PDF URL for frontend to access PDF via backend route
    data.pdfUrl = `/api/reports/${data._id}/pdf`;
    data.pdfPath = pdfPath;

    // Store the full report in memory for retrieval (replace with DB in prod)
    reportStore[data._id] = data;

    // Return full report including PDF url
    return data;
  } catch (err) {
    console.error('Error in createReport:', err);
    throw err;
  }
};

exports.getReportPdf = async (req, res) => {
  const report = reportStore[req.params.id];
  if (!report) {
    console.log('Report not found for id:', req.params.id);
    return res.status(404).json({ message: 'Report not found' });
  }

  const filePath = report.pdfPath;
  if (!filePath || !fs.existsSync(filePath)) {
    console.log('PDF file not found at path:', filePath);
    return res.status(404).json({ message: 'PDF not found' });
  }

  console.log('Sending PDF file:', filePath);

  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      console.error('Error sending PDF:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error sending PDF file' });
      }
    } else {
      console.log('PDF sent successfully');
    }
  });
};

exports.getReportById = async (req, res) => {
  const report = reportStore[req.params.id];
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
};
