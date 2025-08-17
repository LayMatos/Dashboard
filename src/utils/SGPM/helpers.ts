import { DadosSexo, DadosSituacao, DadosTipo, DadosEfetivo } from '../../models/SGPM/types';

// Re-exportar funções globais de normalização
export {
  removeAcentos,
  normalizarString,
  normalizarStringMaiuscula,
  normalizarNomeCidade,
  normalizarNomeCidadeParaAPI,
  compararNomesCidades,
  encontrarCidade,
  validarNomeCidade,
  cidadeExiste,
  normalizarListaCidades,
  removerDuplicatasCidades,
  filtrarCidadesPorPrefixo
} from '../stringUtils';

export const calcularTotaisPorCR = (dadosEfetivo: DadosEfetivo): Record<string, number> => {
  const totaisPorCR: Record<string, number> = {};
  const mapaInvertido: Record<string, string> = {
    "1º COMANDO REGIONAL": "CR_1",
    "2º COMANDO REGIONAL": "CR_2",
    "3º COMANDO REGIONAL": "CR_3",
    "4º COMANDO REGIONAL": "CR_4",
    "5º COMANDO REGIONAL": "CR_5",
    "6º COMANDO REGIONAL": "CR_6",
    "7º COMANDO REGIONAL": "CR_7",
    "8º COMANDO REGIONAL": "CR_8",
    "9º COMANDO REGIONAL": "CR_9",
    "10º COMANDO REGIONAL": "CR_10",
    "11º COMANDO REGIONAL": "CR_11",
    "12º COMANDO REGIONAL": "CR_12",
    "13º COMANDO REGIONAL": "CR_13",
    "14º COMANDO REGIONAL": "CR_14",
    "15º COMANDO REGIONAL": "CR_15",
  };

  Object.entries(dadosEfetivo).forEach(([nomeCr, total]) => {
    const chaveCr = mapaInvertido[nomeCr];
    if (chaveCr) {
      totaisPorCR[chaveCr] = total;
    }
  });

  return totaisPorCR;
};

export const findQuantidadeByTipo = (tipo: string, dadosTipo: DadosTipo[]): number => {
  const tipoEncontrado = dadosTipo.find(dado => dado.tipo === tipo);
  return tipoEncontrado ? tipoEncontrado.quantidade : 0;
};

export const somaInativos = (dadosTipo: DadosTipo[]): number => {
  const tiposInativos = [
    'REFORMA - INVALIDEZ',
    'REFORMA',
    'RESERVA - A PEDIDO',
    'RESERVA - EX OFFICIO'
  ];

  return tiposInativos.reduce((total, tipo) => {
    const tipoEncontrado = dadosTipo.find(dado => dado.tipo === tipo);
    return total + (tipoEncontrado ? tipoEncontrado.quantidade : 0);
  }, 0);
};

export const getQuantidadePorSexo = (sexo: string, dados: DadosSexo[]): number => {
  const encontrado = dados.find(item => item.sexo === sexo);
  return encontrado ? encontrado.quantidade : 0;
};

export const findQuantidadeBySituacao = (situacaoBusca: string, dadosSituacao: DadosSituacao[]): number => {
  const situacao = dadosSituacao.find(item => item.situacao === situacaoBusca);
  return situacao ? situacao.quantidade : 0;
};

export const sexoMapeado: Record<string, string> = {
  M: "MASCULINO",
  F: "FEMININO"
}; 