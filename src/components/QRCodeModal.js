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
import { PUBLIC_SITE_URL } from "../config/api";

function QRCodeModal({
  show,
  onHide,
  pet,
  handleDownloadQRCode,
  handleDownloadQRCodeAsPDF,
  handleDownloadQRCodeAsDXF,
}) {
  if (!pet) return null;

  const qrValue = `${PUBLIC_SITE_URL}/p/${pet._id}`;

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) onHide();
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg flex-col overflow-hidden p-0">
        <div className="border-b bg-muted/30 p-6 pr-12">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR code preview
            </DialogTitle>
            <DialogDescription>
              Use these downloads for printing and engraving.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
            <div className="rounded-2xl border bg-card p-3 shadow-sm ring-1 ring-primary/10 sm:p-4">
              <QRCodeCanvas
                id={`qr-${pet._id}`}
                value={qrValue}
                size={220}
                level="H"
                includeMargin
              />
            </div>

            <div className="w-full rounded-xl border bg-muted/20 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="break-all font-mono text-xs font-medium leading-snug text-foreground">
                    {qrValue}
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full shrink-0 gap-2 sm:w-auto"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(qrValue);
                    } catch {
                      // no-op
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy link
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2">
              <Badge variant="secondary" className="max-w-full truncate font-mono text-xs">
                Pet ID: {pet._id}
              </Badge>
              {pet.tagType ? (
                <Badge variant="outline" className="max-w-full truncate">
                  Tag: {pet.tagType}
                </Badge>
              ) : null}
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
              <Button variant="outline" className="w-full gap-2" onClick={() => handleDownloadQRCode(pet._id)}>
                <Download className="h-4 w-4" />
                PNG
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => handleDownloadQRCodeAsPDF(pet._id)}>
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleDownloadQRCodeAsDXF(pet._id, qrValue)}
              >
                <Ruler className="h-4 w-4" />
                DXF
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t bg-muted/30 px-6 py-4">
          <DialogFooter>
            <Button variant="outline" onClick={onHide}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeModal;
