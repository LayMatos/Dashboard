import { LatLngExpression } from 'leaflet';

export interface Cidade {
  nome: string;
  coords: LatLngExpression;
  info?: string;
}

export interface GeoProperties {
  name: string;
  [key: string]: any;
}

export interface GeoFeature {
  type: string;
  properties: GeoProperties;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface GeoData {
  type: string;
  features: GeoFeature[];
}

export interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  onGroupChange?: (municipios: string[]) => void;
  cidades?: (Cidade | string)[];
}

export interface MapDesenhoProps {
  onHover?: (municipio: string | null) => void;
  onClick?: (municipio: string) => void;
}

export interface GruposDeMunicipios {
  [cr: string]: string[];
} 