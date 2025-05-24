import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRDownload = ({ pdfUrl }) => {
  return (
    <div className="mt-4 text-center space-y-4">
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline block"
      >
        Download Medical Report PDF
      </a>

      <div className="inline-block">
        <p className="font-semibold">Scan QR to Download:</p>
        <QRCodeCanvas value={pdfUrl} size={128} />
      </div>
    </div>
  );
};

export default QRDownload;
