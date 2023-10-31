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
  initialKatanaLocationId: number | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor() {
    this.katanaLocationList = this.katanaService.getAllKatanaLocations();
  }

  ngOnInit(): void {
    config.apiKey = environment.maptilerApiKey;
    this.loadStateFromFragment();
  }

  ngAfterViewInit() {
    let initialState = { lat: 24.577528, lng: 133.8223832, zoom: 2 };
    if (this.initialKatanaLocationId) {
      const i = this.getKatanaLocationById(this.initialKatanaLocationId);
      if (i) {
        initialState = { lat: i.lat, lng: i.lng, zoom: 16 };
      }
    }

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    for (const item of this.katanaLocationList) {
      let link = `${location.href}#${item.id}`
      let marker = new Marker({ color: "#FF0011" })
        .setLngLat([item.lng, item.lat])
        .addTo(this.map)
        .setPopup(new Popup()
          .setMaxWidth("500px")
          .setHTML(`
            <div align="left">
            <img src="${item.photo}" width="450px" alt="Photo of ${item.name}" />
            <h3>
              <a href="${item.url}" target="_blank">${item.name}</a>
            </h3>
            <h4>${item.city}</h4>
            <p>
            ${item.notes}
            </p>
            <button aria-label="Share" onclick="navigator.share({ url: '${link}' });">
              share
            </button>
            </div>
          `)
        );
      if (this.initialKatanaLocationId == item.id) {
        marker.togglePopup();
      }
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  loadStateFromFragment() {
    let fragment = location.href.replace(/^.*[#]/, '');
    if (fragment.length > 0) {
      console.log('Loading state from fragment', fragment);
      try {
        this.initialKatanaLocationId = parseInt(fragment);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  getKatanaLocationById(id: number): KatanaLocation | undefined {
    return this.katanaLocationList.find(x => x.id === id);
  }
}
