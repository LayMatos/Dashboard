# 🚀 Dash Att - Sistema de Dashboard PMMT

Sistema de dashboard interativo para a **Polícia Militar de Mato Grosso**, desenvolvido com React, TypeScript e FastAPI.

## 📋 Visão Geral

O **Dash Att** é uma plataforma completa para gestão de dados policiais, controle de equipamentos e recursos físicos da PMMT.

### 🎯 **Módulos Principais**

- **SGPM** - Sistema de Gestão de Policiais Militares
- **CONEQ** - Controle de Equipamentos  
- **SIGARF** - Sistema de Gestão de Armamento e Fardamento

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+
- Python 3.12+
- PostgreSQL

### **Instalação**

1. **Clone o repositório**
```bash
git clone <repository-url>
cd "Dash Att"
```

2. **Instale as dependências do frontend**
```bash
npm install
```

3. **Instale as dependências do backend**
```bash
pip install -r requirements.txt
```

4. **Configure o banco de dados**
- Configure as variáveis de ambiente
- Execute as migrações

### **Executando o Projeto**

1. **Inicie o backend**
```bash
cd app
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Inicie o frontend**
```bash
npm start
```

O dashboard estará disponível em `http://localhost:3000`

## 📚 **Documentação Completa**

Toda a documentação detalhada está disponível na pasta [`docs/`](./docs/):

- 📖 [Documentação Principal](./docs/README.md)
- 🔧 [Guia de Desenvolvimento](./docs/README_DEVELOPMENT.md)
- 📡 [Documentação da API](./docs/API_DOCUMENTATION.md)
- 🎯 [Funcionalidades Específicas](./docs/)
- 🛠️ [Guias de Deploy](./docs/)

## 🏗️ **Estrutura do Projeto**

```
Dash Att/
├── app/                    # Backend (FastAPI)
│   ├── models/            # Modelos de dados
│   ├── controllers/       # Controladores
│   ├── routes/           # Rotas da API
│   └── config/           # Configurações
├── src/                   # Frontend (React/TypeScript)
│   ├── components/       # Componentes React
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API
│   ├── hooks/           # Hooks customizados
│   └── utils/           # Utilitários
├── docs/                 # 📚 Documentação completa
└── logs/                 # Logs do sistema
```

## 🔧 **Tecnologias**

### **Frontend**
- React 18 + TypeScript
- Tailwind CSS
- ECharts (gráficos)
- Leaflet (mapas)
- Axios

### **Backend**
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- Uvicorn

## 📊 **Funcionalidades Principais**

### ✅ **SGPM - Gestão de Policiais**
- Filtros avançados (sexo, situação, tipo, comando regional, unidade)
- Filtro hierárquico de unidades subordinadas
- Gráficos interativos e mapas
- Sistema de normalização de cidades

### ✅ **CONEQ - Controle de Equipamentos**
- Gestão de estoque
- Sistema de cautelas e entregas
- Relatórios em tempo real

### ✅ **SIGARF - Gestão de Armas**
- Controle de armamento
- Gestão de fardamento
- Relatórios e estatísticas

## 🚀 **Status do Projeto**

- ✅ **Produção**: Sistema em uso ativo
- ✅ **Manutenção**: Atualizações regulares
- ✅ **Documentação**: Completa e atualizada
- ✅ **Deploy**: Automatizado

## 📞 **Suporte**

Para dúvidas, sugestões ou problemas:

1. **Consulte a documentação** na pasta [`docs/`](./docs/)
2. **Verifique os logs** em caso de erros
3. **Contate a equipe** de desenvolvimento

---

**Desenvolvido para a Polícia Militar de Mato Grosso**  
**Versão**: 2.0  
**Status**: ✅ Ativo e Mantido
