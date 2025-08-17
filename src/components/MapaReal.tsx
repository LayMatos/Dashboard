import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
import { Icon, Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import gruposDeMunicipios from '../data/grupodeMunicipios';
import icone from '../assets/policial-icon.svg';
import geoDataMT from '../data/geo-MT.json';
import { MapComponentProps, GeoFeature, GeoData, GruposDeMunicipios, Cidade } from '../types/map';
import { normalizarString } from '../utils/stringUtils';

const pinIcon = new Icon({
  iconUrl: icone,
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const nomeMunicipiosCorreto: { [key: string]: string } = {
  "Mirassol d'Oeste": "Mirassol do Oeste",
  "Lambari D'Oeste": "Lambari do Oeste",
  "Glória D'Oeste": "Glória Do Oeste",
  "Figueirópolis D'Oeste": "Figueirópolis Do Oeste",
  "Conquista D'Oeste": "Conquista Do Oeste"
};

// Usando a função centralizada de normalização
const normalizeName = normalizarString;

const getMunicipiosPorCor = (municipioNome: string): string => {
  const corrigido = nomeMunicipiosCorreto[municipioNome] || municipioNome;
  const normalizedMunicipioNome = normalizeName(corrigido);
  
  const grupos: Record<keyof GruposDeMunicipios, string> = {
    CR_1: "#B8860B",
    CR_2: "#483D8B",
    CR_3: "#8B0000",
    CR_4: "#BDB76B",
    CR_5: "#00FFFF",
    CR_6: "#8FBC8F",
    CR_7: "#808000",
    CR_8: "#CD5C5C",
    CR_9: "#A9A9A9",
    CR_10: "#FF8C00",
    CR_11: "#008B8B",
    CR_12: "#7B68EE",
    CR_13: "#DA70D6",
    CR_14: "#8B008B",
    CR_15: "#006400"
  };

  for (const [grupo, cor] of Object.entries(grupos)) {
    if (gruposDeMunicipios[grupo as keyof GruposDeMunicipios]?.some(
      (municipio: string) => normalizeName(municipio) === normalizedMunicipioNome
    )) {
      return cor;
    }
  }
  
  return "#D0D0D0";
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  center = [-12.595, -55.746], 
  zoom = 6, 
  onGroupChange, 
  cidades = [] 
}) => {
  const [geoData] = useState<GeoData>(geoDataMT);

  const style = (feature: GeoFeature) => {
    const municipioNome = feature.properties.name;
    const corMunicipio = getMunicipiosPorCor(municipioNome);
    return {
      fillColor: corMunicipio,
      weight: 0.8,
      opacity: 0.5,
      color: 'black',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoFeature, layer: Layer) => {
    let municipioNome = feature.properties.name;
    
    if (nomeMunicipiosCorreto[municipioNome]) {
      municipioNome = nomeMunicipiosCorreto[municipioNome];
    }
    
    const normalizedMunicipioNome = normalizeName(municipioNome);
    
    layer.bindTooltip(municipioNome, {
      permanent: false,
      direction: 'top',
      offset: [0, -10],
      opacity: 1,
      className: 'sms-tooltip',
    });
  
    layer.on({
      click: () => {
        // Verificar se a cidade está em algum grupo
        let grupoEncontrado: string | null = null;
        
        for (const [grupo, municipios] of Object.entries(gruposDeMunicipios)) {
          if (municipios.some((municipio: string) => 
            normalizeName(municipio) === normalizedMunicipioNome
          )) {
            grupoEncontrado = grupo;
            break;
          }
        }
        
        if (grupoEncontrado && onGroupChange) {
          const municipiosDoGrupo = gruposDeMunicipios[grupoEncontrado as keyof GruposDeMunicipios];
          if (municipiosDoGrupo) {
            onGroupChange(municipiosDoGrupo);
          }
        } else if (onGroupChange) {
          // Se não estiver em nenhum grupo, selecionar apenas a cidade
          onGroupChange([municipioNome]);
        }
      }
    });
  };

  // Função para obter o nome da cidade independente do tipo
  const getCidadeNome = (cidade: Cidade | string): string => {
    if (typeof cidade === 'string') {
      return cidade;
    }
    return cidade.nome;
  };

  return (
    <div className="rounded-xl" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center as [number, number]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <GeoJSON
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
        
        {cidades.map((cidade, index) => {
          const cidadeNome = getCidadeNome(cidade);
          
          // Encontrar as coordenadas da cidade no GeoJSON
          const feature = geoData.features.find(f => 
            normalizeName(f.properties.name) === normalizeName(cidadeNome) ||
            normalizeName(nomeMunicipiosCorreto[f.properties.name] || f.properties.name) === normalizeName(cidadeNome)
          );
          
          if (feature && feature.geometry.type === 'Polygon') {
            const coordinates = feature.geometry.coordinates[0];
            const center = coordinates.reduce(
              (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
              [0, 0]
            ).map(coord => coord / coordinates.length);
            
            return (
              <Marker
                key={index}
                position={center as [number, number]}
                icon={pinIcon}
              >
                <Tooltip permanent>
                  {cidadeNome}
                </Tooltip>
              </Marker>
            );
          }
          
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
