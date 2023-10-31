import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, Marker, Popup, config } from '@maptiler/sdk';

import { environment } from './../../environments/environment';
import { KatanaLocation } from '../katanalocation';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  katanaLocations: KatanaLocation[] | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = environment.maptilerApiKey;

    this.katanaLocations = [
      {
        id: 999,
        name: "Kurashiki Art Sword Museum",
        city: "Tokyo",
        lat: 34.577528,
        lng: 133.8223832,
        photo: "https://www.touken-sato.com/top-01.jpg",
        notes: "Nothing for now",
        url: "https://touken-sato.com"
      }

    ]
  }

  ngAfterViewInit() {
    const initialState = { lat: 34.577528, lng: 133.8223832, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    for (const item of this.katanaLocations ?? []) {
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
