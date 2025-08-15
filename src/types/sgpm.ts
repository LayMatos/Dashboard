export interface ComandoRegional {
  cod_opm: number;
  opm: string;
}

export interface Unidade {
  cod_opm: number;
  unidade: string;
}

export interface PostoGraduacao {
  cod_posto_grad: number;
  posto_grad: string;
  total?: number; // opcional
}

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

export interface DadosFiltrados {
  quantidade: number;
}

export interface DadosEfetivo {
  [key: string]: number;
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

export interface UnidadesPorCidade {
  [cidade: string]: string[];
}

export interface CidadeSGPM {
  nome: string;
  coords: [number, number];
  cr: string;
  info?: string;
}

export interface PostoGraduacao {
  feminino: number[];
  masculino: number[];
}

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