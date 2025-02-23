import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nfc-gps-dialog',
  templateUrl: './nfc-gps-dialog.component.html',
  styleUrls: ['./nfc-gps-dialog.component.css']
})
export class NfcGpsDialogComponent {

  constructor(public dialogRef: MatDialogRef<NfcGpsDialogComponent>) {}

  // Method to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}
