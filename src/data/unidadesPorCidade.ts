interface UnidadesPorCidade {
  [cidade: string]: string[];
}

const unidadesPorCidade: UnidadesPorCidade = {
  "BARAO DE MELGACO": [
    "NPM BARAO DE MELGACO"
  ],
  "CHAPADA DOS GUIMARAES": [
    "1ª CIPM - CHAPADA DOS GUIMARAES",
    "NPM PARAISO DO MANSO"
  ],
  "CUIABA": [
    "10ª BPM - 1ª CIA PM SANTA ROSA",
    "10ª BPM - 2ª CIA PM SANTA IZABEL",
    "10ª BPM - 3ª CIA PM RIBEIRAO DO LIPA",
    "10ª BPM - 4ª CIA PM ARAES",
    "10ª BPM - SEDE",
    "1º BATALHAO DE POLICIA MILITAR - 2ª CIA PM LIXEIRA",
    "1ª BPM - 3ª CIA PM BEIRA RIO",
    "1ª BPM - 4ª CIA PM BOA ESPERANCA"
  ]
};

export default unidadesPorCidade;
export type { UnidadesPorCidade }; 