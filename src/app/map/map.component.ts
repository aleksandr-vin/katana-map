import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Map, MapStyle, Marker, Popup, config } from '@maptiler/sdk';

import { environment } from './../../environments/environment';
import { KatanaLocation } from '../katanalocation';
import { KatanaService } from '../katana.service';

declare let gtag: Function;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  katanaLocationList: KatanaLocation[] = [];
  katanaService: KatanaService = inject(KatanaService);
  map: Map | undefined;
  selectedKatanaLocationId?: number;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;

  locationZoom = 12;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    private router: Router
  ) {
    this.katanaLocationList = this.katanaService.getAllKatanaLocations();
  }

  ngOnInit(): void {
    config.apiKey = environment.maptilerApiKey;
    this.loadStateFromFragment();
  }

  ngAfterViewInit() {
    let initialState = { lat: this.initialLat ?? 24.577528, lng: this.initialLng ?? 133.8223832, zoom: this.initialZoom ?? 2 };
    if (this.selectedKatanaLocationId) {
      const i = this.getKatanaLocationById(this.selectedKatanaLocationId);
      if (i) {
        initialState = { lat: i.lat, lng: i.lng, zoom: this.locationZoom };
      }
    }

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.on('moveend', () => {
      this.persistInUrl({});
    });

    for (const item of this.katanaLocationList) {
      let linksSection = (item.links ?? []).map((link) => `
        <button aria-label="Link-${link.name}" onclick="
          gtag('event', 'item-link-click', {
            'event_category': 'Map',
            'event_label': 'Open Item Link',
            'link_url': '${link.url}',
            'location_id': '${item.id}'
          });
          window.open('${link.url}', '_blank');
        ">
          ${link.name}
        </button>
      `).join();
      let link = `${location.href}#${item.id}`
      let googleMapLink = `https://www.google.com/maps/@${item.lat},${item.lng},20z`
      let mapsLink = `maps://maps.google.com/?q=${item.lat},${item.lng}`
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
                <button aria-label="Share" onclick="
                  gtag('event', 'share', {
                    'event_category': 'Popup',
                    'event_label': 'Share',
                    'value': '${link}',
                    'location_id': '${item.id}'
                  });
                  navigator.share({ url: '${link}', title: '${item.name} on Katana Map', text: '${item.name} on Katana Map --- map of places, where you can see katana swords' });
                ">
                  share
                </button>
                <button aria-label="google-maps-link-${item.name}" onclick="
                  gtag('event', 'google-maps-click', {
                    'event_category': 'Map',
                    'event_label': 'Open Google Maps Link',
                    'link_url': '${googleMapLink}',
                    'location_id': '${item.id}'
                  });
                  window.open('${googleMapLink}', '_blank');
                ">
                  google maps
                </button>
                <button aria-label="maps-link-${item.name}" onclick="
                  gtag('event', 'maps-click', {
                    'event_category': 'Map',
                    'event_label': 'Open Maps Link',
                    'link_url': '${mapsLink}',
                    'location_id': '${item.id}'
                  });
                  window.open('${mapsLink}');
                ">
                  open in maps
                </button>
              </h3>
              <h4>
                ${item.city}
              </h4>
              <p>
                ${item.notes}
              </p>
              <p>
                ${linksSection}
              </p>
            </div>
          `)
          .on('open', () => {
            if (this.map!.getZoom() < this.locationZoom) {
              this.map!.flyTo({
                center: [item.lng, item.lat],
                zoom: this.locationZoom,
                duration: 2000,
                essential: true
              });
            }

            this.persistInUrl({ id: item.id });

            gtag('event', 'open-popup', {
              'event_category': 'Map',
              'event_label': 'Open Popup',
              'value': location.href,
              'location_id': `${item.id}`
            });
          })
          .on('close', () => {
            this.persistInUrl({ id: null });
          })
        );
      if (this.selectedKatanaLocationId == item.id) {
        marker.togglePopup();
      }
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  getKatanaLocationById(id: number): KatanaLocation | undefined {
    return this.katanaLocationList.find(x => x.id === id);
  }

  loadStateFromFragment() {
    let fragment = location.href.replace(/^.*[#]/, '');
    if (fragment.length > 0) {
      let [l, r] = fragment.split('@');
      try {
        this.selectedKatanaLocationId = parseInt(l);
        if (isNaN(this.selectedKatanaLocationId)) {
          this.selectedKatanaLocationId = undefined;
        }
      } catch (e) {
        console.warn('location id parsing failed:', e);
      }
      try {
        if (r.endsWith('z')) {
          let xs = r.split(',');
          let [lat, lng, zoom] = [xs[0], xs[1], xs[2].slice(0, -1)].map(s => {
            const n = parseFloat(s);
            if (isNaN(n)) {
              return undefined;
            }
            return n;
          });
          this.initialLat = lat;
          this.initialLng = lng;
          this.initialZoom = zoom;
        }
      } catch (e) {
        console.warn('map settings parsing failed:', e);
      }
    }
  }

  persistInUrl = (props: {
    id?: number | null
  }) => {
    if (props.id === null) {
      this.selectedKatanaLocationId = undefined;
    } else if (props.id !== undefined) {
      this.selectedKatanaLocationId = props.id;
    }

    const center = this.map!.getCenter();
    const zoom = this.map!.getZoom();
    const mapPart = `${center.lat.toFixed(7)},${center.lng.toFixed(7)},${zoom.toFixed(1)}z`;

    if (this.selectedKatanaLocationId === undefined || this.selectedKatanaLocationId === null) {
      this.router.navigate([], { fragment: `@${mapPart}` });
    } else {
      this.router.navigate([], { fragment: `${this.selectedKatanaLocationId!}@${mapPart}` });
    }
  }
}
