// --- COMANDOS E UNIDADES ---
export interface ComandoRegional {
  id: number;
  nome: string;
}

export interface Unidade {
  id: number;
  nome: string;
}

// --- POSTO E GRADUAÇÃO ---
export interface PostoGraduacaoInfo {
  id: number;
  posto_grad: string;
  posto_grad_abrev?: string;
  total?: number;
}

export interface PostoGraduacaoSexo {
  feminino: number[];
  masculino: number[];
}

// --- DADOS DE POLICIAIS ---
export interface DadosSituacao {
  situacao: string;
  quantidade: number;
}

export interface DadosTipo {
  tipo: string;
  quantidade: number;
}

export interface DadosSexo {
  sexo: string;
  quantidade: number;
  nome_cidade?: string;
  Feminino?: number;
  Masculino?: number;
}

export interface DadosPorUnidade {
  unidade: string;
  Feminino: number;
  Masculino: number;
}

export interface DadosCidade {
  nome_cidade: string;
  Feminino: number;
  Masculino: number;
  unidades?: string[];
}

export interface DadosFiltrados {
  quantidade: number;
  dadosPorUnidade?: DadosPorUnidade[];
}

// --- EFETIVO ---
export interface DadosEfetivo {
  [key: string]: number;
}

// --- AUXILIARES ---
export interface GruposDeMunicipios {
  [cr: string]: string[];
}

export interface CardProps {
  titulo: string;
  valor: number | string;
}

export interface SexoPorCidade {
  nome_cidade: string;
  Feminino: number;
  Masculino: number;
  unidades?: string[];
}
