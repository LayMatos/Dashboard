declare module 'react-simple-maps' {
  import { FC } from 'react';

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  interface GeographyProps {
    key: string;
    geography: any;
    fill?: string;
    stroke?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    style?: {
      default?: any;
      hover?: any;
      pressed?: any;
    };
    'data-tip'?: string;
  }

  interface GeographiesProps {
    geography: any;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
} 