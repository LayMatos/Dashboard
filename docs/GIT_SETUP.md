# 🚀 Configuração do Git - Dashboard PMMT

## 📋 **Checklist de Preparação**

### **1. Verificar Arquivos Sensíveis**
Antes de fazer o commit, verifique se os seguintes arquivos estão no `.gitignore`:

- ✅ `app/config.py` (contém credenciais do banco)
- ✅ `.env` (variáveis de ambiente)
- ✅ `__pycache__/` (cache Python)
- ✅ `node_modules/` (dependências Node.js)
- ✅ `build/` (build do React)
- ✅ `*.log` (arquivos de log)

### **2. Arquivos que DEVEM ser commitados**
- ✅ `requirements.txt` (dependências Python)
- ✅ `package.json` e `package-lock.json` (dependências Node.js)
- ✅ `env.example` (template de variáveis de ambiente)
- ✅ `config.example.py` (template de configuração)
- ✅ Documentação (`.md` files)
- ✅ Código fonte (`src/`, `app/`)

---

## 🔧 **Configuração Inicial do Git**

### **1. Inicializar o Repositório**
```bash
# Se ainda não inicializou
git init

# Configurar usuário (se necessário)
git config user.name "Seu Nome"
git config user.email "seu-email@exemplo.com"
```

### **2. Adicionar Arquivos**
```bash
# Adicionar todos os arquivos (exceto os no .gitignore)
git add .

# Verificar o que será commitado
git status
```

### **3. Primeiro Commit**
```bash
git commit -m "feat: initial commit - Dashboard PMMT

- Backend FastAPI com PostgreSQL
- Frontend React com TypeScript
- Sistema SGPM implementado
- Sistema CONEQ implementado
- Documentação completa
- Templates de código"
```

---

## 📤 **Subindo para o GitHub/GitLab**

### **1. Criar Repositório Remoto**
1. Vá para GitHub/GitLab
2. Crie um novo repositório
3. **NÃO** inicialize com README, .gitignore ou license

### **2. Conectar Repositório Local ao Remoto**
```bash
# Adicionar remote origin
git remote add origin https://github.com/seu-usuario/dashboard-pmmt.git

# Verificar remote
git remote -v
```

### **3. Fazer Push**
```bash
# Primeiro push (definir upstream)
git push -u origin main

# Ou se estiver usando master
git push -u origin master
```

---

## 🔄 **Fluxo de Trabalho Diário**

### **1. Verificar Status**
```bash
git status
git log --oneline -5
```

### **2. Fazer Alterações**
```bash
# Criar branch para nova funcionalidade
git checkout -b feature/nova-funcionalidade

# Fazer alterações...
# Testar...

# Adicionar alterações
git add .

# Commit com mensagem descritiva
git commit -m "feat: implementa nova funcionalidade

- Adiciona endpoint para dados por idade
- Implementa gráfico de distribuição etária
- Atualiza documentação da API"
```

### **3. Push das Alterações**
```bash
# Push da branch
git push origin feature/nova-funcionalidade

# Criar Pull Request/Merge Request
# Fazer merge na main/master
```

---

## 📝 **Padrões de Commit**

### **Convenção de Commits**
```
tipo(escopo): descrição

corpo da mensagem

rodapé
```

### **Tipos de Commit**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação de código
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

### **Exemplos de Commits**
```bash
# Nova funcionalidade
git commit -m "feat(sgpm): adiciona filtro por comando regional"

# Correção de bug
git commit -m "fix(api): corrige erro na busca de cidades com acentos"

# Documentação
git commit -m "docs: atualiza guia de implementação"

# Refatoração
git commit -m "refactor(utils): melhora normalização de strings"
```

---

## 🛡️ **Segurança**

### **1. Verificar Arquivos Sensíveis**
```bash
# Verificar se arquivos sensíveis não estão sendo commitados
git status

# Se aparecer arquivos como config.py ou .env, remova-os
git reset HEAD app/config.py
git reset HEAD .env
```

### **2. Verificar Histórico**
```bash
# Verificar últimos commits
git log --oneline -10

# Verificar arquivos em um commit específico
git show --name-only <commit-hash>
```

### **3. Se Commitou Arquivo Sensível**
```bash
# Remover arquivo do histórico (CUIDADO!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch app/config.py" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push (CUIDADO!)
git push origin --force
```

---

## 🔍 **Verificações Finais**

### **1. Antes do Push**
```bash
# Verificar status
git status

# Verificar arquivos que serão enviados
git diff --cached --name-only

# Verificar tamanho do repositório
du -sh .git
```

### **2. Verificar .gitignore**
```bash
# Verificar se arquivos estão sendo ignorados
git check-ignore app/config.py
git check-ignore .env
git check-ignore __pycache__/
```

### **3. Testar Clone**
```bash
# Em outro diretório, testar clone
cd /tmp
git clone <url-do-repositorio>
cd dashboard-pmmt

# Verificar se arquivos sensíveis não estão lá
ls -la app/config.py
ls -la .env
```

---

## 📚 **Comandos Úteis**

### **Configuração**
```bash
# Ver configuração
git config --list

# Configurar editor
git config core.editor "code --wait"

# Configurar branch padrão
git config --global init.defaultBranch main
```

### **Logs e Histórico**
```bash
# Log detalhado
git log --oneline --graph --all

# Log de um arquivo específico
git log --follow app/config.py

# Ver alterações em um commit
git show <commit-hash>
```

### **Branches**
```bash
# Listar branches
git branch -a

# Criar e mudar para branch
git checkout -b feature/nome

# Deletar branch local
git branch -d feature/nome

# Deletar branch remota
git push origin --delete feature/nome
```

---

## 🚨 **Problemas Comuns**

### **1. Arquivo Sensível Commitado**
```bash
# Remover do staging
git reset HEAD arquivo-sensivel

# Adicionar ao .gitignore
echo "arquivo-sensivel" >> .gitignore

# Commit da correção
git add .gitignore
git commit -m "fix: adiciona arquivo sensível ao .gitignore"
```

### **2. Commit Errado**
```bash
# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (remove alterações)
git reset --hard HEAD~1
```

### **3. Push Rejeitado**
```bash
# Fazer pull primeiro
git pull origin main

# Resolver conflitos se houver
# Fazer push novamente
git push origin main
```

---

## ✅ **Checklist Final**

Antes de fazer o push final:

- [ ] `.gitignore` configurado corretamente
- [ ] Arquivos sensíveis não estão no staging
- [ ] `env.example` e `config.example.py` criados
- [ ] Documentação atualizada
- [ ] Código testado
- [ ] Mensagens de commit descritivas
- [ ] Repositório remoto criado
- [ ] README.md atualizado

---

## 📞 **Suporte**

Se encontrar problemas:

1. **Verifique o `.gitignore`** - arquivos sensíveis não devem ser commitados
2. **Use `git status`** - sempre verifique antes de commitar
3. **Teste o clone** - certifique-se de que funciona em outro ambiente
4. **Consulte a documentação** - Git tem excelente documentação oficial

**Boa sorte com o projeto! 🚀**
