const path = require('path');
const fs = require('fs');
const { generatePdf } = require('../utils/pdfGenerator');

// Dummy in-memory store for demo
const reportStore = {};

exports.createReport = async (req) => {
  try {
    // Parse JSON data sent in 'data' field of multipart/form-data
    const data = JSON.parse(req.body.data || '{}');
    const imagePath = req.file?.path;

    data._id = Date.now().toString(); // Generate dummy ID

    // generatePdf creates the PDF and returns the file path
    const pdfPath = await generatePdf(data, imagePath);

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      throw new Error('PDF generation failed');
    }

    const pdfFileName = path.basename(pdfPath);
data.pdfUrl = `/api/reports/${data._id}/pdf`;  // the route to serve PDF
data.pdfPath = pdfPath;


    // Store report in memory (replace with DB in production)
    reportStore[data._id] = data;

    return data; // Return the report data back to route
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

  res.sendFile(path.resolve(filePath), err => {
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
