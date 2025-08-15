import React from 'react';
import MapComponent from '../../components/MapaReal';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CardProps {
  titulo: string;
  valor: string;
}

interface ArmaItem {
  id: number;
  tipo: string;
  calibre: string;
  situacao: string;
  quantidade: number;
}

const SigarfPage: React.FC = () => {
  const armasData: ArmaItem[] = [
    { id: 1, tipo: 'Pistola', calibre: '9mm', situacao: 'Ativo', quantidade: 50 },
    { id: 2, tipo: 'Fuzil', calibre: '5.56mm', situacao: 'Inativo', quantidade: 20 },
    { id: 3, tipo: 'Revólver', calibre: '.38', situacao: 'Ativo', quantidade: 30 },
    { id: 4, tipo: 'Espingarda', calibre: '12', situacao: 'Ativo', quantidade: 10 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gray-800">
        Gestão do Armamento
      </h1>

      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-12 mb-8 lg:mb-12">
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card titulo="Efetivo total ativo" valor="-" />
            <Card titulo="Feminino" valor="-" />
            <Card titulo="Masculino" valor="-" />
            <Card titulo="Qtd. de Armas em Carga Pessoal" valor="-" />
            <Card titulo="Qtd. de Munição em Carga Pessoal" valor="-" />
            <Card titulo="Qtd. de Colete em Carga Pessoal" valor="-" />
            <Card titulo="Qtd. de Armamento Institucional Disponível" valor="-" />
            <Card titulo="Qtd. de Armas Apreendidas" valor="-" />
            <Card titulo="Qtd. de Cautela" valor="-" />
          </div>

          <div className="mt-8 md:mt-12 w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Lista de Armas de Fogo</h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Tipo</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">CR</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">UPM</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Quantidade</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Validade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {armasData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 md:px-6 py-4 text-sm">{item.id}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{item.tipo}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{item.calibre}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{item.situacao}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">{item.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-[600px] p-4">
          <MapComponent cidades={[]} onGroupChange={() => {}} />
        </div>
      </div>

      <div className="w-full mt-8 md:mt-12">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <select className="border border-gray-300 rounded-lg p-2 w-full sm:w-60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
            <option value="">Tipo de Arma (espécie)</option>
          </select>

          <select className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
            <option value="">Calibre</option>
          </select>

          <select className="border border-gray-300 rounded-lg p-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
            <option value="">Colete</option>
          </select>
        </div>
      </div>

      <div className="mt-8 md:mt-12 w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Tabela</h2>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Tipo</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Calibre</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Situação</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium">Quantidade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {armasData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 md:px-6 py-4 text-sm">{item.id}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{item.tipo}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{item.calibre}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{item.situacao}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{item.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({ titulo, valor }) => (
  <div className="relative w-64 h-36 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex flex-col items-center justify-center shadow-lg text-lg text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-blue-100 overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-75"></div>
    <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <h2 className="font-semibold text-blue-800 mb-2 relative z-10">{titulo}</h2>
    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent relative z-10">{valor}</p>
  </div>
);

export default SigarfPage; 