import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import MapComponent from '../../components/MapaReal';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import gruposDeMunicipios from '../../data/grupodeMunicipios';
import { useSGPMData } from '../../hooks/SGPM/useSGPMData';
import { calcularTotaisPorCR, sexoMapeado } from '../../utils/SGPM/helpers';
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
        console.log("CR correspondente não encontrado.");
        return;
      }

      const cidadesDoCR = gruposDeMunicipios[crCorrespondente as keyof typeof gruposDeMunicipios] || [];
      console.log('CR selecionado:', crCorrespondente);

      if (cidadesDoCR.length === 0) {
        console.log("Nenhuma cidade encontrada para o CR selecionado.");
        return;
      }

      console.log('Cidades do CR:', cidadesDoCR);
      const cidadesMaiusculas = cidadesDoCR.map(cidade => cidade.toUpperCase());
      setSelectedCR(cidadesMaiusculas);

      console.log('Buscando dados para as cidades:', cidadesMaiusculas);
      try {
        const dadosSexo = await fetchSexoPorCidade(cidadesMaiusculas);
        console.log('Dados recebidos:', dadosSexo);

        if (!Array.isArray(dadosSexo)) {
          console.error('Dados recebidos não são um array:', dadosSexo);
          return;
        }

        const dadosCompletos: DadosSexo[] = cidadesMaiusculas.map(cidade => {
          const cidadeNormalizada = cidade
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .toUpperCase()
            .trim();
          
          const dadoExistente = dadosSexo.find(dado => {
            if (!dado.nome_cidade) return false;
            
            const dadoCidadeNormalizada = dado.nome_cidade
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-zA-Z0-9\s]/g, ' ')
              .toUpperCase()
              .trim();
            
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

        console.log('Dados completos processados:', dadosCompletos);
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
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="flex flex-col items-center justify-center mb-8 relative px-4 w-full mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 mb-3 text-center max-w-3xl mx-auto" style={{ lineHeight: "3.5rem" }}
          >
          Distribuição Geográfica do Efetivo
          </h1>
          <p className="text-gray-600 text-base lg:text-lg text-center max-w-2xl mx-auto">Comandos Regionais</p>
        </div>

      {/* Botão de Volta */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-24 z-20">
        <a href="/sgpm">
          <button className="
            flex justify-center items-center p-4 rounded-full
            transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl hover:scale-105
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white
          " title="Voltar para Gestão do Efetivo">
            <div className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z"/>
</svg>

              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Voltar para Gestão do Efetivo
              </span>
            </div>
          </button>
        </a>
      </div>

      <div className="flex w-full gap-12 mb-12">
        <div className="w-1/2 h-[600px] p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Distribuição Geográfica
          </h2>
          <MapComponent
            cidades={cidadeSGPM.map((cidade) => {
              const total = totaisPorCR[cidade.cr];
              const numeroCR = cidade.cr.split("_")[1];
              const infoFormatada = total !== undefined
                ? `${numeroCR} CR: ${total} Policiais`
                : `${numeroCR} CR: Carregando...`;

              return {
                ...cidade,
                info: infoFormatada,
              };
            })}
            onGroupChange={handleGroupClick}
          />
        </div>
        
        <div className="w-1/2 h-[600px] p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Feminino X Masculino por Cidade
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#8B5CF6] rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Feminino</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#10B981] rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Masculino</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Total de cidades: {sexos.length}
              </div>
            </div>
            <div className="relative" style={{ height: Math.max(400, sexos.length * 40) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sexos}
                  margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    tick={{
                      fill: '#4B5563',
                      fontSize: 12
                    }}
                  />
                  <YAxis
                    dataKey="nome_cidade"
                    type="category"
                    tick={{
                      fill: '#4B5563',
                      fontSize: 12
                    }}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [value, name === 'qtd_sexoF' ? 'Feminino' : 'Masculino']}
                    labelStyle={{
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                  />
                  <Legend display="none" />
                  <Bar
                    dataKey="qtd_sexoF"
                    name="Feminino"
                    fill="#8B5CF6"
                    radius={[4, 4, 4, 4]}
                    label={{
                      position: 'right',
                      fill: '#4B5563',
                      fontSize: 11
                    }}
                  />
                  <Bar
                    dataKey="qtd_sexoM"
                    name="Masculino"
                    fill="#10B981"
                    radius={[4, 4, 4, 4]}
                    label={{
                      position: 'right',
                      fill: '#4B5563',
                      fontSize: 11
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {sexos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">Selecione um CR no mapa</p>
                <p className="text-sm">Clique em uma região do mapa para ver os dados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8 mt-10">
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
        />
      </div>

      {cidadeSelecionada && (
        <div className="w-full mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Comparativo por Unidade em {cidadeSelecionada}
          </h3>
          <ResponsiveContainer width="100%" height={Math.max(dadosPorUnidade.length * 50, 500)}>
            <BarChart
              data={dadosPorUnidade}
              layout="vertical"
              margin={{ top: 20, bottom: 20, left: 100, right: 30 }}
              barCategoryGap="20%"
              barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                type="number"
                tick={{
                  fill: '#4B5563',
                  fontSize: 12
                }}
              />
              <YAxis
                dataKey="unidade"
                type="category"
                width={250}
                tick={{
                  fill: '#4B5563',
                  fontSize: 12
                }}
              />
              <Tooltip
                formatter={(value, name) => [`${value} policiais`, name]}
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Bar dataKey="Feminino" fill="#8B5CF6" radius={[4, 4, 4, 4]} />
              <Bar dataKey="Masculino" fill="#10B981" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SgpmDistribuicaoPage; 