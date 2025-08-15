import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { Card } from '../../components/SGPM/Card';
import { Select } from '../../components/SGPM/Select';
import { useSGPMData } from '../../hooks/SGPM/useSGPMData';
import { findQuantidadeByTipo, somaInativos, findQuantidadeBySituacao, sexoMapeado } from '../../utils/SGPM/helpers';
import { PostoGraduacaoResponse } from '../../models/SGPM/types';

interface PostoGraduacao {
  posto_graduacao: string;
  quantidade: number;
}

const SgpmPage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    dadosSituacao,
    dadosTipo,
    dados,
    sexos,
    situacoes,
    tipos,
    dadosEfetivo,
    dadosPostoGraduacao,
    error
  } = useSGPMData();

  const [selectedSexo, setSelectedSexo] = useState<string>("");
  const [selectedSituacao, setSelectedSituacao] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [quantidadeFiltrada, setQuantidadeFiltrada] = useState<number | null>(null);
  const [exibirResultado, setExibirResultado] = useState<boolean>(false);

  // Add useEffect for filtering
  useEffect(() => {
    const algumFiltroSelecionado = selectedSexo !== "" || selectedSituacao !== "" || selectedTipo !== "";
    
    if (!algumFiltroSelecionado) {
      setExibirResultado(false);
      setQuantidadeFiltrada(null);
      return;
    }

    // Filter the data based on selected options
    let quantidade = 0;
    
    if (selectedSexo) {
      quantidade = dados.reduce((acc, curr) => {
        if (curr.sexo === selectedSexo) {
          if (selectedSituacao) {
            const situacaoMatch = dadosSituacao.find(s => s.situacao === selectedSituacao);
            if (situacaoMatch) {
              return acc + situacaoMatch.quantidade;
            }
          } else if (selectedTipo) {
            const tipoMatch = dadosTipo.find(t => t.tipo === selectedTipo);
            if (tipoMatch) {
              return acc + tipoMatch.quantidade;
            }
          } else {
            return acc + curr.quantidade;
          }
        }
        return acc;
      }, 0);
    } else if (selectedSituacao) {
      const situacaoMatch = dadosSituacao.find(s => s.situacao === selectedSituacao);
      if (situacaoMatch) {
        quantidade = situacaoMatch.quantidade;
      }
    } else if (selectedTipo) {
      const tipoMatch = dadosTipo.find(t => t.tipo === selectedTipo);
      if (tipoMatch) {
        quantidade = tipoMatch.quantidade;
      }
    }

    setQuantidadeFiltrada(quantidade);
    setExibirResultado(true);
  }, [selectedSexo, selectedSituacao, selectedTipo, dados, dadosSituacao, dadosTipo]);

  const handleReset = () => {
    setExibirResultado(false);
    setQuantidadeFiltrada(null);
    setSelectedSexo("");
    setSelectedSituacao("");
    setSelectedTipo("");
  };

  const postoGraduacoes = [
    'Soldado', 'Cabo', '3º Sargento', '2º Sargento', '1º Sargento', 
    'Sub-Tenente', 'Aspirante', '2º Tenente', '1º Tenente', 
    'Capitão', 'Major', 'Tenente Coronel', 'Coronel'
  ];

  useEffect(() => {
    console.log('Dados do Posto/Graduação:', dadosPostoGraduacao);
    
    if (!chartRef.current) {
      console.log('Elemento do gráfico não encontrado');
      return;
    }

    if (!dadosPostoGraduacao || !dadosPostoGraduacao.feminino || !dadosPostoGraduacao.masculino) {
      console.log('Dados inválidos:', dadosPostoGraduacao);
      return;
    }

    try {
      // Limpar o gráfico anterior se existir
      let chart = echarts.getInstanceByDom(chartRef.current);
      if (chart) {
        chart.dispose();
      }

      // Criar nova instância do gráfico
      chart = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: 'Quantitativo por Posto e Graduação',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params: any) {
            const feminino = params[0].value || 0;
            const masculino = params[1].value || 0;
            const total = feminino + masculino;
            return `${params[0].axisValue}<br/>
                    Feminino: ${feminino}<br/>
                    Masculino: ${masculino}<br/>
                    <strong>Total: ${total}</strong>`;
          }
        },
        legend: {
          data: ['Feminino', 'Masculino'],
          top: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dadosPostoGraduacao.feminino.map(item => item.posto_grad),
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 12
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Quantidade',
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [
          {
            name: 'Feminino',
            type: 'bar',
            data: dadosPostoGraduacao.feminino.map(item => item.quantidade),
            itemStyle: {
              color: '#FF69B4' // Rosa para feminino
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          },
          {
            name: 'Masculino',
            type: 'bar',
            data: dadosPostoGraduacao.masculino.map(item => item.quantidade),
            itemStyle: {
              color: '#4169E1' // Azul para masculino
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          }
        ]
      };

      chart.setOption(option);
      
      const handleResize = () => {
        chart?.resize();
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart?.dispose();
      };
    } catch (error) {
      console.error('Erro ao configurar o gráfico:', error);
    }
  }, [dadosPostoGraduacao]);

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">
      {error}
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="flex flex-col items-center justify-center mb-8 relative px-4 w-full mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 mb-3 text-center max-w-3xl mx-auto" >
            Gestão do Efetivo
          </h1>
          <p className="text-gray-600 text-base lg:text-lg text-center max-w-2xl mx-auto">Comandos Regionais</p>
        </div>

      {/* Botão de Navegação para Distribuição Geográfica */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-24 z-20">
        <a href="/sgpm-distribuicao">
          <button className="
            flex justify-center items-center p-4 rounded-full
            transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl hover:scale-105
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white
          " title="Visualizar Distribuição Geográfica">
            <div className="relative group">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ver Distribuição Geográfica
              </span>
            </div>
          </button>
        </a>
      </div>

      <div className="flex space-x-4 mb-5">
        <Select
          value={selectedSexo}
          onChange={setSelectedSexo}
          options={sexos.map(item => ({ value: item.sexo, label: sexoMapeado[item.sexo] || item.sexo }))}
          placeholder="Selecione o Sexo"
        />

        <Select
          value={selectedSituacao}
          onChange={setSelectedSituacao}
          options={situacoes.map(item => ({ value: item.situacao, label: item.situacao }))}
          placeholder="Selecione a Situação"
        />

        <Select
          value={selectedTipo}
          onChange={setSelectedTipo}
          options={tipos.map(item => ({ value: item.tipo, label: item.tipo }))}
          placeholder="Selecione o Tipo"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 m-5">
        {exibirResultado ? (
          <div className="col-span-full w-full bg-blue-50 rounded-xl flex flex-col items-center justify-center shadow-lg text-lg border border-blue-100 p-8">
            <h2 className="font-bold text-2xl text-blue-700 mb-4">Resultado da Busca</h2>
            <p className="text-4xl font-bold text-blue-600 mb-2">{quantidadeFiltrada}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {selectedSexo && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {sexoMapeado[selectedSexo] || selectedSexo}
                </span>
              )}
              {selectedSituacao && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedSituacao}
                </span>
              )}
              {selectedTipo && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedTipo}
                </span>
              )}
            </div>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={handleReset}
            >
              Redefinir Filtros
            </button>
          </div>
        ) : (
          <>
            <Card titulo="Inativos(as)" valor={somaInativos(dadosTipo)} />
            <Card titulo="Ativos(as)" valor={findQuantidadeByTipo('ATIVA', dadosTipo)} />
            <Card titulo="Feminino" valor={dados.reduce((acc, curr) => curr.sexo === 'F' ? acc + curr.quantidade : acc, 0)} />
            <Card titulo="Masculino" valor={dados.reduce((acc, curr) => curr.sexo === 'M' ? acc + curr.quantidade : acc, 0)} />
            <Card titulo="Reserva à Pedido" valor={findQuantidadeByTipo('RESERVA - A PEDIDO', dadosTipo)} />
            <Card titulo="Férias" valor={findQuantidadeBySituacao('FERIAS', dadosSituacao)} />
            <Card titulo="LTS" valor={findQuantidadeBySituacao('LICENCA PARA TRATAMENTO DE SAUDE', dadosSituacao)} />
            <Card titulo="Licença Prêmio" valor={findQuantidadeBySituacao('LICENCA PREMIO - AFASTAMENTO', dadosSituacao)} />
            <Card titulo="Curso" valor={findQuantidadeBySituacao('CURSO', dadosSituacao)} />
            <Card titulo="Reforma" valor={findQuantidadeByTipo('REFORMA', dadosTipo)} />
            <Card titulo="Falecido" valor={findQuantidadeByTipo('FALECIDO', dadosTipo)} />
          </>
        )}
      </div>

      <div className="w-full mb-8 mt-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-8">
          Quantitativo por Posto e Graduação
        </h2>
        <div ref={chartRef} className="w-full h-[500px]" />
      </div>
    </div>
  );
};

export default SgpmPage; 