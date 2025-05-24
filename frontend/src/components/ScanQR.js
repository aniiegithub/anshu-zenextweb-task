import React, { useState } from 'react';
import QRDownload from './QRDownload';  // adjust path if needed

const ScanQR = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (data) => {
    if (!data) return;

    setScannedData(data);

    try {
      // Send scanned data to backend API to generate PDF
      const response = await fetch('http://localhost:5000/api/generate-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedData: data })
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const pdfBlob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      setPdfUrl(pdfUrl);

    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div>
      {/* Your QR scanner UI goes here */}
      {/* Pass scanned QR code data to handleScan */}

      {scannedData && <div>Scanned Data: {JSON.stringify(scannedData)}</div>}
      {pdfUrl && <QRDownload pdfUrl={pdfUrl} />}
    </div>
  );
};

export default ScanQR;
