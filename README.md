# Dashboard PMMT

Este é um dashboard interativo para a Polícia Militar de Mato Grosso, desenvolvido com React, TypeScript e FastAPI.

## Funcionalidades

### SGPM (Sistema de Gestão de Pessoal Militar)
- Visualização de dados por sexo, situação e tipo de policial
- Filtragem cruzada de dados (até 3 filtros simultâneos)
- Mapa interativo com distribuição geográfica por CR
- Gráficos de distribuição por posto/graduação
- Comparativo feminino/masculino por cidade
- Visualização detalhada por unidade

### CONEQ (Controle de Equipamentos)
- Gestão de estoque
- Controle de entregas
- Visualização de dados em tempo real

### SIGARF (Sistema de Gestão de Armamento e Fardamento)
- Controle de armamento
- Gestão de fardamento
- Relatórios e estatísticas

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- ECharts (gráficos avançados)
- Leaflet (mapas interativos)
- Axios (requisições HTTP)
- React Router (navegação)

### Backend
- FastAPI
- PostgreSQL
- Pydantic
- Python 3.12+

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dashboard-pmmt.git
cd dashboard-pmmt
```

2. Instale as dependências do frontend:
```bash
npm install
```

3. Instale as dependências do backend:
```bash
pip install -r requirements.txt
```

4. Configure o banco de dados:
- Crie um banco PostgreSQL
- Configure as variáveis de ambiente
- Execute as migrações do banco de dados

## Executando o Projeto

1. Inicie o backend:
```bash
uvicorn app.main:app --reload
```

2. Inicie o frontend:
```bash
npm start
```

O dashboard estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
dashboard-pmmt/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── SGPM/           # Componentes específicos do SGPM
│   │   ├── Charts/         # Componentes de gráficos
│   │   ├── Cards/          # Componentes de cards
│   │   └── MapaReal/       # Componente de mapa
│   ├── pages/              # Páginas da aplicação
│   │   ├── SGPM/           # Páginas do SGPM
│   │   ├── CONEQ/          # Páginas do CONEQ
│   │   └── SIGARF/         # Páginas do SIGARF
│   ├── services/           # Serviços de API
│   ├── hooks/              # Hooks customizados
│   ├── utils/              # Utilitários
│   ├── models/             # Tipos e interfaces
│   ├── data/               # Dados estáticos
│   └── types/              # Definições de tipos
├── app/                    # Backend FastAPI
│   ├── routes/             # Rotas da API
│   ├── controllers/        # Controladores
│   ├── models/             # Modelos de dados
│   ├── utils/              # Utilitários
│   └── config/             # Configurações
├── public/                 # Arquivos públicos
└── package.json            # Dependências do frontend
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
