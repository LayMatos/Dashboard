# 📚 Documentação da API - Dashboard PMMT

## 🏗️ **Arquitetura da API**

### **Tecnologias Utilizadas**
- **Backend**: FastAPI (Python)
- **Banco de Dados**: PostgreSQL
- **ORM**: psycopg2 (conexão direta)
- **CORS**: Configurado para localhost:3000

### **Estrutura do Projeto**
```
app/
├── main.py                 # Aplicação principal FastAPI
├── config.py              # Configurações do banco e CORS
├── controllers/           # Lógica de negócio
├── models/               # Modelos de dados e queries
├── routes/               # Definição dos endpoints
└── utils/                # Utilitários (normalização de strings)
```

---

## 🔗 **Endpoints da API**

### **Base URL**
```
http://localhost:8000/api
```

---

## 📊 **Endpoints SGPM (Sistema de Gestão de Pessoal Militar)**

### **1. Dados por Sexo**
```http
GET /api/policiais_sexo
```

**Descrição**: Retorna a contagem de policiais por sexo.

**Resposta**:
```json
[
  {
    "sexo": "M",
    "quantidade": 1234
  },
  {
    "sexo": "F", 
    "quantidade": 567
  }
]
```

---

### **2. Dados por Situação**
```http
GET /api/policiais_situacao
```

**Descrição**: Retorna a contagem de policiais por situação.

**Resposta**:
```json
[
  {
    "situacao": "ATIVA",
    "quantidade": 1500
  },
  {
    "situacao": "FERIAS",
    "quantidade": 45
  }
]
```

---

### **3. Dados por Tipo**
```http
GET /api/policiais_tipo
```

**Descrição**: Retorna a contagem de policiais por tipo.

**Resposta**:
```json
[
  {
    "tipo": "EFETIVO",
    "quantidade": 1800
  },
  {
    "tipo": "REFORMA",
    "quantidade": 12
  }
]
```

---

### **4. Dados por Posto/Graduação**
```http
GET /api/dados_posto_grad
```

**Descrição**: Retorna dados de policiais por posto/graduação e sexo.

**Parâmetros Query**:
- `sexo` (opcional): Filtro por sexo (M, F)
- `situacao` (opcional): Filtro por situação
- `tipo` (opcional): Filtro por tipo

**Exemplo**:
```http
GET /api/dados_posto_grad?sexo=M&situacao=ATIVA
```

**Resposta**:
```json
{
  "feminino": [
    {
      "posto_grad": "CORONEL",
      "quantidade": 5
    }
  ],
  "masculino": [
    {
      "posto_grad": "CORONEL", 
      "quantidade": 19
    }
  ]
}
```

---

### **5. Lista de Postos/Graduações**
```http
GET /api/postos_graduacao_sgpm
```

**Descrição**: Retorna lista de todos os postos/graduações disponíveis.

**Resposta**:
```json
[
  {
    "cod_posto_grad": 1,
    "posto_grad": "CORONEL",
    "posto_grad_abrev": "CEL"
  }
]
```

---

### **6. Lista de Unidades**
```http
GET /api/unidades_sgpm
```

**Descrição**: Retorna lista de todas as unidades disponíveis.

**Resposta**:
```json
[
  {
    "cod_opm": 1,
    "opm": "1º BPM"
  }
]
```

---

### **7. Lista de Comandos Regionais**
```http
GET /api/comandos_regionais
```

**Descrição**: Retorna lista de todos os comandos regionais.

**Resposta**:
```json
[
  {
    "cod_opm": 1,
    "opm": "CR 1 - CUIABÁ"
  }
]
```

---

### **8. Filtro Avançado**
```http
GET /api/policiais_filtro_avancado
```

**Descrição**: Filtra policiais com base em múltiplos critérios.

**Parâmetros Query**:
- `sexo` (opcional): Filtro por sexo
- `situacao` (opcional): Filtro por situação
- `tipo` (opcional): Filtro por tipo
- `comando_regional` (opcional): ID do comando regional
- `unidade` (opcional): ID da unidade
- `posto_grad` (opcional): ID do posto/graduação

