import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import MapComponent from '../../components/MapaReal';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import gruposDeMunicipios from '../../data/grupodeMunicipios';
import { useSGPMData } from '../../hooks/SGPM/useSGPMData';
import { calcularTotaisPorCR, sexoMapeado } from '../../utils/SGPM/helpers';
import { normalizarNomeCidade } from '../../utils/stringUtils';
import { CidadeSGPM, DadosSexo } from '../../models/SGPM/types';
import { Select } from '../../components/SGPM/Select';

const SgpmDistribuicaoPage: React.FC = () => {
  const {
    sexos,
    dadosEfetivo,
    dadosPorUnidade,
    fetchSexoPorCidade,
    fetchSexoPorUnidade,
    setSexos
  } = useSGPMData();

  const [selectedCR, setSelectedCR] = useState<string[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>('');
  const [totaisPorCR, setTotaisPorCR] = useState<Record<string, number>>({});

  const cidadeSGPM: CidadeSGPM[] = [
    { nome: "Cuiabá", coords: [-15.58032761, -56.10002738], cr: "CR_1" },
    { nome: "Várzea Grande", coords: [-15.64960094, -56.1270202], cr: "CR_2" },
    { nome: "Sinop", coords: [-11.83064411, -55.48828082], cr: "CR_3" },
    { nome: "Rondonópolis", coords: [-16.4523128, -54.66520901], cr: "CR_4" },
    { nome: "Barra do Garças", coords: [-15.8949207, -52.27421683], cr: "CR_5" },
    { nome: "Cáceres", coords: [-16.06936305, -57.68005274], cr: "CR_6" },
    { nome: "Tangará da Serra", coords: [-14.6151244, -57.49472739], cr: "CR_7" },
    { nome: "Juína", coords: [-11.42067803, -58.75919459], cr: "CR_8" },
    { nome: "Alta Floresta", coords: [-9.901346752, -56.08694114], cr: "CR_9" },
    { nome: "Vila Rica", coords: [-10.01320481, -51.11707668], cr: "CR_10" },
    { nome: "Primavera do Leste", coords: [-15.55333273, -54.29778236], cr: "CR_11" },
    { nome: "Pontes e Lacerda", coords: [-15.23517592, -59.32436331], cr: "CR_12" },
    { nome: "Água Boa", coords: [-14.05281745, -52.15451657], cr: "CR_13" },
    { nome: "Nova Mutum", coords: [-13.81868891, -56.09842267], cr: "CR_14" },
    { nome: "Guarantã do Norte", coords: [-9.9473333, -54.9100833], cr: "CR_15" },
  ];

  const handleGroupClick = async (crSelecionado: string[]) => {
    try {
      const cidadesSelecionadas = Array.isArray(crSelecionado) ? crSelecionado : [];
      
      const crCorrespondente = Object.keys(gruposDeMunicipios).find(cr => {
        return cidadesSelecionadas.some(cidade => 
          gruposDeMunicipios[cr as keyof typeof gruposDeMunicipios]?.includes(cidade)
        );
      });

      if (!crCorrespondente) {
        // CR correspondente não encontrado
        return;
      }

      const cidadesDoCR = gruposDeMunicipios[crCorrespondente as keyof typeof gruposDeMunicipios] || [];
              // CR selecionado

      if (cidadesDoCR.length === 0) {
                  // Nenhuma cidade encontrada para o CR selecionado
        return;
      }

              // Cidades do CR
      const cidadesMaiusculas = cidadesDoCR.map(cidade => cidade.toUpperCase());
      setSelectedCR(cidadesMaiusculas);

      try {
        const dadosSexo = await fetchSexoPorCidade(cidadesMaiusculas);

        if (!Array.isArray(dadosSexo)) {
          console.error('Dados recebidos não são um array:', dadosSexo);
          return;
        }

        const dadosCompletos: DadosSexo[] = cidadesMaiusculas.map(cidade => {
          const cidadeNormalizada = normalizarNomeCidade(cidade);
          
          const dadoExistente = dadosSexo.find(dado => {
            if (!dado.nome_cidade) return false;
            
            const dadoCidadeNormalizada = normalizarNomeCidade(dado.nome_cidade);
            
            return dadoCidadeNormalizada === cidadeNormalizada;
          });
          
          if (dadoExistente) {
            return {
              nome_cidade: dadoExistente.nome_cidade,
              qtd_sexoF: dadoExistente.qtd_sexoF || 0,
              qtd_sexoM: dadoExistente.qtd_sexoM || 0,
              sexo: 'TOTAL',
              quantidade: (dadoExistente.qtd_sexoF || 0) + (dadoExistente.qtd_sexoM || 0)
            };
          } else {
            return {
              nome_cidade: cidade,
              qtd_sexoF: 0,
              qtd_sexoM: 0,
              sexo: 'TOTAL',
              quantidade: 0
            };
          }
        });

        setSexos(dadosCompletos);
      } catch (error: any) {
        console.error('Erro ao buscar dados das cidades:', error);
        if (error.response) {
          console.error('Resposta do servidor:', error.response.data);
          console.error('Status do erro:', error.response.status);
        }
      }
    } catch (error) {
      console.error('Erro no handleGroupClick:', error);
    }
  };

  React.useEffect(() => {
    if (dadosEfetivo) {
      const totais = calcularTotaisPorCR(dadosEfetivo);
      setTotaisPorCR(totais);
    }
  }, [dadosEfetivo]);

  React.useEffect(() => {
    if (!cidadeSelecionada) return;
    fetchSexoPorUnidade(cidadeSelecionada);
  }, [cidadeSelecionada]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header com título e botão de volta */}
      <div className="relative">
  {/* Botão centralizado */}
  <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-10">
    <a href="/sgpm">
      <button
        className="
          flex justify-center items-center p-4 rounded-full
          transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl hover:scale-105
          bg-gradient-to-r from-blue-500 to-indigo-600 text-white
          hover:from-blue-600 hover:to-indigo-700
        "
        title="Voltar para Gestão do Efetivo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 
          0-2.5-1.12-2.5-2.5s1.12-2.5 
          2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      </button>
    </a>
  </div>

  {/* Conteúdo centralizado */}
  <div className="text-center pt-10 pb-6">
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
      Gestão do Efetivo
    </h1>
    <p className="text-gray-600 text-sm md:text-base mt-2">
      Comandos Regionais
    </p>
  </div>
</div>


      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção do Mapa e Gráfico */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Mapa */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Distribuição Geográfica
              </h2>
              <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                {Object.keys(totaisPorCR).length} CRs
              </div>
            </div>
            <div className="h-[500px] rounded-xl overflow-hidden">
              <MapComponent
                cidades={cidadeSGPM.map((cidade) => cidade.nome)}
                onGroupChange={handleGroupClick}
              />
            </div>
          </div>
          
          {/* Gráfico Feminino X Masculino */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Feminino X Masculino por Cidade
              </h2>
              <div className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
                {sexos.length} cidades
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Feminino</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Masculino</span>
                  </div>
                </div>
              </div>
              
              <div className="relative" style={{ height: Math.max(400, sexos.length * 40) }}>
                {sexos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sexos}
                      margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
                      <XAxis
                        type="number"
                        tick={{
                          fill: '#6B7280',
                          fontSize: 11,
                          fontWeight: 500
                        }}
                      />
                      <YAxis
                        dataKey="nome_cidade"
                        type="category"
                        tick={{
                          fill: '#374151',
                          fontSize: 12,
                          fontWeight: 600
                        }}
                        width={140}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                        formatter={(value, name) => [`${value} policiais`, name === 'qtd_sexoF' ? 'Feminino' : 'Masculino']}
                        labelStyle={{
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          color: '#374151'
                        }}
                      />
                      <Legend display="none" />
                      <Bar
                        dataKey="qtd_sexoF"
                        name="Feminino"
                        fill="#8B5CF6"
                        radius={[6, 6, 6, 6]}
                        label={{
                          position: 'right',
                          fill: '#6B7280',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      />
                      <Bar
                        dataKey="qtd_sexoM"
                        name="Masculino"
                        fill="#10B981"
                        radius={[6, 6, 6, 6]}
                        label={{
                          position: 'right',
                          fill: '#6B7280',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-400">Selecione um CR no mapa</p>
                    <p className="text-sm text-gray-400">Clique em uma região do mapa para ver os dados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Cidade */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="text-center mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Selecionar Cidade para Análise Detalhada
            </h3>
            <p className="text-gray-600 text-sm">
              Escolha uma cidade para visualizar o comparativo por unidade
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <Select
                value={cidadeSelecionada}
                onChange={setCidadeSelecionada}
                options={sexos
                  .filter(item => item.nome_cidade)
                  .map(item => ({
                    value: item.nome_cidade!,
                    label: item.nome_cidade!
                  }))}
                placeholder="Selecione uma cidade"
                className="w-96 h-14 text-lg pl-6 pr-12"
              />
            </div>
          </div>
        </div>

        {/* Gráfico por Unidade */}
        {cidadeSelecionada && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Comparativo por Unidade em {cidadeSelecionada}
              </h3>
              <div className="text-sm text-gray-500 bg-indigo-50 px-3 py-1 rounded-full">
                {dadosPorUnidade.length} unidades
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={Math.max(dadosPorUnidade.length * 50, 500)}>
                <BarChart
                  data={dadosPorUnidade}
                  layout="vertical"
                  margin={{ top: 20, bottom: 20, left: 120, right: 30 }}
                  barCategoryGap="20%"
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
                  <XAxis
                    type="number"
                    tick={{
                      fill: '#6B7280',
                      fontSize: 11,
                      fontWeight: 500
                    }}
                  />
                  <YAxis
                    dataKey="unidade"
                    type="category"
                    width={250}
                    tick={{
                      fill: '#374151',
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value} policiais`, name]}
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Bar 
                    dataKey="Feminino" 
                    fill="#8B5CF6" 
                    radius={[6, 6, 6, 6]}
                    name="Feminino"
                  />
                  <Bar 
                    dataKey="Masculino" 
                    fill="#10B981" 
                    radius={[6, 6, 6, 6]}
                    name="Masculino"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SgpmDistribuicaoPage; 