import React from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Package, RefreshCw, AlertCircle, Archive, Box, Map } from "lucide-react";
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartEvent,
  ActiveElement,
  Chart
} from "chart.js";
import { useEstoque } from "../../hooks/useEstoque";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const EstoquePage: React.FC = () => {
  const { 
    activeButton, 
    setActiveButton, 
    barData, 
    doughnutData, 
    isLoading, 
    error, 
    refreshData
  } = useEstoque();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestão do Estoque
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={refreshData}
            className="p-3 rounded-xl bg-white hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            title="Atualizar dados"
            disabled={isLoading}
          >
            <RefreshCw 
              size={24} 
              className={`text-blue-600 transition-all duration-500 ${isLoading ? 'animate-spin' : 'hover:rotate-180'}`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-auto mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 max-w-2xl shadow-md animate-slideIn">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex justify-center p-4 absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <Link to="/">
          <button
            onClick={() => setActiveButton("entrega")}
            className={`
              flex justify-center items-center p-4 rounded-full
              transition-all duration-300 ease-in-out
              shadow-lg hover:shadow-xl hover:scale-105
              ${activeButton === "entrega" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
              }
            `}
            title="Visualizar Entregas"
          >
            <div className="relative group">
              <Map className="w-6 h-6" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ver Entregas
              </span>
            </div>
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Box className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total em Estoque</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {isLoading ? "-" : barData.datasets[0].data.reduce((a, b) => a + b, 0)}
              </h3>
            </div>
          </div>
        </div>
        {/* Adicione mais cards de estatísticas conforme necessário */}
      </div>

      <main className="flex-1 px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gráfico de Barras */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Box className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Quantidade por Equipamento
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-6 h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        top: 25
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        enabled: true
                      },
                      legend: {
                        display: true
                      }
                    },
                    animation: {
                      duration: 1,
                      onComplete: function(animation: any) {
                        const chart = animation.chart as Chart;
                        const ctx = chart.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = 'bold 14px Inter';
                        ctx.fillStyle = '#000';

                        chart.data.datasets.forEach((dataset, i) => {
                          const meta = chart.getDatasetMeta(i);
                          meta.data.forEach((bar: any, index) => {
                            const data = dataset.data[index];
                            if (data !== null && data !== undefined) {
                              ctx.fillText(data.toString(), bar.x, bar.y - 5);
                            }
                          });
                        });
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Gráfico de Rosca */}
          <div className="w-full lg:w-[400px] bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Status do Estoque
                </h3>
              </div>
            </div>
            <div className="p-6 h-[500px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: 20
                    },
                    plugins: {
                      tooltip: {
                        enabled: false
                      },
                      legend: {
                        position: "bottom"
                      }
                    },
                    animation: {
                      duration: 1,
                      onComplete: function(animation: any) {
                        const chart = animation.chart as Chart;
                        const ctx = chart.ctx;
                        
                        ctx.font = 'bold 20px Inter';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        chart.data.datasets.forEach((dataset, i) => {
                          const meta = chart.getDatasetMeta(i);
                          
                          meta.data.forEach((element: any, index) => {
                            const value = dataset.data[index];
                            
                            if (value !== null && value !== undefined) {
                              const angle = element.startAngle + (element.endAngle - element.startAngle) / 2;
                              
                              const radius = element.outerRadius * 0.6;
                              const x = element.x + Math.cos(angle) * radius;
                              const y = element.y + Math.sin(angle) * radius;
                              
                              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                              ctx.shadowBlur = 3;
                              ctx.fillStyle = '#FFFFFF';
                              
                              ctx.fillText(value.toString(), x, y);
                              
                              ctx.shadowColor = 'transparent';
                              ctx.shadowBlur = 0;
                            }
                          });
                        });
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EstoquePage; 