**Exemplo**:
```http
GET /api/policiais_filtro_avancado?sexo=M&comando_regional=1
```

**Resposta**:
```json
{
  "quantidade": 150,
  "dados": []
}
```

---

### **9. Totais por Comando Regional**
```http
GET /api/totais-por-cr
```

**Descrição**: Retorna totais de policiais por comando regional.

**Resposta**:
```json
{
  "CR 1 - CUIABÁ": 150,
  "CR 2 - VÁRZEA GRANDE": 120
}
```

---

### **10. Dados por Cidade**
```http
GET /api/contar_sexo_por_cidade
```

**Descrição**: Retorna dados de policiais por sexo e cidade.

**Parâmetros Query**:
- `cidades` (obrigatório): Lista de cidades separadas por vírgula

**Exemplo**:
```http
GET /api/contar_sexo_por_cidade?cidades=Cuiabá,Várzea Grande
```

**Resposta**:
```json
[
  {
    "nome_cidade": "CUIABA",
    "qtd_sexoM": 2810,
    "qtd_sexoF": 493
  }
]
```

---

### **11. Dados por Unidade**
```http
GET /api/contar_sexo_por_unidade
```

**Descrição**: Retorna dados de policiais por sexo e unidade em uma cidade.

**Parâmetros Query**:
- `cidade` (obrigatório): Nome da cidade

**Exemplo**:
```http
GET /api/contar_sexo_por_unidade?cidade=Cuiabá
```

**Resposta**:
```json
[
  {
    "nome_unidade": "1º BPM",
    "qtd_sexoM": 150,
    "qtd_sexoF": 25
  }
]
```

---

## 📊 **Endpoints CONEQ (Sistema de Controle de Equipamentos)**

### **1. Dados de Entrega**
```http
GET /api/coneq/entregas
```

**Descrição**: Retorna dados de entregas de equipamentos.

**Parâmetros Query**:
- `data_inicio` (opcional): Data de início (YYYY-MM-DD)
- `data_fim` (opcional): Data de fim (YYYY-MM-DD)
- `tipo_equipamento` (opcional): Tipo de equipamento

**Resposta**:
```json
[
  {
    "id": 1,
    "equipamento": "Rádio",
    "quantidade": 10,
    "data_entrega": "2024-01-15"
  }
]
```

---

### **2. Dados de Estoque**
```http
GET /api/coneq/estoque
```

**Descrição**: Retorna dados de estoque de equipamentos.

**Resposta**:
```json
[
  {
    "equipamento": "Rádio",
    "quantidade_disponivel": 50,
    "quantidade_em_uso": 30
  }
]
```

---

## 🔧 **Configuração do Banco de Dados**

### **Arquivo de Configuração** (`app/config.py`)
```python
DB_CONFIG = {
    "host": "172.16.74.224",
    "database": "PMMT",
    "user": "postgres", 
    "password": "m4stervi4@2009"
}
```

### **Tabelas Principais**
- `sgpm.policial` - Dados dos policiais
- `sgpm.posto_grad` - Postos e graduações
- `sgpm.opm` - Unidades e comandos
- `sgpm.cidade` - Cidades
- `sgpm.policial_situacao` - Situações dos policiais
- `sgpm.policial_tipo` - Tipos de policiais

---

## 🚀 **Como Executar a API**

### **1. Instalar Dependências**
```bash
pip install -r requirements.txt
```

### **2. Iniciar o Servidor**
```bash
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **3. Acessar a Documentação**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📝 **Códigos de Status HTTP**

- **200**: Sucesso
- **400**: Erro de requisição (parâmetros inválidos)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

---

## 🔒 **Segurança**

- **CORS**: Configurado para permitir apenas localhost:3000
- **Validação**: Todos os parâmetros são validados
- **Sanitização**: Strings são normalizadas para evitar SQL injection

---

## 📞 **Suporte**

Para dúvidas ou problemas com a API, consulte:
- Logs do servidor
- Documentação Swagger em `/docs`
- Código fonte em `app/`
