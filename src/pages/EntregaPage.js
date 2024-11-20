// App.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';
import MapComponent from '../components/MapaReal'; // Importe corretamente o MapComponent
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados para gráficos
const dataEntrega = [
  { name: 'Cautelados', value: 50 },
  { name: 'Entregues', value: 50 },
];

const dataCidadeEquipamentos = [
  { cidade: 'Cidade A', entregues: 30, cautelados: 10 },
  { cidade: 'Cidade B', entregues: 50, cautelados: 20 },
  { cidade: 'Cidade C', entregues: 40, cautelados: 30 },
  { cidade: 'Cidade D', entregues: 20, cautelados: 15 },
  { cidade: 'Cidade E', entregues: 35, cautelados: 25 },
];

// Dados para a legenda do mapa
const legendaMapa = [
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

const App = () => {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);

  const [activeButton, setActiveButton] = useState("estoque");

  const handleGroupClick = (municipioNome) => {
    const municipio = dataCidadeEquipamentos.find(item => item.cidade === municipioNome);
    if (municipio) {
      setCidadeSelecionada(municipio);
    }
  };

  const cidadeDataEquipamentos = cidadeSelecionada
    ? [{ cidade: cidadeSelecionada.cidade, entregues: cidadeSelecionada.entregues, cautelados: cidadeSelecionada.cautelados }]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#E3EEFF]">
      <main className="flex-grow p-4 flex">
        {/* Legenda no lado esquerdo */}
        <div className="w-[150px] h-[500px] flex-shrink-0 bg-white p-4 shadow-md rounded-lg overflow-auto mt-10">
  <h3 className="font-bold text-lg mb-4 text-center">Legenda</h3>
  <ul className="space-y-1">
    {legendaMapa.map((item, index) => (
      <li key={index} className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
</div>


        {/* Mapa de Mato Grosso */}
        <div className="flex-1 flex flex-col items-center">
        <div className="flex justify-center p-4 absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
            <Link to="/estoque">
              <button
                onClick={() => setActiveButton("estoque")}
                className={`flex justify-center items-center p-3 rounded-full transition duration-300 ease-in-out 
                ${activeButton === "estoque" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
              >
                <FaBox size={24} /> {/* Ícone para o botão estoque */}
              </button>
            </Link>
          </div>
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl font-bold">Distribuição por CR</h1>
          </div>
          <div className="w-full h-full relative">
            <div className="h-[80vh] mx-auto w-[90%]">
              <MapComponent onHover={(municipioNome) => console.log(`Hovered: ${municipioNome}`)} onClick={handleGroupClick} />
            </div>
          </div>
        </div>

        {/* Cards na lateral direita */}
        <div className="w-[370px] flex-shrink-0 space-y-6 ml-4">
          {/* Card 1: Gráfico Biscoito Entrega */}
          <div className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
  <div className="w-full flex items-center justify-between">
    <h3 className="font-bold text-lg mb-4 text-center">Equipamentos</h3>
    <select
      className="bg-gray-100 border border-gray-300 rounded-md p-2 text-sm"
      onChange={(e) => console.log(e.target.value)} // Substitua pelo seu handler de filtro
    >
      <option value="">Todos</option>
      <option value="filtro1">Filtro 1</option>
      <option value="filtro2">Filtro 2</option>
      <option value="filtro3">Filtro 3</option>
    </select>
  </div>
  <PieChart width={250} height={250}>
    <Pie
      data={dataEntrega}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
    >
      {dataEntrega.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={['#00C49F', '#FF8042'][index]} />
      ))}
    </Pie>
    <Legend verticalAlign="top" align="center" layout="horizontal" />
  </PieChart>
</div>

          {/* Card 2: Gráfico Cascata Equipamentos Entregues */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-center">Cautelados/Entregues</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cidadeDataEquipamentos.length ? cidadeDataEquipamentos : dataCidadeEquipamentos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cidade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entregues" fill="#8884d8" />
                <Bar dataKey="cautelados" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>


      <div className="w-full mt-6 p-4 mb-10">
        <h3 className="font-bold text-xl mb-4 text-center">Equipamentos Entregues e Cautelados por Cidade</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataCidadeEquipamentos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cidade" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="entregues" fill="#8884d8" />
            <Bar dataKey="cautelados" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default App;
