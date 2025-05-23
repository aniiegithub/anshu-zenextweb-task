const path = require('path');
const fs = require('fs');
const { generatePdf } = require('../utils/pdfGenerator');
// const Report = require('../models/Report'); // if using MongoDB

// Dummy in-memory store for demo
const reportStore = {};

exports.createReport = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const imagePath = req.file?.path;

    data._id = Date.now().toString(); // Dummy ID
    const pdfPath = await generatePdf(data, imagePath);
    data.pdfPath = pdfPath;

    reportStore[data._id] = data; // Save report
    res.status(201).json({ message: 'Report generated', id: data._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating report' });
  }
};

exports.getReportPdf = async (req, res) => {
  const report = reportStore[req.params.id];
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const filePath = report.pdfPath;
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'PDF not found' });

  res.sendFile(path.resolve(filePath));
};

exports.getReportById = async (req, res) => {
  const report = reportStore[req.params.id];
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
};
