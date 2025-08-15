import { useState, useEffect } from 'react';
import { 
  DadosSituacao, 
  DadosTipo, 
  DadosSexo, 
  DadosPorUnidade,
  DadosEfetivo,
  ComandoRegional,   
  Unidade,           
  PostoGraduacao
} from '../types/sgpm';
import { 
  fetchPoliciais, 
  fetchPoliciaisFiltrados, 
  fetchSexoPorCidade,
  fetchTotaisPorCR,
  fetchComandosRegionais,
  fetchUnidades,
  fetchPostosGraduacao
} from '../services/api';
import { GruposDeMunicipios } from '../types/sgpm';

export const useSGPM = (gruposDeMunicipios: GruposDeMunicipios) => {
  const [dadosSituacao, setDadosSituacao] = useState<DadosSituacao[]>([]);
  const [dadosTipo, setDadosTipo] = useState<DadosTipo[]>([]);
  const [dados, setDados] = useState<DadosSexo[]>([]);
  const [sexos, setSexos] = useState<DadosSexo[]>([]);
  const [situacoes, setSituacoes] = useState<DadosSituacao[]>([]);
  const [tipos, setTipos] = useState<DadosTipo[]>([]);
  const [selectedSexo, setSelectedSexo] = useState("");
  const [selectedSituacao, setSelectedSituacao] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [quantidadeFiltrada, setQuantidadeFiltrada] = useState<number | null>(null);
  const [exibirResultado, setExibirResultado] = useState(false);
  const [selectedCR, setSelectedCR] = useState<string[]>([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [dadosEfetivo, setDadosEfetivo] = useState<DadosEfetivo>({});
  const [dadosPorUnidade, setDadosPorUnidade] = useState<DadosPorUnidade[]>([]);
  const [comandosRegionais, setComandosRegionais] = useState<ComandoRegional[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [postosGraduacao, setPostosGraduacao] = useState<PostoGraduacao[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const [
        situacaoData,
        tipoData,
        sexoData,
        comandosRegionaisData,
        unidadesData,
        postosGraduacaoData,
      ] = await Promise.all([
        fetchPoliciais("policiais_situacao"),
        fetchPoliciais("policiais_tipo"),
        fetchPoliciais("policiais_sexo"),
        fetchComandosRegionais(),
        fetchUnidades(),
        fetchPostosGraduacao()
      ]);

      setDadosSituacao(situacaoData);
      setDadosTipo(tipoData);
      setDados(sexoData);
      setSexos(sexoData);
      setSituacoes(situacaoData);
      setTipos(tipoData);
      setComandosRegionais(comandosRegionaisData);
      setUnidades(unidadesData);
      setPostosGraduacao(postosGraduacaoData);
      setDadosCarregados(true);
    };

    carregarDados();
  }, []);

  useEffect(() => {
  const buscarDadosFiltrados = async () => {
    if (!dadosCarregados) return;

    const algumFiltroSelecionado =
      selectedSexo !== "" || selectedSituacao !== "" || selectedTipo !== "";

    if (!algumFiltroSelecionado) {
      setExibirResultado(false);
      return;
    }

    const resultado = await fetchPoliciaisFiltrados(
      selectedSexo,
      selectedSituacao,
      selectedTipo
    );

    if (resultado && typeof resultado.quantidade !== "undefined") {
      setQuantidadeFiltrada(resultado.quantidade);
      setExibirResultado(true);
    } else {
      setQuantidadeFiltrada(null);
      setExibirResultado(false);
    }
  };

  buscarDadosFiltrados();
}, [selectedSexo, selectedSituacao, selectedTipo, dadosCarregados]);


  // Filtros independentes
  const fetchPorComandoRegional = async (comando?: string) => {
    return await fetchPoliciaisFiltrados(undefined, undefined, undefined, comando);
  };

  const fetchPorUnidade = async (unidade?: string) => {
  const data = await fetchPoliciaisFiltrados(undefined, undefined, undefined, undefined, unidade);
  // transforma DadosFiltrados | null para DadosPorUnidade[]
  const resultado: DadosPorUnidade[] = data
    ? [{ unidade: unidade || '', Feminino: 0, Masculino: data.quantidade }]
    : [];
  setDadosPorUnidade(resultado);
  return resultado;
};


  const fetchPorPostoGraduacao = async (posto?: string) => {
    return await fetchPoliciaisFiltrados(undefined, undefined, undefined, undefined, undefined, posto);
  };

  const handleGroupClick = async (cidadesSelecionadas: string[]) => {
    const crCorrespondente = Object.keys(gruposDeMunicipios).find(cr => {
      return cidadesSelecionadas.every(cidade => 
        gruposDeMunicipios[cr].includes(cidade)
      );
    });

    if (!crCorrespondente) {
      console.log("CR correspondente não encontrado.");
      return;
    }

    const cidadesDoCR = gruposDeMunicipios[crCorrespondente] || [];
    if (cidadesDoCR.length === 0) {
      console.log("Nenhuma cidade encontrada para o CR selecionado.");
      return;
    }

    const cidadesMaiusculas = cidadesDoCR.map(cidade => cidade.toUpperCase());
    setSelectedCR(cidadesMaiusculas);

    const dadosSexoPorCidade = await fetchSexoPorCidade(cidadesMaiusculas);
    setDadosPorUnidade(dadosSexoPorCidade);
  };

  const handleReset = () => {
    setSelectedSexo("");
    setSelectedSituacao("");
    setSelectedTipo("");
    setQuantidadeFiltrada(null);
    setExibirResultado(false);
  };

  return {
    dadosSituacao,
    dadosTipo,
    dados,
    sexos,
    situacoes,
    tipos,
    selectedSexo,
    setSelectedSexo,
    selectedSituacao,
    setSelectedSituacao,
    selectedTipo,
    setSelectedTipo,
    quantidadeFiltrada,
    exibirResultado,
    selectedCR,
    dadosCarregados,
    dadosEfetivo,
    dadosPorUnidade,
    comandosRegionais,
    unidades,
    postosGraduacao,
    handleGroupClick,
    handleReset,
    fetchPorComandoRegional,
    fetchPorUnidade,
    fetchPorPostoGraduacao
  };
}; 