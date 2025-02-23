import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-dialog',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.css'
})
export class SignUpDialogComponent {

  constructor(private router: Router, public dialogRef: MatDialogRef<SignUpDialogComponent>) {}

  // Method to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }


  // If user clicks 'Yes' - navigate to login page
  onYesClick(): void {
    this.router.navigate(['/login']);
    this.dialogRef.close();  // Close the dialog
  }

  // If user clicks 'No' - navigate to sign up page
  onNoClick(): void {
    this.router.navigate(['/signup']);
    this.dialogRef.close();  // Close the dialog
  }
}
