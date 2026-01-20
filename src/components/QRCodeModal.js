import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, QrCode, Ruler, Copy } from "lucide-react";

function QRCodeModal({
  show,
  onHide,
  pet,
  handleDownloadQRCode,
  handleDownloadQRCodeAsPDF,
  handleDownloadQRCodeAsDXF,
}) {
  if (!pet) return null;

  const qrValue = `https://foundyourpet.vercel.app/p/${pet._id}`;

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onHide();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            QR code preview
          </DialogTitle>
          <DialogDescription>
            Use these downloads for printing and engraving.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm ring-1 ring-primary/10">
            <QRCodeCanvas
              id={`qr-${pet._id}`}
              value={qrValue}
              size={220}
              level="H"
              includeMargin
            />
          </div>

          <div className="w-full rounded-xl border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Destination</div>
                <div className="truncate text-sm font-medium">{qrValue}</div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(qrValue);
                  } catch {
                    // no-op
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2">
            <Badge variant="secondary">Pet ID: {pet._id}</Badge>
            {pet.tagType ? <Badge variant="outline">Tag: {pet.tagType}</Badge> : null}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant="outline" className="gap-2" onClick={() => handleDownloadQRCode(pet._id)}>
            <Download className="h-4 w-4" />
            PNG
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleDownloadQRCodeAsPDF(pet._id)}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleDownloadQRCodeAsDXF(pet._id, qrValue)}
          >
            <Ruler className="h-4 w-4" />
            DXF
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onHide}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeModal;
