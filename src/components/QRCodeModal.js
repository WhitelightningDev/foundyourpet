import React from "react";
import { Modal, Button } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { FaFilePdf, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";  // Ensure jsPDF is used in your download logic
import QRCode from "qrcode";    // Ensure QRCode is used if necessary for DXF generation

function QRCodeModal({ showQRModal, handleClose, selectedPet, handleDownloadQRCode, handleDownloadQRCodeAsDXF }) {
  // Handle PDF download
  const downloadPDF = () => {
    const canvas = document.getElementById(`qr-${selectedPet?._id}`);
    const pngDataUrl = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.text("Found Your Pet - QR Code", 20, 20);
    pdf.addImage(pngDataUrl, "PNG", 15, 30, 180, 180);
    pdf.save(`${selectedPet?._id}_qr.pdf`);
  };

  // Handle DXF download
  const downloadDXF = async () => {
    try {
      const qrData = await QRCode.create(selectedPet?.qrCodeValue, { errorCorrectionLevel: "H" });
      const modules = qrData.modules;
      const size = modules.size;
      const data = modules.data;

      let dxfContent = "0\nSECTION\n2\nENTITIES\n";
      const scale = 10;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (data[y * size + x]) {
            const x1 = x * scale;
            const y1 = y * scale;
            const x2 = x1 + scale;
            const y2 = y1 + scale;

            dxfContent += `
0
LWPOLYLINE
8
QR
90
4
70
1
10
${x1}
20
${y1}
10
${x2}
20
${y1}
10
${x2}
20
${y2}
10
${x1}
20
${y2}
10
${x1}
20
${y1}
`;
          }
        }
      }

      dxfContent += "0\nENDSEC\n0\nEOF";

      const blob = new Blob([dxfContent], { type: "application/dxf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedPet?._id}_qr.dxf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate DXF QR code", err);
    }
  };

  return (
    <Modal show={showQRModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>QR Code for {selectedPet?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {/* QR Code Canvas */}
          <QRCodeCanvas
            id={`qr-${selectedPet?._id}`}
            value={selectedPet?.qrCodeValue || ""}
            size={256} // Adjust size if needed
          />
        </div>
        <div className="text-center mt-3">
          {/* Download PDF Button */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={downloadPDF}  // Use the local downloadPDF function
            className="me-2"
          >
            <FaFilePdf /> Download PDF
          </Button>
          
          {/* Download DXF Button */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={downloadDXF}  // Use the local downloadDXF function
          >
            <FaDownload /> Download DXF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default QRCodeModal;
