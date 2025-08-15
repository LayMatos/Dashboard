import { useState, useEffect } from "react";
import {
  DadosSituacao,
  DadosTipo,
  DadosSexo,
  DadosPorUnidade,
  DadosEfetivo,
  ComandoRegional,
  Unidade,
  PostoGraduacao,
  DadosFiltrados
} from "../../types/sgpm";
import {
  fetchPoliciais,
  fetchPoliciaisFiltrados,
  fetchSexoPorCidade,
  fetchTotaisPorCR,
  fetchComandosRegionais,
  fetchUnidades,
  fetchPostosGraduacao
} from "../../services/api";

export const useSGPMData = () => {
  // --- Estados para opções dos selects ---
  const [sexos, setSexos] = useState<DadosSexo[]>([]);
  const [situacoes, setSituacoes] = useState<DadosSituacao[]>([]);
  const [tipos, setTipos] = useState<DadosTipo[]>([]);
  const [comandosRegionais, setComandosRegionais] = useState<ComandoRegional[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [postosGraduacao, setPostosGraduacao] = useState<PostoGraduacao[]>([]);

  // --- Estados para filtros selecionados ---
  const [selectedSexo, setSelectedSexo] = useState<string>("");
  const [selectedSituacao, setSelectedSituacao] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [selectedComando, setSelectedComando] = useState<string>("");
  const [selectedUnidade, setSelectedUnidade] = useState<string>("");
  const [selectedPosto, setSelectedPosto] = useState<string>("");

  // --- Estados de resultados ---
  const [quantidadeFiltrada, setQuantidadeFiltrada] = useState<number | null>(null);
  const [dadosPorUnidade, setDadosPorUnidade] = useState<DadosPorUnidade[]>([]);
  const [dadosEfetivo, setDadosEfetivo] = useState<DadosEfetivo>({});
  const [exibirResultado, setExibirResultado] = useState(false);

  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Carrega todas as opções na inicialização ---
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const [
          sexosData,
          situacoesData,
          tiposData,
          comandosData,
          unidadesData,
          postosData,
          efetivoData
        ] = await Promise.all([
          fetchPoliciais("policiais_sexo"),
          fetchPoliciais("policiais_situacao"),
          fetchPoliciais("policiais_tipo"),
          fetchComandosRegionais(),
          fetchUnidades(),
          fetchPostosGraduacao(),
          fetchTotaisPorCR()
        ]);

        setSexos(sexosData);
        setSituacoes(situacoesData);
        setTipos(tiposData);
        setComandosRegionais(comandosData);
        setUnidades(unidadesData);
        setPostosGraduacao(postosData);
        setDadosEfetivo(efetivoData);

        setDadosCarregados(true);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados");
      }
    };

    carregarOpcoes();
  }, []);

  // --- Filtragem de acordo com os selects ---
  useEffect(() => {
    const buscarDadosFiltrados = async () => {
      if (!dadosCarregados) return;

      const algumFiltroSelecionado =
        selectedSexo !== "" ||
        selectedSituacao !== "" ||
        selectedTipo !== "" ||
        selectedComando !== "" ||
        selectedUnidade !== "" ||
        selectedPosto !== "";

      if (!algumFiltroSelecionado) {
        setExibirResultado(false);
        setQuantidadeFiltrada(null);
        return;
      }

      const resultado: DadosFiltrados | null = await fetchPoliciaisFiltrados(
        selectedSexo,
        selectedSituacao,
        selectedTipo,
        selectedComando,
        selectedUnidade,
        selectedPosto
      );

      if (resultado && typeof resultado.quantidade === "number") {
        setQuantidadeFiltrada(resultado.quantidade);
        setExibirResultado(true);
      } else {
        setQuantidadeFiltrada(null);
        setExibirResultado(false);
      }
    };

    buscarDadosFiltrados();
  }, [
    selectedSexo,
    selectedSituacao,
    selectedTipo,
    selectedComando,
    selectedUnidade,
    selectedPosto,
    dadosCarregados
  ]);

  // --- Filtros independentes para usos específicos ---
  const fetchSexoPorCidadeHandler = async (cidades: string[]) => {
    const data = await fetchSexoPorCidade(cidades);
    setDadosPorUnidade(data);
    return data;
  };

  const handleReset = () => {
    setSelectedSexo("");
    setSelectedSituacao("");
    setSelectedTipo("");
    setSelectedComando("");
    setSelectedUnidade("");
    setSelectedPosto("");
    setQuantidadeFiltrada(null);
    setExibirResultado(false);
  };

  return {
    // opções dos selects
    sexos,
    situacoes,
    tipos,
    comandosRegionais,
    unidades,
    postosGraduacao,

    // filtros selecionados
    selectedSexo,
    setSelectedSexo,
    selectedSituacao,
    setSelectedSituacao,
    selectedTipo,
    setSelectedTipo,
    selectedComando,
    setSelectedComando,
    selectedUnidade,
    setSelectedUnidade,
    selectedPosto,
    setSelectedPosto,

    // resultados
    quantidadeFiltrada,
    exibirResultado,
    dadosPorUnidade,
    dadosEfetivo,

    // helpers
    fetchSexoPorCidadeHandler,
    handleReset,
    dadosCarregados,
    error
  };
};
