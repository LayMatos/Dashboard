declare module 'leaflet' {
  export type LatLngExpression = [number, number];
  export class Icon {
    constructor(options: any);
  }
  export class Layer {
    bindTooltip(content: string, options?: any): this;
    setStyle(style: any): this;
    on(eventMap: any): this;
  }
}

declare module 'react-leaflet' {
  import { FC } from 'react';
  import { LatLngExpression, Icon, Layer } from 'leaflet';

  interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  interface MarkerProps {
    position: LatLngExpression;
    icon?: Icon;
    children?: React.ReactNode;
  }

  interface TooltipProps {
    direction?: string;
    offset?: [number, number];
    opacity?: number;
    permanent?: boolean;
    children: React.ReactNode;
  }

  interface GeoJSONProps {
    data: any;
    style?: (feature: any) => any;
    onEachFeature?: (feature: any, layer: Layer) => void;
  }

  export const MapContainer: FC<MapContainerProps>;
  export const TileLayer: FC<{ url: string }>;
  export const Marker: FC<MarkerProps>;
  export const Popup: FC<{ children: React.ReactNode }>;
  export const Tooltip: FC<TooltipProps>;
  export const GeoJSON: FC<GeoJSONProps>;
} 