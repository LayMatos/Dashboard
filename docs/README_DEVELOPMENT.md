# 🚀 Dashboard PMMT - Guia de Desenvolvimento

## 📚 **Documentação Completa**

### **📖 Documentação da API**
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentação completa de todos os endpoints
- **[GUIDE_NEW_FEATURES.md](./GUIDE_NEW_FEATURES.md)** - Guia para implementar novas funcionalidades
- **[CODE_TEMPLATES.md](./CODE_TEMPLATES.md)** - Templates de código para desenvolvimento rápido

---

## 🏗️ **Arquitetura do Projeto**

### **Backend (FastAPI + PostgreSQL)**
```
app/
├── main.py                 # Aplicação principal
├── config.py              # Configurações do banco
├── controllers/           # Lógica de negócio
├── models/               # Modelos e queries SQL
├── routes/               # Definição dos endpoints
├── utils/                # Utilitários
└── schemas.py            # Schemas Pydantic
```

### **Frontend (React + TypeScript)**
```
src/
├── components/           # Componentes reutilizáveis
├── pages/               # Páginas da aplicação
├── services/            # Serviços da API
├── hooks/               # Hooks customizados
├── types/               # Definições TypeScript
├── utils/               # Utilitários
└── constants/           # Constantes
```

---

## 🚀 **Início Rápido**

### **1. Configuração do Ambiente**
```bash
# Clonar o projeto
git clone <repository-url>
cd Dashboard

# Instalar dependências Python
pip install -r requirements.txt

# Instalar dependências Node.js
npm install
```

### **2. Configuração do Banco**
```python
# app/config.py
DB_CONFIG = {
    "host": "172.16.74.224",
    "database": "PMMT",
    "user": "postgres",
    "password": "m4stervi4@2009"
}
```

### **3. Executar o Projeto**
```bash
# Terminal 1 - Backend
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
npm start
```

### **4. Acessar a Aplicação**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

---

## 📊 **Sistemas Disponíveis**

### **SGPM (Sistema de Gestão de Pessoal Militar)**
- Gestão do efetivo policial
- Filtros avançados por sexo, situação, tipo, comando regional, unidade e posto/graduação
- Gráficos de distribuição por posto e graduação
- Dados por cidade e unidade
- Distribuição geográfica

### **CONEQ (Sistema de Controle de Equipamentos)**
- Controle de entregas de equipamentos
- Gestão de estoque
- Relatórios de equipamentos

### **SIGARF (Sistema de Gestão de Armas e Fardamentos)**
- Controle de armas
- Gestão de fardamentos

### **CAUTELA (Sistema de Cautelas)**
- Controle de cautelas
- Gestão de responsabilidades

---

## 🛠️ **Desenvolvimento**

### **Implementando Novas Funcionalidades**

1. **Consulte o guia completo**: [GUIDE_NEW_FEATURES.md](./GUIDE_NEW_FEATURES.md)
2. **Use os templates**: [CODE_TEMPLATES.md](./CODE_TEMPLATES.md)
3. **Siga o fluxo de desenvolvimento**:
   - Backend: Schema → Model → Controller → Route
   - Frontend: Types → Service → Hook → Component

### **Estrutura de um Novo Endpoint**

```python
# 1. Schema (app/models/schemas.py)
class NovoDado(BaseModel):
    campo1: str
    campo2: int

# 2. Model (app/models/sgpm_model.py)
def get_novos_dados(self) -> List[Dict]:
    query = "SELECT campo1, campo2 FROM tabela"
    # implementação

# 3. Controller (app/controllers/sgpm_controller.py)
def get_novos_dados(self) -> List[Dict]:
    return self.model.get_novos_dados()

# 4. Route (app/routes/sgpm_routes.py)
@router.get("/novos_dados")
async def obter_novos_dados():
    return controller.get_novos_dados()
```

---

## 📋 **Endpoints Principais**

