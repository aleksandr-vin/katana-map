import { Injectable } from '@angular/core';
import { KatanaLocation } from './katanalocation';

import * as katanaLocationsData from '../assets/katana-locations.json';

export interface Data {
  data: KatanaLocation[]
}

@Injectable({
  providedIn: 'root'
})
export class KatanaService {
  katanaLocationList: KatanaLocation[] | undefined;

  constructor() {
    let x = katanaLocationsData as unknown as Data;
    this.katanaLocationList = x.data;
  }

  getAllKatanaLocations(): KatanaLocation[] {
    return this.katanaLocationList ?? [];
  }
}
