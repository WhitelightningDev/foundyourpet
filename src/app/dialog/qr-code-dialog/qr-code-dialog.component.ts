import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.css']
})
export class QrCodeDialogComponent {

  constructor(public dialogRef: MatDialogRef<QrCodeDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();  // Close the dialog programmatically
  }
}
