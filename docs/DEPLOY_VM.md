# 🚀 Deploy na VM - Dashboard PMMT

## 📋 **Checklist de Preparação**

### **1. Pré-requisitos da VM**
- ✅ Ubuntu 20.04+ ou Debian 11+
- ✅ Acesso SSH configurado
- ✅ Usuário com permissões sudo
- ✅ Pelo menos 2GB RAM
- ✅ 10GB espaço em disco

### **2. Arquivos Necessários**
- ✅ `start_all.sh` - Script de inicialização
- ✅ `setup_vm.sh` - Script de configuração da VM
- ✅ Código do projeto (via Git ou upload)
- ✅ `requirements.txt` - Dependências Python
- ✅ `package.json` - Dependências Node.js

---

## 🔧 **Configuração da VM**

### **1. Conectar via SSH**
```bash
ssh usuario@ip-da-vm
```

### **2. Executar Script de Configuração**
```bash
# Fazer upload dos scripts para a VM
scp start_all.sh setup_vm.sh usuario@ip-da-vm:/tmp/

# Conectar na VM
ssh usuario@ip-da-vm

# Dar permissão de execução
chmod +x /tmp/setup_vm.sh

# Executar configuração
/tmp/setup_vm.sh
```

### **3. O que o Script Faz**
- ✅ Instala Python 3, Node.js, nginx
- ✅ Cria diretório `/var/www/dsh`
- ✅ Configura virtual environment
- ✅ Configura nginx como proxy reverso
- ✅ Configura firewall
- ✅ Cria systemd service
- ✅ Configura backup automático

---

## 📤 **Upload do Código**

### **Opção 1: Via Git (Recomendado)**
```bash
# Na VM
cd /var/www/dsh

# Clonar repositório
git clone https://github.com/LayMatos/Dashboard.git .

# Ou se já existe, fazer pull
git pull origin master
```

### **Opção 2: Via SCP/SFTP**
```bash
# Do seu computador
scp -r ./* usuario@ip-da-vm:/var/www/dsh/
```

### **Opção 3: Via rsync**
```bash
# Do seu computador
rsync -avz --exclude 'node_modules' --exclude '.git' ./ usuario@ip-da-vm:/var/www/dsh/
```

---

## 🛠️ **Instalação e Configuração**

### **1. Configurar Arquivos de Ambiente**
```bash
# Na VM
cd /var/www/dsh

# Copiar templates
cp env.example .env
cp config.example.py app/config.py

# Editar configurações
nano .env
nano app/config.py
```

### **2. Instalar Dependências**
```bash
# Instalar dependências Python
source venv/bin/activate
pip install -r requirements.txt

# Instalar dependências Node.js
npm install

# Instalar serve globalmente (opcional)
npm install -g serve
```

### **3. Configurar Banco de Dados**
```bash
# Verificar conectividade com o banco
python3 -c "
import psycopg2
conn = psycopg2.connect(
    host='172.16.74.224',
    database='PMMT',
    user='postgres',
    password='m4stervi4@2009'
)
print('Conexão OK')
conn.close()
"
```

---

## 🚀 **Inicialização dos Serviços**

### **1. Usar Script de Inicialização**
```bash
# Dar permissão
chmod +x start_all.sh

# Instalar dependências
./start_all.sh install

# Iniciar serviços
./start_all.sh start

# Verificar status
./start_all.sh status
```

### **2. Comandos Disponíveis**
```bash
./start_all.sh start     # Iniciar tudo
./start_all.sh stop      # Parar tudo
./start_all.sh restart   # Reiniciar tudo
./start_all.sh status    # Ver status
./start_all.sh install   # Instalar dependências
./start_all.sh build     # Apenas construir frontend
./start_all.sh help      # Ver ajuda
```

### **3. Verificar Logs**
```bash
# Logs do backend
tail -f logs/backend.log

# Logs do frontend
tail -f logs/frontend.log

# Logs de inicialização
tail -f logs/startup.log

# Logs do nginx
sudo tail -f /var/log/nginx/dashboard-pmmt-access.log
sudo tail -f /var/log/nginx/dashboard-pmmt-error.log
```

---

## 🌐 **Configuração de Acesso**

### **1. URLs de Acesso**
- **Frontend**: `http://ip-da-vm`
- **API**: `http://ip-da-vm/api`
- **Documentação**: `http://ip-da-vm/docs`

