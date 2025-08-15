import { useState } from "react";
import {
  fetchPoliciaisPorSexo,
  fetchPoliciaisPorSituacao,
  fetchPoliciaisPorTipo,
  fetchPoliciaisPorPostoGradSexo,
  fetchPoliciaisFiltradosAvancado,
  fetchComandosRegionais,
  fetchUnidadesPorComando,
  fetchPostosGraduacoes,
  fetchPoliciaisPorCidade
} from "../services/api";

import {
  DadosPorUnidade,
  GruposDeMunicipios
} from "../types/sgpm";

export const useSGPM = (gruposDeMunicipios: GruposDeMunicipios) => {
  const [selectedSexo, setSelectedSexo] = useState<string | null>(null);
  const [selectedSituacao, setSelectedSituacao] = useState<string | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [quantidadeFiltrada, setQuantidadeFiltrada] = useState<number>(0);

  // --- Dados gerais por categoria ---
  const fetchSexo = async () => await fetchPoliciaisPorSexo();
  const fetchSituacao = async () => await fetchPoliciaisPorSituacao();
  const fetchTipo = async () => await fetchPoliciaisPorTipo();

  // --- Posto/Graduação e Sexo ---
  const fetchPostoGradSexo = async () => {
    return await fetchPoliciaisPorPostoGradSexo(
      selectedSexo || undefined,
      selectedSituacao || undefined,
      selectedTipo || undefined
    );
  };

  // --- Filtro Avançado ---
  const aplicarFiltrosAvancados = async (
    sexo?: string,
    situacao?: string,
    tipo?: string,
    comandoId?: number,
    unidadeId?: number,
    postoGradId?: number
  ) => {
    const resultado = await fetchPoliciaisFiltradosAvancado(
      sexo,
      situacao,
      tipo,
      comandoId,
      unidadeId,
      postoGradId
    );

    if (resultado && typeof resultado.quantidade !== "undefined") {
      setQuantidadeFiltrada(resultado.quantidade);
    }
    return resultado;
  };

  // --- Dropdowns ---
  const fetchComandos = async () => await fetchComandosRegionais();
  const fetchUnidades = async (comandoId?: number) =>
    await fetchUnidadesPorComando(comandoId);
  const fetchPostos = async () => await fetchPostosGraduacoes();

  // --- Filtros independentes ---
  const fetchPorComandoRegional = async (comandoId?: number) => {
    return await fetchPoliciaisFiltradosAvancado(
      undefined,
      undefined,
      undefined,
      comandoId
    );
  };

  const fetchPorUnidade = async (unidadeId?: number) => {
    const data = await fetchPoliciaisFiltradosAvancado(
      undefined,
      undefined,
      undefined,
      undefined,
      unidadeId
    );
    const resultado: DadosPorUnidade[] = data
      ? [
          {
            unidade: unidadeId?.toString() || "",
            Feminino: 0,
            Masculino: data.quantidade
          }
        ]
      : [];
    return resultado;
  };

  const fetchPorPostoGraduacao = async (postoGradId?: number) => {
    return await fetchPoliciaisFiltradosAvancado(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      postoGradId
    );
  };

  // --- Sexo por cidade ---
  const handleGroupClick = async (cidadesSelecionadas: string[]) => {
    return await fetchPoliciaisPorCidade(cidadesSelecionadas);
  };

  return {
    selectedSexo,
    setSelectedSexo,
    selectedSituacao,
    setSelectedSituacao,
    selectedTipo,
    setSelectedTipo,
    quantidadeFiltrada,
    fetchSexo,
    fetchSituacao,
    fetchTipo,
    fetchPostoGradSexo,
    aplicarFiltrosAvancados,
    fetchComandos,
    fetchUnidades,
    fetchPostos,
    fetchPorComandoRegional,
    fetchPorUnidade,
    fetchPorPostoGraduacao,
    handleGroupClick
  };
};
