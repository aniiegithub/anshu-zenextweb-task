const express = require('express');
const multer = require('multer');
const { createReport, getReportPdf, getReportById } = require('../controllers/reportController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.single('passportImage'), createReport);
router.get('/:id/pdf', getReportPdf);
router.get('/:id', getReportById);

module.exports = router;