### **2. Configurar DNS (Opcional)**
```bash
# Editar /etc/hosts na VM
sudo nano /etc/hosts

# Adicionar linha
127.0.0.1 dashboard-pmmt.local
```

### **3. Configurar SSL (Opcional)**
```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d seu-dominio.com
```

---

## 🔍 **Troubleshooting**

### **1. Problemas Comuns**

#### **Backend não inicia**
```bash
# Verificar logs
tail -f logs/backend.log

# Verificar se a porta está livre
sudo netstat -tlnp | grep :8000

# Verificar configuração
python3 -c "import app.config; print('Config OK')"
```

#### **Frontend não carrega**
```bash
# Verificar se o build foi criado
ls -la build/

# Verificar nginx
sudo nginx -t
sudo systemctl status nginx

# Verificar logs do nginx
sudo tail -f /var/log/nginx/dashboard-pmmt-error.log
```

#### **Erro de conexão com banco**
```bash
# Testar conectividade
telnet 172.16.74.224 5432

# Verificar configuração
cat app/config.py | grep DB_CONFIG
```

### **2. Comandos de Diagnóstico**
```bash
# Status dos serviços
sudo systemctl status nginx
sudo systemctl status dashboard-pmmt

# Verificar processos
ps aux | grep uvicorn
ps aux | grep nginx

# Verificar portas
sudo netstat -tlnp

# Verificar espaço em disco
df -h

# Verificar memória
free -h
```

---

## 🔄 **Manutenção**

### **1. Atualizações**
```bash
# Atualizar código
cd /var/www/dsh
git pull origin master

# Reinstalar dependências se necessário
./start_all.sh install

# Reiniciar serviços
./start_all.sh restart
```

### **2. Backup**
```bash
# Backup manual
./backup.sh

# Verificar backups
ls -la /var/backups/dashboard-pmmt/
```

### **3. Monitoramento**
```bash
# Verificar uso de recursos
htop

# Verificar logs em tempo real
tail -f logs/backend.log logs/frontend.log

# Verificar status dos serviços
./start_all.sh status
```

---

## 📊 **Monitoramento e Logs**

### **1. Logs Importantes**
- `/var/www/dsh/logs/backend.log` - Logs do backend
- `/var/www/dsh/logs/frontend.log` - Logs do frontend
- `/var/www/dsh/logs/startup.log` - Logs de inicialização
- `/var/log/nginx/dashboard-pmmt-access.log` - Acessos nginx
- `/var/log/nginx/dashboard-pmmt-error.log` - Erros nginx

### **2. Métricas de Performance**
```bash
# CPU e memória
top

# Uso de disco
df -h

# Processos
ps aux | grep -E "(uvicorn|nginx|node)"

# Conexões de rede
netstat -an | grep :80
netstat -an | grep :8000
```

---

## 🛡️ **Segurança**

### **1. Firewall**
```bash
# Verificar status
sudo ufw status

# Permitir apenas portas necessárias
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

### **2. Atualizações de Segurança**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade

# Verificar vulnerabilidades
sudo apt list --upgradable
```

### **3. Backup de Segurança**
```bash
# Backup da configuração
sudo tar -czf /var/backups/config_$(date +%Y%m%d).tar.gz /var/www/dsh/app/config.py

# Backup dos logs
sudo tar -czf /var/backups/logs_$(date +%Y%m%d).tar.gz /var/www/dsh/logs/
```

---

## ✅ **Checklist de Deploy**

### **Antes do Deploy**
- [ ] VM configurada com `setup_vm.sh`
- [ ] Código atualizado no repositório
- [ ] Configurações de ambiente preparadas
- [ ] Banco de dados acessível

### **Durante o Deploy**
- [ ] Upload do código realizado
- [ ] Dependências instaladas
- [ ] Configurações aplicadas
- [ ] Serviços iniciados
- [ ] Testes realizados

### **Após o Deploy**
- [ ] URLs acessíveis
- [ ] Logs sem erros
- [ ] Performance adequada
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

## 📞 **Suporte**

### **Comandos Úteis**
```bash
# Reiniciar tudo
./start_all.sh restart

# Ver logs em tempo real
tail -f logs/*.log

# Verificar status
./start_all.sh status

# Ajuda
./start_all.sh help
```

### **Contatos**
- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu-email@exemplo.com]
- **Documentação**: [Links do projeto]

---

**Boa sorte com o deploy! 🚀**
