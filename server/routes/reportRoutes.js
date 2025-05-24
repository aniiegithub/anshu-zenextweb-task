const express = require('express');
const multer = require('multer');
const { createReport, getReportPdf, getReportById } = require('../controllers/reportController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// POST route to create report and return PDF URL
router.post('/', upload.single('passportImage'), async (req, res) => {
  try {
    // Call the controller to create report and get the result data
    const reportData = await createReport(req);

if (!reportData || !reportData.pdfUrl) {
  return res.status(500).json({ error: 'PDF URL missing from report creation' });
}

res.status(201).json({
  message: 'Report generated',
  id: reportData._id,
  pdfUrl: reportData.pdfUrl // This will be a URL path, not a local file path
});

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

router.get('/:id/pdf', getReportPdf);
router.get('/:id', getReportById);

module.exports = router;
