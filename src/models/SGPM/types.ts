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
  qtd_sexoF?: number;
  qtd_sexoM?: number;
}

export interface DadosEfetivo {
  [key: string]: number;
}

export interface DadosPorUnidade {
  unidade: string;
  Feminino: number;
  Masculino: number;
}

export interface DadosPorComandoRegional {
  comando_regional: string;
  Feminino: number;
  Masculino: number;
}

export interface DadosCidade {
  nome: string;
  coords: [number, number];
}

export interface CidadeSGPM {
  nome: string;
  coords: [number, number];
  cr: string;
  info?: string;
}

export interface PostoGraduacaoItem {
  posto_grad: string;
  quantidade: number;
}

export interface PostoGraduacaoTotal {
  posto_grad: string;
  total: number;
  ordem: number;
}

export interface PostoGraduacaoResponse {
  feminino: PostoGraduacaoItem[];
  masculino: PostoGraduacaoItem[];
}

export interface PostoGraduacao {
  posto_graduacao: string;
  quantidade: number;
}

export interface CardProps {
  titulo: string;
  valor: number | string;
}

// === Novos tipos para filtros opcionais ===
export interface FiltroPolicial {
  sexo?: string;
  situacao?: string;
  tipo?: string;
  posto_grad?: string;
  unidade?: string;
  comando_regional?: string;
}
