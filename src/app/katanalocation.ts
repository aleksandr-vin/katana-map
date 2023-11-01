export interface KatanaLocation {
  id: number;
  name: string;
  city?: string;
  lat: number;
  lng: number;
  photo?: string;
  notes?: string;
  url: string;
  links?: KatanaLocationLink[]
}

export interface KatanaLocationLink {
  name: string;
  url: string;
}
