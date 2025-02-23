import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialService } from '../../shared/material.services';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../../dialog/qr-code-dialog/qr-code-dialog.component';
import { NfcGpsDialogComponent } from '../../dialog/nfc-gps-dialog/nfc-gps-dialog.component';
import { LostPetAlertsDialogComponent } from '../../dialog/lost-pet-alerts-dialog/lost-pet-alerts-dialog.component';
import { SignUpDialogComponent } from '../../dialog/sign-up-dialog/sign-up-dialog.component';


@Component({
  selector: 'app-home',
  imports: [...MaterialService.materialModules],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {

  constructor(private dialog: MatDialog) {}

  openQrCodeDialog() {
    this.dialog.open(QrCodeDialogComponent);
  }
  

  openNfcGpsDialog() {
    this.dialog.open(NfcGpsDialogComponent);
  }

  openLostPetAlertsDialog() {
    this.dialog.open(LostPetAlertsDialogComponent);
  }

  openSignUpDialog(){
    this.dialog.open(SignUpDialogComponent)
  }


}
