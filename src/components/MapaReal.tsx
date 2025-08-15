import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
import { Icon, Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import gruposDeMunicipios from '../data/grupodeMunicipios';
import icone from '../policial.png';
import geoDataMT from '../data/geo-MT.json';
import { MapComponentProps, GeoFeature, GeoData, GruposDeMunicipios } from '../types/map';

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

const normalizeName = (name: string): string => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

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
        let grupoEncontrado = null;
        Object.keys(gruposDeMunicipios).forEach((grupo) => {
          if (gruposDeMunicipios[grupo as keyof GruposDeMunicipios]?.some(
            (municipio: string) => normalizeName(municipio) === normalizedMunicipioNome
          )) {
            grupoEncontrado = grupo;
          }
        });
  
        if (grupoEncontrado && onGroupChange) {
          const municipios = gruposDeMunicipios[grupoEncontrado as keyof GruposDeMunicipios];
          onGroupChange(municipios);
        }
      },
      mouseover: () => {
        layer.setStyle({
          fillOpacity: 0.7,
        });
      },
      mouseout: () => {
        layer.setStyle(style(feature));
      },
    });
  };

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {cidades.map((cidade, index) => (
        <Marker key={index} position={cidade.coords} icon={pinIcon}>
          <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
            <b>{cidade.nome}</b>
            {cidade.info && (
              <>
                <br />
                {cidade.info}
              </>
            )}
          </Tooltip>
        </Marker>
      ))}

      {geoData && (
        <GeoJSON
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent; 