import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, Marker, Popup, config } from '@maptiler/sdk';

import { environment } from './../../environments/environment';
import { KatanaLocation } from '../katanalocation';
import { KatanaService } from '../katana.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  katanaLocationList: KatanaLocation[] = [];
  katanaService: KatanaService = inject(KatanaService);
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor() {
    this.katanaLocationList = this.katanaService.getAllKatanaLocations();
  }

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

    for (const item of this.katanaLocationList) {
      let marker = new Marker({ color: "#FF0011" })
        .setLngLat([item.lng, item.lat])
        .addTo(this.map)
        .setPopup(new Popup()
          .setMaxWidth("500px")
          .setHTML(`
          <div align="left">
          <img src="${item.photo}" width="450px" alt="Photo of ${item.name}" />
          <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
          <h4>${item.city}</h4>
          <p>
          ${item.notes}
          </p>
          </div>
        `)
        );
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

}
