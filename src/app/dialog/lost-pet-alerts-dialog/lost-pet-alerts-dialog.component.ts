import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lost-pet-alerts-dialog',
  templateUrl: './lost-pet-alerts-dialog.component.html',
  styleUrls: ['./lost-pet-alerts-dialog.component.css']
})
export class LostPetAlertsDialogComponent {

  constructor(public dialogRef: MatDialogRef<LostPetAlertsDialogComponent>) {}

  // Method to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}
