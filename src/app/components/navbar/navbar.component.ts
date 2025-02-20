import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../shared/material.services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ...MaterialService.materialModules, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  // No need for the sidenav toggle logic anymore
}
