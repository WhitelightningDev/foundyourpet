import QRCode from 'qrcode.react';

const QRGenerator = ({ petId }) => {
  const qrUrl = `http://localhost:3000/pet/${petId}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${petId}_qr.png`;
    downloadLink.click();
  };

  return (
    <div className="text-center">
      <QRCode id="qr-gen" value={qrUrl} size={256} />
      <p className="mt-2">{qrUrl}</p>
      <button onClick={downloadQRCode} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Download QR Code
      </button>
    </div>
  );
};
