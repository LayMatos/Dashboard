import React from 'react';

interface MapComponentProps {
  center?: number[];
  zoom?: number;
  onGroupChange: (cidadesSelecionadas: string[]) => void;
  cidades?: string[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [-56.0, -13.5],
  zoom = 6,
  onGroupChange,
  cidades = []
}) => {
  // Implementação do mapa aqui
  return <div>Mapa Component</div>;
};

export default MapComponent; 