# 🚀 Dash Att - Sistema de Dashboard PMMT

Sistema de dashboard interativo para a **Polícia Militar de Mato Grosso**, desenvolvido com React, TypeScript e FastAPI.

## 📋 Visão Geral

O **Dash Att** é uma plataforma completa para gestão de dados policiais, controle de equipamentos e recursos físicos da PMMT. O sistema oferece uma interface moderna e intuitiva para visualização de dados em tempo real, com gráficos interativos, mapas geográficos e relatórios detalhados.

### 🎯 **Módulos Principais**

- **SGPM** - Sistema de Gestão de Policiais Militares
  - Controle de efetivo por comando regional
  - Filtros hierárquicos de unidades subordinadas
  - Distribuição geográfica com mapas interativos
  - Estatísticas por sexo, situação e tipo de policial

- **CONEQ** - Controle de Equipamentos  
  - Gestão de estoque de equipamentos
  - Sistema de cautelas e entregas
  - Relatórios em tempo real
  - Controle por cidade e comando regional

- **SIGARF** - Sistema de Gestão de Armamento e Fardamento
  - Controle de armamento
  - Gestão de fardamento
  - Relatórios e estatísticas

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+
- Python 3.12+
- PostgreSQL 12+
- Git

### **Instalação**

1. **Clone o repositório**
```bash
git clone <repository-url>
cd "Dash Att"
```

2. **Configure o ambiente**
```bash
# Copie o arquivo de exemplo de configuração
cp config.example.py app/config.py

# Edite as configurações do banco de dados
# app/config.py
```

3. **Instale as dependências do frontend**
```bash
npm install
```

4. **Instale as dependências do backend**
```bash
pip install -r requirements.txt
```

5. **Configure o banco de dados**
- Configure as variáveis de ambiente no arquivo `app/config.py`
- Execute as migrações (se necessário)
- Certifique-se de que o PostgreSQL está rodando

### **Executando o Projeto**

