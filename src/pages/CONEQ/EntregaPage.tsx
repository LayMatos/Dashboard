import React from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { IconType } from 'react-icons';
import { FaBox, FaChartPie, FaMapMarkedAlt, FaSync } from 'react-icons/fa';

import { StatsCard } from '../../components/Cards/StatsCard';
import { PieChartComponent } from '../../components/Charts/PieChartComponent';
import { BarChartComponent } from '../../components/Charts/BarChartComponent';
import MapComponent from '../../components/MapaReal';
import { useCONEQ } from '../../hooks/useCONEQ';
import { LegendaItem } from '../../types/coneq';
import { CHART_COLORS, LEGEND_ITEMS } from '../../constants/charts';
import gruposDeMunicipios from '../../data/grupodeMunicipios';

const EntregaPage: React.FC = () => {
  const {
    equipamentos,
    cautelas,
    tiposEquipamentos,
    selectedTipo,
    cidadeDataEquipamentos,
    activeButton,
    selectedCR,
    setActiveButton,
    handleSelectChange,
    handleGroupClick
  } = useCONEQ(gruposDeMunicipios);

  const handleRefresh = () => {
    window.location.reload();
  };

  const renderIcon = (Icon: IconType, size: number): JSX.Element => {
    return React.createElement(Icon as React.ComponentType<{ size: number }>, { size });
  };

  const renderLegenda = () => (
    <div className="hidden lg:block w-[200px] h-[720px] flex-shrink-0 bg-white p-4 rounded-xl shadow-lg mt-40 mr-4 border border-gray-100">
      <div className="flex items-center space-x-2 mb-3">
        <div className="text-blue-600">
          {renderIcon(FaMapMarkedAlt, 20)}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Comandos Regionais</h3>
      </div>
      <ul className="space-y-1">
        {LEGEND_ITEMS.map((item: LegendaItem, index: number) => (
          <li key={index} className="flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200">
            <div className="w-3 h-3 mr-2 rounded" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-700 text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderMapSection = () => (
    <div className="flex-1 flex flex-col items-center w-full lg:w-auto">
      <div className="absolute left-1/2 transform -translate-x-1/2 top-24 z-20">
        <Link to="/estoque">
          <button
            onClick={() => setActiveButton("estoque")}
            className={`
              flex justify-center items-center p-4 rounded-full
              transition-all duration-300 ease-in-out
              shadow-lg hover:shadow-xl hover:scale-105
              ${activeButton === "estoque" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
              }
            `}
            title="Visualizar Estoque"
          >
            <div className="relative group">
              {renderIcon(FaBox, 24)}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ver Estoque
              </span>
            </div>
          </button>
        </Link>
      </div>

      <div className="w-full relative">
        <button
          onClick={handleRefresh}
          className="absolute top-4 right-4 z-20 flex items-center justify-center p-2 rounded-full
            bg-white/90 backdrop-blur-sm text-blue-600 hover:text-blue-700
            shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
            hover:scale-105 border border-gray-100 hover:border-blue-100
            group"
          title="Atualizar Dados"
          aria-label="Atualizar dados"
        >
          <div className="relative">
            <div className="group-hover:rotate-180 transition-transform duration-500 ease-in-out">
              {renderIcon(FaSync, 20)}
            </div>
            <span className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded 
              opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Atualizar dados
            </span>
          </div>
        </button>

        <div className="flex flex-col items-center justify-center mb-8 relative px-4 w-full mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 mb-3 text-center max-w-3xl mx-auto" >
            Distribuição de Equipamentos
          </h1>
          <p className="text-gray-600 text-base lg:text-lg text-center max-w-2xl mx-auto">Comandos Regionais</p>
        </div>

        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] relative z-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <MapComponent onGroupChange={handleGroupClick} />
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6 mt-6 lg:mt-0 lg:ml-4 px-4 lg:px-0">
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
              {renderIcon(FaChartPie, 20)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Equipamento</h3>
          </div>
          <select
            className="w-full sm:w-40 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 hover:bg-gray-100"
            value={selectedTipo}
            onChange={handleSelectChange}
            aria-label="Selecionar tipo de equipamento"
          >
            <option value="">Todos os Tipos</option>
            {Array.isArray(tiposEquipamentos) && tiposEquipamentos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
            ))}
          </select>
        </div>
        <div className="transform transition-transform duration-300 hover:scale-105 w-full">
          <PieChartComponent
            data={equipamentos}
            colors={['#00C49F', '#FF8042', '#B8860B']}
            width={350}
            height={350}
            title="Status dos Equipamentos"
          />
        </div>
      </div>

      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="transform transition-transform duration-300 hover:scale-105 w-full">
          <PieChartComponent
            data={cautelas}
            colors={CHART_COLORS}
            width={350}
            height={350}
            title="Status das Cautelas"
          />
        </div>
      </div>
    </div>
  );

  const renderDistributionChart = () => (
    <div className="w-full mt-8 mb-10 px-4 lg:px-6">
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="w-full overflow-x-auto">
          <BarChartComponent
            data={cidadeDataEquipamentos}
            bars={[
              { dataKey: "Entregas", fill: "#2563eb" },
              { dataKey: "Cautelas", fill: "#60a5fa" }
            ]}
            title="Distribuição de Cautelas e Entregas por CR"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 p-4 lg:p-6">
      <main className="flex-grow flex flex-col lg:flex-row my-5">
        {renderLegenda()}
        {renderMapSection()}
        {renderCharts()}
      </main>
      {renderDistributionChart()}
    </div>
  );
};

export default EntregaPage; 