const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

exports.generatePdf = async (data, imagePath) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const safeName = (data.fullName || 'Unknown').split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
  const pdfName = `${safeName}_Medical_Report.pdf`;
  const filePath = path.join(uploadsDir, pdfName);

  const doc = new PDFDocument({ size: 'A4', margin: 30 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const watermarkPath = path.join(__dirname, '..', 'assets', 'watermark.png');
  if (fs.existsSync(watermarkPath)) {
    doc.image(watermarkPath, 130, 200, { width: 300, opacity: 0.1 });
  }

  doc.fontSize(22).fillColor('black').font('Helvetica-Bold').text('Health Plus+', { align: 'left' });
  doc.fontSize(14).text('Diagnostic Centre', { align: 'left' });

  doc.fontSize(10).font('Helvetica');
  doc.text(`LAB SR NO: ${data.labSrNo || '1234'}`, 420, 40);
  doc.text(`COUNTRY: ${data.country || 'India'}`, 420, 55);
  doc.text(`EXAMINED DATE: ${data.dateOfIssue}`, 420, 70);
  doc.text(`EXPIRY DATE: ${data.expiryDate || '2026-01-01'}`, 420, 85);

  doc.moveDown().moveDown();
  doc.fontSize(13).font('Helvetica-Bold').text('CANDIDATE INFORMATION', { underline: true });
  doc.fontSize(10).font('Helvetica');

  const infoY = doc.y + 10;
  doc.text(`FULL NAME: ${data.fullName}`, 30, infoY);
  doc.text(`AGE: ${data.age}`, 300, infoY);
  doc.text(`DATE OF BIRTH: ${data.dob}`, 30, infoY + 15);
  doc.text(`POST APPLIED FOR: ${data.postAppliedFor}`, 300, infoY + 15);
  doc.text(`HEIGHT: ${data.height}`, 30, infoY + 30);
  doc.text(`WEIGHT: ${data.weight}`, 300, infoY + 30);
  doc.text(`DATE OF ISSUE: ${data.dateOfIssue}`, 30, infoY + 45);
  doc.text(`PLACE OF ISSUE: ${data.placeOfIssue}`, 300, infoY + 45);
  doc.text(`NATIONALITY: ${data.nationality}`, 30, infoY + 60);
  doc.text(`PASSPORT NO: ${data.passportNo}`, 300, infoY + 60);
  doc.text(`GENDER: ${data.gender}`, 30, infoY + 75);
  doc.text(`MARITAL STATUS: ${data.maritalStatus}`, 300, infoY + 75);

  if (imagePath && fs.existsSync(imagePath)) {
    doc.image(imagePath, 440, infoY + 95, { width: 90, height: 110 });
  }

  doc.moveDown().moveDown().fontSize(13).font('Helvetica-Bold').text('MEDICAL EXAMINATION');
  doc.fontSize(10).font('Helvetica');
  for (const [key, val] of Object.entries(data.medical || {})) {
    doc.text(`${key}: ${val || 'N/A'}`);
  }

  doc.moveDown().fontSize(13).font('Helvetica-Bold').text('LABORATORY EXAMINATION');
  doc.fontSize(10).font('Helvetica');
  for (const [key, val] of Object.entries(data.laboratory || {})) {
    doc.text(`${key}: ${val || 'N/A'}`);
  }

  const serverIP = '192.168.0.101';
  const qrCodeURL = `http://${serverIP}:5000/api/reports/${data._id}/pdf`;
  const qrImage = await QRCode.toDataURL(qrCodeURL);
  const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
  doc.image(qrBuffer, 40, 700, { width: 90 });

  const statusColor = data.fitStatus === 'FIT' ? 'green' : 'red';
  doc.fontSize(25).fillColor(statusColor).font('Helvetica-Bold').text(data.fitStatus, 200, 710, { align: 'center' });

  const signaturePath = path.join(__dirname, '..', 'assets', 'signature.png');
  if (fs.existsSync(signaturePath)) {
    doc.image(signaturePath, 400, 700, { width: 100 });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
