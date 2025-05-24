const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const PDFTable = require('pdfkit-table');

exports.generatePdf = async (data, imagePath) => {
  console.log('Generating PDF with data:', data);
  console.log('Image path:', imagePath);

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Safe file name
  const safeName = (data.fullName || 'Unknown')
    .split(' ')[0]
    .replace(/[^a-zA-Z0-9]/g, '');
  const pdfName = `${safeName}_Medical_Report.pdf`;
  const filePath = path.join(uploadsDir, pdfName);

  const doc = new PDFDocument({ size: 'A4', margin: 30 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Watermark (optional)
  const watermarkPath = path.join(__dirname, '..', 'assets', 'watermark.png');
  if (fs.existsSync(watermarkPath)) {
    doc.image(watermarkPath, 130, 200, { width: 300, opacity: 0.1 });
  }

  // Header
  doc.fontSize(22).fillColor('black').font('Helvetica-Bold').text('Health Plus+', { align: 'left' });
  doc.fontSize(14).text('Diagnostic Centre', { align: 'left' });

  // Metadata (Top-right)
  doc.fontSize(10).font('Helvetica');
  doc.text(`LAB SR NO: ${data.labSrNo || '1234'}`, 420, 40);
  doc.text(`COUNTRY: ${data.country || 'India'}`, 420, 55);
  doc.text(`EXAMINED DATE: ${data.dateOfIssue || 'N/A'}`, 420, 70);
  doc.text(`EXPIRY DATE: ${data.expiryDate || '2026-01-01'}`, 420, 85);

  doc.moveDown().moveDown();

  // Candidate Info
  doc.fontSize(13).font('Helvetica-Bold').text('CANDIDATE INFORMATION', { underline: true });
  doc.fontSize(10).font('Helvetica');

  const infoY = doc.y + 10;
  doc.text(`FULL NAME: ${data.fullName || 'N/A'}`, 30, infoY);
  doc.text(`AGE: ${data.age || 'N/A'}`, 300, infoY);
  doc.text(`DATE OF BIRTH: ${data.dob || 'N/A'}`, 30, infoY + 15);
  doc.text(`POST APPLIED FOR: ${data.postAppliedFor || 'N/A'}`, 300, infoY + 15);
  doc.text(`HEIGHT: ${data.height || 'N/A'}`, 30, infoY + 30);
  doc.text(`WEIGHT: ${data.weight || 'N/A'}`, 300, infoY + 30);
  doc.text(`DATE OF ISSUE: ${data.dateOfIssue || 'N/A'}`, 30, infoY + 45);
  doc.text(`PLACE OF ISSUE: ${data.placeOfIssue || 'N/A'}`, 300, infoY + 45);
  doc.text(`NATIONALITY: ${data.nationality || 'N/A'}`, 30, infoY + 60);
  doc.text(`PASSPORT NO: ${data.passportNo || 'N/A'}`, 300, infoY + 60);
  doc.text(`GENDER: ${data.gender || 'N/A'}`, 30, infoY + 75);
  doc.text(`MARITAL STATUS: ${data.maritalStatus || 'N/A'}`, 300, infoY + 75);

  // Profile Image
  if (imagePath && fs.existsSync(imagePath)) {
    doc.image(imagePath, 440, infoY + 95, { width: 90, height: 110 });
  }

  // Medical Examination Table
  doc.moveDown().moveDown().fontSize(13).font('Helvetica-Bold').text('MEDICAL EXAMINATION');
  doc.fontSize(10).font('Helvetica');

  const medicalData = Object.entries(data.medical || {}).map(([key, val]) => [key, val || 'N/A']);
  const medicalTable = {
    headers: ['Test', 'Result'],
    rows: medicalData,
  };
  await doc.table(medicalTable, { width: 500 });

  // Laboratory Examination Table
  doc.moveDown().fontSize(13).font('Helvetica-Bold').text('LABORATORY EXAMINATION');
  doc.fontSize(10).font('Helvetica');

  const laboratoryData = Object.entries(data.laboratory || {}).map(([key, val]) => [key, val || 'N/A']);
  const laboratoryTable = {
    headers: ['Test', 'Result'],
    rows: laboratoryData,
  };
  await doc.table(laboratoryTable, { width: 500 });

  // QR Code to download PDF
  const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:5000';
  const qrCodeURL = `${serverBaseUrl}/api/reports/${data._id}/pdf`;

  try {
    const qrImage = await QRCode.toDataURL(qrCodeURL);
    const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
    doc.image(qrBuffer, 40, 700, { width: 90 });
  } catch (qrErr) {
    console.error('QR code generation failed:', qrErr);
  }

  // FIT / UNFIT status
  const statusColor = data.fitStatus === 'FIT' ? 'green' : 'red';
  doc.fontSize(25).fillColor(statusColor).font('Helvetica-Bold').text(data.fitStatus || 'UNKNOWN', 200, 710, { align: 'center' });

  // Signature
  const signaturePath = path.join(__dirname, '..', 'assets', 'signature.png');
  if (fs.existsSync(signaturePath)) {
    doc.image(signaturePath, 400, 700, { width: 100 });
  }

  // Finalize PDF
  console.log('Finished writing content to PDF');
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