1. **Inicie o backend**
```bash
cd app
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Inicie o frontend** (em outro terminal)
```bash
npm start
```

3. **Acesse o sistema**
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📚 **Documentação Completa**

Toda a documentação detalhada está disponível na pasta [`docs/`](./docs/):

### 📖 **Documentação Principal**
- [Índice da Documentação](./docs/README.md) - Organização completa
- [Guia de Desenvolvimento](./docs/README_DEVELOPMENT.md) - Setup e desenvolvimento
- [Documentação da API](./docs/API_DOCUMENTATION.md) - Endpoints e integração

### 🔧 **Funcionalidades Específicas**
- [Sistema Global de Normalização](./docs/DOCUMENTACAO_SISTEMA_GLOBAL.md)
- [Filtros Hierárquicos de Unidades](./docs/DOCUMENTACAO_UNIDADES_SUBORDINADAS.md)
- [Normalização de Cidades](./docs/DOCUMENTACAO_NORMALIZACAO_CIDADES.md)

### 🛠️ **Guias e Templates**
- [Guia de Novas Funcionalidades](./docs/GUIDE_NEW_FEATURES.md)
- [Templates de Código](./docs/CODE_TEMPLATES.md)
- [Guia de Deploy](./docs/DEPLOY_VM.md)
- [Configuração Git](./docs/GIT_SETUP.md)

## 🏗️ **Estrutura do Projeto**

```
Dash Att/
├── app/                    # Backend (FastAPI)
│   ├── models/            # Modelos de dados
│   ├── controllers/       # Controladores
│   ├── routes/           # Rotas da API
│   ├── config/           # Configurações
│   └── main.py           # Aplicação principal
├── src/                   # Frontend (React/TypeScript)
│   ├── components/       # Componentes React
│   │   ├── Cards/       # Componentes de cards
│   │   ├── Charts/      # Componentes de gráficos
│   │   ├── SGPM/        # Componentes específicos SGPM
│   │   └── MapaReal/    # Componentes de mapa
│   ├── pages/           # Páginas da aplicação
│   │   ├── SGPM/        # Páginas do módulo SGPM
│   │   ├── CONEQ/       # Páginas do módulo CONEQ
│   │   └── SIGARF/      # Páginas do módulo SIGARF
│   ├── services/        # Serviços de API
│   ├── hooks/           # Hooks customizados
│   ├── utils/           # Utilitários globais
│   └── types/           # Definições TypeScript
├── docs/                 # 📚 Documentação completa
├── logs/                 # Logs do sistema
├── public/               # Arquivos estáticos
├── .gitignore           # Configuração Git
├── package.json         # Dependências frontend
├── requirements.txt     # Dependências backend
└── README.md           # Este arquivo
```

## 🔧 **Tecnologias**

### **Frontend**
- **React 18** + **TypeScript** - Framework principal
- **Tailwind CSS** - Framework de estilização
- **ECharts** - Biblioteca de gráficos interativos
- **Leaflet** - Biblioteca de mapas
- **Axios** - Cliente HTTP
- **React Router** - Roteamento

### **Backend**
- **FastAPI** - Framework web Python
- **PostgreSQL** - Banco de dados principal
- **SQLAlchemy** - ORM
- **Uvicorn** - Servidor ASGI
- **Pydantic** - Validação de dados

## 📊 **Funcionalidades Principais**

### ✅ **SGPM - Gestão de Policiais**
- **Filtros Avançados**: Sexo, situação, tipo, comando regional, unidade
- **Filtro Hierárquico**: Unidades subordinadas por comando regional
- **Gráficos Interativos**: Distribuição geográfica, estatísticas por categoria
- **Mapas**: Visualização geográfica com Leaflet
- **Sistema de Normalização**: Padronização automática de nomes de cidades

### ✅ **CONEQ - Controle de Equipamentos**
- **Gestão de Estoque**: Controle de equipamentos disponíveis
- **Sistema de Cautelas**: Registro de equipamentos emprestados
- **Sistema de Entregas**: Controle de devoluções
- **Relatórios**: Estatísticas em tempo real
- **Integração**: Sistema de normalização de cidades

### ✅ **SIGARF - Gestão de Armas**
- **Controle de Armamento**: Registro e controle de armas
- **Gestão de Fardamento**: Controle de uniformes e equipamentos
- **Relatórios**: Estatísticas e relatórios detalhados

## 🔒 **Segurança e Configuração**

### **Arquivos de Configuração**
- `.gitignore` - Configurado para proteger arquivos sensíveis
- `config.example.py` - Template de configuração
- `app/config.py` - Configurações do backend (não versionado)

### **Variáveis de Ambiente**
- Configurações de banco de dados
- Chaves de API (se necessário)
- Configurações de produção

## 🚀 **Status do Projeto**

- ✅ **Produção**: Sistema em uso ativo na PMMT
- ✅ **Manutenção**: Atualizações regulares e melhorias
- ✅ **Documentação**: Completa e organizada na pasta `docs/`
- ✅ **Deploy**: Automatizado e configurado
- ✅ **Versionamento**: Git configurado com `.gitignore` adequado

## 🛠️ **Desenvolvimento**

### **Comandos Úteis**
```bash
# Instalar dependências
npm install
pip install -r requirements.txt

# Executar em desenvolvimento
npm start
cd app && uvicorn main:app --reload

# Build para produção
npm run build

# Verificar logs
tail -f logs/backend.log
tail -f logs/frontend.log
```

### **Estrutura de Desenvolvimento**
- **Frontend**: React com TypeScript e Tailwind CSS
- **Backend**: FastAPI com PostgreSQL
- **Documentação**: Markdown organizado na pasta `docs/`
- **Versionamento**: Git com `.gitignore` configurado

## 📞 **Suporte**

Para dúvidas, sugestões ou problemas:

1. **Consulte a documentação** na pasta [`docs/`](./docs/)
2. **Verifique os logs** em caso de erros (`logs/`)
3. **Contate a equipe** de desenvolvimento
4. **Abra uma issue** no repositório

## 📈 **Próximas Atualizações**

- [ ] Melhorias na interface do usuário
- [ ] Novos módulos de relatórios
- [ ] Integração com sistemas externos
- [ ] Otimizações de performance
- [ ] Novos tipos de gráficos e visualizações

---

**Desenvolvido para a Polícia Militar de Mato Grosso**  
**Versão**: 2.0  
**Status**: ✅ Ativo e Mantido  
**Última Atualização**: Dezembro 2024
