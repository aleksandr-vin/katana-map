import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, Marker, Popup, config } from '@maptiler/sdk';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = environment.maptilerApiKey;
  }

  ngAfterViewInit() {
    const initialState = { lat: 34.577528, lng: 133.8223832, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    let marker = new Marker({ color: "#FF0011" })
      .setLngLat([133.8223832, 34.577528])
      .addTo(this.map)
      .setPopup(new Popup()
        .setHTML(`
          <h3>Kurashiki Art Sword Museum</h3>
          <a href="https://touken-sato.com" target="_blank">touken-sato.com</a>
        `)
      );
  }

  ngOnDestroy() {
    this.map?.remove();
  }

}
