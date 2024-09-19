export interface City {
  name: string;
  lat: string;
  lon: string;
  districts: District[];
}

export interface District {
  name: string;
  lat: string;
  lon: string;
}

export interface LocationData {
  [key: string]: string[]; // Anahtarlar il adları, değerler ise ilçe adlarının dizisi
}