### **SGPM**
- `GET /api/policiais_sexo` - Dados por sexo
- `GET /api/policiais_situacao` - Dados por situação
- `GET /api/policiais_tipo` - Dados por tipo
- `GET /api/dados_posto_grad` - Dados por posto/graduação
- `GET /api/policiais_filtro_avancado` - Filtro avançado
- `GET /api/contar_sexo_por_cidade` - Dados por cidade
- `GET /api/contar_sexo_por_unidade` - Dados por unidade

### **CONEQ**
- `GET /api/coneq/entregas` - Dados de entregas
- `GET /api/coneq/estoque` - Dados de estoque

---

## 🧪 **Testando**

### **Teste de Endpoints**
```bash
# Testar endpoint
curl http://localhost:8000/api/policiais_sexo

# Testar com parâmetros
curl "http://localhost:8000/api/dados_posto_grad?sexo=M"
```

### **Teste no Frontend**
```typescript
// Testar serviço
const dados = await SGPMService.getPoliciaisPorSexo();
console.log('Dados:', dados);
```

### **Documentação Interativa**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔧 **Configurações**

### **Variáveis de Ambiente**
```bash
# Backend
DB_HOST=172.16.74.224
DB_NAME=PMMT
DB_USER=postgres
DB_PASSWORD=m4stervi4@2009

# Frontend
REACT_APP_API_URL=http://localhost:8000/api
```

### **CORS**
```python
# app/main.py
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## 📝 **Boas Práticas**

### **Backend**
- ✅ Use schemas Pydantic para validação
- ✅ Implemente tratamento de erros robusto
- ✅ Documente endpoints com docstrings
- ✅ Use queries parametrizadas para evitar SQL injection
- ✅ Mantenha logs para debugging

### **Frontend**
- ✅ Use TypeScript para type safety
- ✅ Implemente loading states
- ✅ Trate erros de API
- ✅ Use hooks customizados para lógica reutilizável
- ✅ Mantenha componentes responsivos

### **Geral**
- ✅ Siga padrões de nomenclatura consistentes
- ✅ Teste cada camada separadamente
- ✅ Mantenha documentação atualizada
- ✅ Use versionamento semântico

---

## 🐛 **Debugging**

### **Logs do Backend**
```bash
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level debug
```

### **Logs do Frontend**
```bash
npm start
# Verificar console do navegador
```

### **Verificar Banco de Dados**
```sql
-- Conectar ao PostgreSQL
psql -h 172.16.74.224 -U postgres -d PMMT

-- Verificar tabelas
\dt sgpm.*

-- Testar query
SELECT COUNT(*) FROM sgpm.policial;
```

---

## 📚 **Recursos Adicionais**

### **Documentação Oficial**
- **[FastAPI](https://fastapi.tiangolo.com/)** - Framework web
- **[PostgreSQL](https://www.postgresql.org/docs/)** - Banco de dados
- **[React](https://reactjs.org/docs/)** - Framework frontend
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Linguagem tipada

### **Ferramentas Úteis**
- **Postman** - Teste de APIs
- **pgAdmin** - Interface PostgreSQL
- **React Developer Tools** - Debug React
- **Redux DevTools** - Debug estado

---

## 🤝 **Contribuição**

### **Fluxo de Desenvolvimento**
1. **Planeje** a nova funcionalidade
2. **Implemente** seguindo os templates
3. **Teste** cada camada
4. **Documente** as mudanças
5. **Revise** o código

### **Padrões de Commit**
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração
test: adição de testes
```

---

## 📞 **Suporte**

### **Problemas Comuns**
1. **Servidor não inicia**: Verificar PostgreSQL e credenciais
2. **Filtros não funcionam**: Verificar logs do backend
3. **Dados não carregam**: Verificar console do navegador
4. **Erro de CORS**: Verificar configurações em main.py

### **Contatos**
- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu-email@exemplo.com]
- **Documentação**: [Links acima]

---

## 📄 **Licença**

Este projeto é desenvolvido para a Polícia Militar de Mato Grosso (PMMT).

---

**Última atualização**: Janeiro 2024
**Versão**: 1.0.0
