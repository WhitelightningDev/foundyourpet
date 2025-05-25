import React from "react";
import { Modal, Button } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { FaFilePdf, FaQrcode, FaDownload } from "react-icons/fa";

function QRCodeModal({
  show,
  onHide,
  pet,
  handleDownloadQRCode,
  handleDownloadQRCodeAsPDF,
  handleDownloadQRCodeAsDXF,
}) {
  if (!pet) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>QR Code Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <QRCodeCanvas
          value={`https://foundyourpet.vercel.app/pet-profile/${pet._id}`}
          size={200}
          level="H"
          includeMargin
        />
        <div className="mt-4 d-flex flex-column gap-2">
          <Button variant="outline-success" onClick={() => handleDownloadQRCode(pet._id)}>
            <FaQrcode className="me-2" />
            Download QR Code (PNG)
          </Button>
          <Button variant="outline-danger" onClick={() => handleDownloadQRCodeAsPDF(pet._id)}>
            <FaFilePdf className="me-2" />
            Download QR as PDF
          </Button>
          <Button
            variant="outline-dark"
            onClick={() =>
              handleDownloadQRCodeAsDXF(
                pet._id,
                `https://foundyourpet.vercel.app/pet-profile/${pet._id}`
              )
            }
          >
            <FaDownload className="me-2" />
            Download QR as DXF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default QRCodeModal;
