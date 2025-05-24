const express = require('express');
const multer = require('multer');
const {
  createReport,
  getReportPdf,
  getReportById
} = require('../controllers/reportController');

const router = express.Router();

// Multer configuration for storing uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// POST /api/reports
// Creates a new report and returns PDF URL
router.post('/', upload.single('passportImage'), async (req, res) => {
  try {
    const reportData = await createReport(req);

    if (!reportData || !reportData.pdfUrl) {
      return res.status(500).json({ error: 'PDF URL missing from report creation' });
    }

    res.status(201).json({
      message: 'Report generated successfully',
      id: reportData._id,
      pdfUrl: reportData.pdfUrl
    });
  } catch (error) {
    console.error('Error creating report:', error.message);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// GET /api/reports/:id/pdf
// Returns PDF file by report ID
router.get('/:id/pdf', getReportPdf);

// GET /api/reports/:id
// Returns raw report data by ID
router.get('/:id', getReportById);

module.exports = router;
