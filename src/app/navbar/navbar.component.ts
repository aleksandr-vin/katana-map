import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { KatanaService } from '../katana.service';
import { KatanaLocation } from '../katanalocation';

import packageJson from '../../../package.json';
import { environment } from './../../environments/environment';

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
  commitHash: string = environment.commitHash;
  appVersion: string = `${packageJson.version} (${environment.commitHash})`;

  constructor() {
    this.katanaLocationList = this.katanaService.getAllKatanaLocations();
  }

  onShare() {
    navigator.share({ url: location.href, title: 'Katana Map', text: 'Map of places, where to see katana swords' });
  }
}
