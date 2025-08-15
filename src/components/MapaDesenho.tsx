import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import geoJson from '../data/geo-MT.json';
import gruposDeMunicipios from '../data/grupodeMunicipios';
import { MapDesenhoProps } from '../types/map';

interface LegendaItem {
  color: string;
  label: string;
}

interface GruposDeMunicipios {
  CR_1: string[];
  CR_2: string[];
  // ... up to CR_15
}

const MapDesenho: React.FC<MapDesenhoProps> = ({ onHover, onClick = () => {} }) => {
  const [cidadeHover, setCidadeHover] = useState<string | null>(null);

  const getMunicipiosPorCor = (municipioNome: string): string => {
    if (gruposDeMunicipios.CR_1.includes(municipioNome)) return "#B8860B";
    if (gruposDeMunicipios.CR_2.includes(municipioNome)) return "#483D8B";
    if (gruposDeMunicipios.CR_3.includes(municipioNome)) return "#8B0000";
    if (gruposDeMunicipios.CR_4.includes(municipioNome)) return "#BDB76B";
    if (gruposDeMunicipios.CR_5.includes(municipioNome)) return "#6B8E23";
    if (gruposDeMunicipios.CR_6.includes(municipioNome)) return "#000000";
    if (gruposDeMunicipios.CR_7.includes(municipioNome)) return "#808000";
    if (gruposDeMunicipios.CR_8.includes(municipioNome)) return "#CD5C5C";
    if (gruposDeMunicipios.CR_9.includes(municipioNome)) return "#A9A9A9";
    if (gruposDeMunicipios.CR_10.includes(municipioNome)) return "#FF8C00";
    if (gruposDeMunicipios.CR_11.includes(municipioNome)) return "#008B8B";
    if (gruposDeMunicipios.CR_12.includes(municipioNome)) return "#0000FF";
    if (gruposDeMunicipios.CR_13.includes(municipioNome)) return "#DA70D6";
    if (gruposDeMunicipios.CR_14.includes(municipioNome)) return "#8B008B";
    if (gruposDeMunicipios.CR_15.includes(municipioNome)) return "#006400";
    return "#D0D0D0";
  };

  const legendaItems: LegendaItem[] = [
    { color: "#B8860B", label: "CR 1" },
    { color: "#FA8072", label: "CR 2" },
    { color: "#8B0000", label: "CR 3" },
    { color: "#BDB76B", label: "CR 4" },
    { color: "#6B8E23", label: "CR 5" },
    { color: "#000000", label: "CR 6" },
    { color: "#6495ED", label: "CR 7" },
    { color: "#CD5C5C", label: "CR 8" },
    { color: "#7B68EE", label: "CR 9" },
    { color: "#20B2AA", label: "CR 10" },
    { color: "#008B8B", label: "CR 11" },
    { color: "#0000FF", label: "CR 12" },
    { color: "#363636", label: "CR 13" },
    { color: "#8B008B", label: "CR 14" },
    { color: "#006400", label: "CR 15" },
  ];

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2900, center: [-55.0, -12.5] }}
        style={{ width: "100%", height: "calc(100vh - 200px)" }}
      >
        <Geographies geography={geoJson}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const municipioNome = geo.properties.name;
              const cor = getMunicipiosPorCor(municipioNome);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={cor}
                  stroke="#FFF"
                  onMouseEnter={() => {
                    setCidadeHover(municipioNome);
                    if (onHover) onHover(municipioNome);
                  }}
                  onMouseLeave={() => {
                    setCidadeHover(null);
                    if (onHover) onHover(null);
                  }}
                  onClick={() => onClick(municipioNome)}
                  data-tooltip-id="mapa-tooltip"
                  data-tooltip-content={municipioNome}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#696969", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip
        id="mapa-tooltip"
        place="top"
      />

      <div className="bg-white p-4 shadow-lg rounded-md w-3/4 mx-auto mt-4">
        <h4 className="font-bold text-center mb-4">Legenda</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {legendaItems.map((item) => (
            <div className="flex items-center space-x-2" key={item.label}>
              <span
                style={{
                  backgroundColor: item.color,
                  width: 50,
                  height: 20,
                  display: "inline-block",
                }}
              ></span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapDesenho; 