import React from 'react';

const QRDownload = ({ pdfUrl }) => {
  return (
    <div className="mt-4">
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        Download Medical Report PDF
      </a>
    </div>
  );
};

export default QRDownload;