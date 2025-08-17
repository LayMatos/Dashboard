import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { Card } from '../../components/SGPM/Card';
import { Select } from '../../components/SGPM/Select';
import { useSGPMData } from '../../hooks/SGPM/useSGPMData';
import { findQuantidadeByTipo, somaInativos, findQuantidadeBySituacao, sexoMapeado } from '../../utils/SGPM/helpers';
import { PostoGraduacaoResponse } from '../../models/SGPM/types';
import { UserIcon } from 'lucide-react';
import { SGPMService } from '../../services/SGPM/sgpmService';

interface PostoGraduacao {
  posto_graduacao: string;
  quantidade: number;
}

const SgpmPage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    comandosRegionais,
    unidades,
    unidadesSubordinadas,
    postosGraduacao,
    selectedSexo,
    setSelectedSexo,
    selectedSituacao,
    setSelectedSituacao,
    selectedTipo,
    setSelectedTipo,
    selectedComandoRegional,
    setSelectedComandoRegional,
    selectedUnidade,
    setSelectedUnidade,
    selectedPostoGrad,
    setSelectedPostoGrad,
    dadosFiltrados,
    loading,
    loadingUnidades,
    handleReset
  } = useSGPMData();

  // Estados para os dados originais
  const [dadosSituacao, setDadosSituacao] = useState<any[]>([]);
  const [dadosTipo, setDadosTipo] = useState<any[]>([]);
  const [dados, setDados] = useState<any[]>([]);
  const [dadosPostoGraduacao, setDadosPostoGraduacao] = useState<PostoGraduacaoResponse>({ feminino: [], masculino: [] });
  const [exibirResultado, setExibirResultado] = useState<boolean>(false);

  // Carregar dados originais
  useEffect(() => {
    const carregarDadosOriginais = async () => {
      try {
        const [sexoRes, situacaoRes, tipoRes, postoGradRes] = await Promise.all([
          SGPMService.getPoliciaisPorSexo(),
          SGPMService.getPoliciaisPorSituacao(),
          SGPMService.getPoliciaisPorTipo(),
          SGPMService.getPoliciaisPorPostoGradSexo()
        ]);

        setDados(sexoRes || []);
        setDadosSituacao(situacaoRes || []);
        setDadosTipo(tipoRes || []);
        setDadosPostoGraduacao(postoGradRes || { feminino: [], masculino: [] });
      } catch (error) {
        console.error('Erro ao carregar dados originais:', error);
      }
    };

    carregarDadosOriginais();
  }, []);

  // Verificar se há filtros selecionados
  useEffect(() => {
    const algumFiltroSelecionado =
      selectedSexo !== '' ||
      selectedSituacao !== '' ||
      selectedTipo !== '' ||
      selectedComandoRegional !== null ||
      selectedUnidade !== null ||
      selectedPostoGrad !== null;

    setExibirResultado(algumFiltroSelecionado);
  }, [selectedSexo, selectedSituacao, selectedTipo, selectedComandoRegional, selectedUnidade, selectedPostoGrad]);

  // Configurar gráfico
  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (!dadosPostoGraduacao || !dadosPostoGraduacao.feminino || !dadosPostoGraduacao.masculino) {
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
          top: 15
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

  const handleResetFiltros = () => {
    handleReset();
    setExibirResultado(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="flex flex-col items-center justify-center mb-8 relative px-4 w-full mt-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 mb-3 text-center max-w-3xl mx-auto">
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

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-5 justify-center">
        <Select
          value={selectedSexo}
          onChange={(value) => setSelectedSexo(value)}
          options={dados.map(item => ({ 
            value: item.sexo, 
            label: sexoMapeado[item.sexo] || item.sexo 
          }))}
          placeholder="Selecione o Sexo"
        />

        <Select
          value={selectedSituacao}
          onChange={(value) => setSelectedSituacao(value)}
          options={dadosSituacao.map(item => ({ 
            value: item.situacao, 
            label: item.situacao 
          }))}
          placeholder="Selecione a Situação"
        />

        <Select
          value={selectedTipo}
          onChange={(value) => setSelectedTipo(value)}
          options={dadosTipo.map(item => ({ 
            value: item.tipo, 
            label: item.tipo 
          }))}
          placeholder="Selecione o Tipo"
        />

        {/* Novos filtros */}
        <Select
          value={selectedComandoRegional?.toString() || ""}
          onChange={(value) => setSelectedComandoRegional(value ? parseInt(value) : null)}
          options={comandosRegionais.map(item => ({ 
            value: item.cod_opm.toString(), 
            label: item.opm 
          }))}
          placeholder="Selecione o Comando Regional"
        />

        <Select
          value={selectedUnidade?.toString() || ""}
          onChange={(value) => setSelectedUnidade(value ? parseInt(value) : null)}
          options={
            selectedComandoRegional && unidadesSubordinadas.length > 0
              ? unidadesSubordinadas.map(item => ({ 
                  value: item.cod_opm.toString(), 
                  label: item.opm 
                }))
              : unidades.map(item => ({ 
                  value: item.cod_opm.toString(), 
                  label: item.opm 
                }))
          }
          placeholder={
            selectedComandoRegional 
              ? loadingUnidades 
                ? "Carregando unidades..." 
                : "Selecione a Unidade Subordinada"
              : "Selecione a Unidade"
          }
          disabled={selectedComandoRegional ? (loadingUnidades || unidadesSubordinadas.length === 0) : false}
        />

        <Select
          value={selectedPostoGrad?.toString() || ""}
          onChange={(value) => setSelectedPostoGrad(value ? parseInt(value) : null)}
          options={postosGraduacao.map(item => ({ 
            value: item.cod_posto_grad.toString(), 
            label: item.posto_grad_abrev ? `${item.posto_grad} (${item.posto_grad_abrev})` : item.posto_grad 
          }))}
          placeholder="Selecione o Posto/Graduação"
        />
      </div>

      {/* Cards e Resultados */}
      <div className="flex flex-wrap justify-center gap-4 m-5">
        {exibirResultado ? (
          <div className="col-span-full w-full bg-blue-50 rounded-xl flex flex-col items-center justify-center shadow-lg text-lg border border-blue-100 p-8">
            <h2 className="font-bold text-2xl text-blue-700 mb-4">Resultado da Busca</h2>
            <p className="text-4xl font-bold text-blue-600 mb-2">{dadosFiltrados?.quantidade || 0}</p>
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
              {selectedComandoRegional && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {comandosRegionais.find(cr => cr.cod_opm === selectedComandoRegional)?.opm || selectedComandoRegional.toString()}
                </span>
              )}
              {selectedUnidade && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {(selectedComandoRegional && unidadesSubordinadas.length > 0
                    ? unidadesSubordinadas.find(un => un.cod_opm === selectedUnidade)
                    : unidades.find(un => un.cod_opm === selectedUnidade)
                  )?.opm || selectedUnidade.toString()}
                </span>
              )}
              {selectedPostoGrad && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {postosGraduacao.find(pg => pg.cod_posto_grad === selectedPostoGrad)?.posto_grad || selectedPostoGrad.toString()}
                </span>
              )}
            </div>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={handleResetFiltros}
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

      {/* Gráfico */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Header do card */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Quantitativo por Posto e Graduação
            </h3>
          </div>
        </div>

        {/* Gráfico */}
        <div className="p-2">
          <div ref={chartRef} className="w-full h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default SgpmPage; 