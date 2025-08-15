declare module 'react-tooltip' {
  import { FC } from 'react';

  interface TooltipProps {
    place?: 'top' | 'right' | 'bottom' | 'left';
    effect?: 'solid' | 'float';
    getContent?: () => string | null;
    className?: string;
    id?: string;
  }

  export const Tooltip: FC<TooltipProps>;
} 