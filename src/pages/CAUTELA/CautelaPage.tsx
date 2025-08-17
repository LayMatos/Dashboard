import React from "react";
import MapComponent from "../../components/MapaReal";
import { IconType } from 'react-icons';
import { FaBox, FaChartPie, FaMapMarkedAlt, FaSync } from 'react-icons/fa';
import { LegendaItem } from '../../types/coneq';
import { CHART_COLORS, LEGEND_ITEMS } from '../../constants/charts';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CardProps {
  titulo: string;
  valor: string | number;
}

const renderIcon = (Icon: IconType, size: number): JSX.Element => {
    return React.createElement(Icon as React.ComponentType<{ size: number }>, { size });
  };

  const renderLegenda = () => (
    <div className="hidden lg:block flex-shrink-0 bg-white p-4 rounded-xl shadow-lg mr-4 border border-gray-100">
  <ul className="grid grid-cols-2 gap-2">
    {LEGEND_ITEMS.map((item: LegendaItem, index: number) => (
      <li
        key={index}
        className="flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200"
      >
        <div
          className="w-3 h-3 mr-2 rounded"
          style={{ backgroundColor: item.color }}
        ></div>
        <span className="text-gray-700 text-sm">{item.label}</span>
      </li>
    ))}
  </ul>
</div>

  );

const VtrDashboard: React.FC = () => {
  // Mock de dados
  const cautelaDia = [
    { tipo: "SUV", quantidade: 12 },
    { tipo: "Motocicleta", quantidade: 8 },
    { tipo: "Caminhonete", quantidade: 5 },
  ];

  const kmData = [
    { periodo: "Dia", km: 1200 },
    { periodo: "Mês", km: 25400 },
    { periodo: "Ano", km: 280000 },
  ];

  const statusData = [
    { status: "Ativo", total: 35 },
    { status: "Manutenção", total: 5 },
    { status: "Inativo", total: 2 },
  ];

  const coresStatus = ["#2563eb", "#facc15", "#ef4444"];

  return (
    <div className="container mx-auto px-4 py-4 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 relative px-4 w-full mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 mb-3 text-center max-w-3xl mx-auto" >
           Gestão de Viaturas
          </h1>
          <p className="text-gray-600 text-base lg:text-lg text-center max-w-2xl mx-auto">Comandos Regionais</p>
        </div>

      {/* Cards principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card titulo="Cautela Ativa" valor="25" />
        <Card titulo="Viaturas Disponíveis" valor="12" />
        <Card titulo="Total de VTR" valor="42" />
        <Card titulo="VTR ativas" valor="38" />
      </section>

      {/* Mapa + gráficos */}
      <section className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Mapa */}
        <div className="w-full lg:w-2/3 h-[725px] bg-white shadow-lg rounded-xl p-4">
          <MapComponent cidades={[]} onGroupChange={() => {}} />
        </div>

        {/* Status da VTR */}
        
        <div className="w-full lg:w-1/3 space-y-8">
        <div className="bg-white shadow-lg rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
        <div className="text-blue-600">
          {renderIcon(FaMapMarkedAlt, 20)}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Comandos Regionais</h3>
      </div>
            {renderLegenda()}
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4">
            <h2 className="text-lg font-bold mb-4">Status da VTR (SISMAF)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="total"
                  nameKey="status"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coresStatus[index % coresStatus.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Km por VTR */}
      <section className="bg-white shadow-lg rounded-xl p-6 mb-12">
        <h2 className="text-lg font-bold mb-6">KM por VTR</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kmData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="km" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Tabela VTR por contrato/marca/modelo */}
      <section className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">
          VTR por Contrato / Marca / Modelo / Comando Regional / Unidade
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Contrato</th>
                <th className="px-4 py-3 text-left">Marca</th>
                <th className="px-4 py-3 text-left">Modelo</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Comando Regional</th>
                <th className="px-4 py-3 text-left">Unidade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">CT-001</td>
                <td className="px-4 py-3">Toyota</td>
                <td className="px-4 py-3">Hilux</td>
                <td className="px-4 py-3">Ativo</td>
              </tr>
              <tr>
                <td className="px-4 py-3">CT-002</td>
                <td className="px-4 py-3">Honda</td>
                <td className="px-4 py-3">XRE 300</td>
                <td className="px-4 py-3">Manutenção</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Componente de Card reutilizável
const Card: React.FC<CardProps> = ({ titulo, valor }) => (
  <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl flex flex-col items-center justify-center shadow-lg text-lg text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-blue-100 p-6">
    <h2 className="font-semibold text-blue-800 mb-2">{titulo}</h2>
    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
      {valor}
    </p>
  </div>
);

export default VtrDashboard;
