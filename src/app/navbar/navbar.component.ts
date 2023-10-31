import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { KatanaService } from '../katana.service';
import { KatanaLocation } from '../katanalocation';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule],
})
export class NavbarComponent {
  katanaLocationList: KatanaLocation[] = [];
  katanaService: KatanaService = inject(KatanaService);

  constructor() {
    this.katanaLocationList = this.katanaService.getAllKatanaLocations();
  }

  onShare() {
    navigator.share({ url: location.href });
  }
}
