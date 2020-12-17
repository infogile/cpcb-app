interface Factory {
  code: string;
  unit: string;
  state: string;
  district: string;
  ro: string;
  sector: string;
  basin: string;
  agency: string;
  location: string;
  coordinates: number[];
}

export interface Iinspection {
  factory: Factory[];
}
