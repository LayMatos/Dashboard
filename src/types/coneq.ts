export interface LegendaItem {
  color: string;
  label: string;
}

export interface EstoqueData {
  name: string;
  value: number;
}

export interface TipoEquipamento {
  id: number;
  nome: string;
}

export interface EstoqueResponse {
  estoque: Array<{
    status: string;
    quantidade: number;
  }>;
}

export interface CautelaResponse {
  cautela: Array<{
    status: string;
    quantidade: number;
  }>;
}

export interface EntregaData {
  nome_cidade: string;
  qtd_entregas: number;
}

export interface CautelaData {
  nome_cidade: string;
  qtd_cautelas: number;
}

export interface DadosCombinados {
  nome_cidade: string;
  Cautelas: number;
  Entregas: number;
}

export interface EstoqueStatusData {
  estoque: Array<{
    status: string;
    quantidade: number;
  }>;
  cautelas: number;
}

export interface EstoqueItem {
  equipamento_nome: string;
  quantidade_em_estoque: number;
}

export interface CidadeData {
  nome_cidade: string;
  qtd_cautelas: number;
  qtd_entregas: number;
}

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderRadius: number;
  }[];
}

export interface DoughnutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

export interface TipoEquipamentoResponse {
  id: number;
  nome: string;
} 