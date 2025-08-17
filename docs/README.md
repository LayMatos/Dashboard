# 📚 Documentação do Projeto Dash Att

Bem-vindo à documentação completa do projeto **Dash Att** - Sistema de Dashboard para Controle de Equipamentos e Gestão de Policiais.

## 📋 Índice da Documentação

### 🚀 **Documentação Principal**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [README.md](./README.md) | Documentação principal do projeto | ✅ Ativo |
| [README_DEVELOPMENT.md](./README_DEVELOPMENT.md) | Guia de desenvolvimento | ✅ Ativo |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Documentação completa da API | ✅ Ativo |

### 🔧 **Implementações e Funcionalidades**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [DOCUMENTACAO_SISTEMA_GLOBAL.md](./DOCUMENTACAO_SISTEMA_GLOBAL.md) | Sistema global de normalização de cidades | ✅ Implementado |
| [DOCUMENTACAO_NORMALIZACAO_CIDADES.md](./DOCUMENTACAO_NORMALIZACAO_CIDADES.md) | Normalização de nomes de cidades | ✅ Implementado |
| [RESUMO_IMPLEMENTACAO_CONEQ.md](./RESUMO_IMPLEMENTACAO_CONEQ.md) | Implementação no módulo CONEQ | ✅ Implementado |

### 🎯 **Funcionalidades Específicas**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [DOCUMENTACAO_UNIDADES_SUBORDINADAS.md](./DOCUMENTACAO_UNIDADES_SUBORDINADAS.md) | Filtro hierárquico de unidades | ✅ Implementado |
| [DOCUMENTACAO_FILTRO_UNIDADES_FINAL.md](./DOCUMENTACAO_FILTRO_UNIDADES_FINAL.md) | Filtro de unidades flexível | ✅ Implementado |
| [CORRECAO_FILTRO_UNIDADES.md](./CORRECAO_FILTRO_UNIDADES.md) | Correção do filtro de unidades | ✅ Corrigido |

### 🔧 **Backend e API**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [IMPLEMENTACAO_ENDPOINT_UNIDADES_POR_COMANDO.md](./IMPLEMENTACAO_ENDPOINT_UNIDADES_POR_COMANDO.md) | Endpoint para unidades subordinadas | ✅ Implementado |

### 🛠️ **Desenvolvimento e Deploy**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [GUIDE_NEW_FEATURES.md](./GUIDE_NEW_FEATURES.md) | Guia para novas funcionalidades | ✅ Ativo |
| [CODE_TEMPLATES.md](./CODE_TEMPLATES.md) | Templates de código | ✅ Ativo |
| [DEPLOY_VM.md](./DEPLOY_VM.md) | Guia de deploy na VM | ✅ Ativo |
| [GIT_SETUP.md](./GIT_SETUP.md) | Configuração do Git | ✅ Ativo |

### 🔍 **Troubleshooting**

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [GUIA_TROUBLESHOOTING_NORMALIZACAO.md](./GUIA_TROUBLESHOOTING_NORMALIZACAO.md) | Solução de problemas de normalização | ✅ Ativo |

## 🎯 **Módulos do Sistema**

### **SGPM (Sistema de Gestão de Policiais Militares)**
- **Filtros Avançados**: Sexo, situação, tipo, comando regional, unidade, posto/graduação
- **Filtro Hierárquico**: Comando regional → unidades subordinadas
- **Normalização**: Sistema global para nomes de cidades
- **Gráficos**: Distribuição geográfica e estatísticas

### **CONEQ (Sistema de Controle de Equipamentos)**
- **Gestão de Estoque**: Controle de equipamentos disponíveis
- **Sistema de Cautelas**: Empréstimos de equipamentos
- **Sistema de Entregas**: Devoluções de equipamentos
- **Normalização**: Integração com sistema global

### **SIGARF (Sistema Integrado de Gestão de Armas e Recursos Físicos)**
- **Gestão de Armas**: Controle de armamentos
- **Recursos Físicos**: Gestão de equipamentos diversos

## 🚀 **Funcionalidades Principais**

### ✅ **Implementadas**
- ✅ Sistema de normalização global de cidades
- ✅ Filtros hierárquicos para unidades
- ✅ API REST completa
- ✅ Interface responsiva
- ✅ Gráficos interativos
- ✅ Sistema de autenticação
- ✅ Deploy automatizado

### 🔄 **Em Desenvolvimento**
- 🔄 Melhorias de performance
- 🔄 Novos tipos de gráficos
- 🔄 Funcionalidades avançadas de relatórios

## 📊 **Estrutura do Projeto**

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
├── docs/                 # 📚 Documentação (esta pasta)
└── logs/                 # Logs do sistema
```

## 🔧 **Tecnologias Utilizadas**

### **Frontend**
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **ECharts** para gráficos
- **Axios** para requisições HTTP

### **Backend**
- **FastAPI** (Python)
- **PostgreSQL** como banco de dados
- **SQLAlchemy** para ORM
- **Uvicorn** como servidor ASGI

### **DevOps**
- **Docker** para containerização
- **Git** para versionamento
- **PowerShell** para automação

## 📞 **Suporte e Contato**

Para dúvidas, sugestões ou problemas:

1. **Verificar documentação específica** na seção correspondente
2. **Consultar guias de troubleshooting** para problemas conhecidos
3. **Revisar logs** em caso de erros
4. **Contatar equipe de desenvolvimento** para questões específicas

---

**Última Atualização**: Dezembro 2024  
**Versão**: 2.0  
**Status**: ✅ Ativo e Mantido
