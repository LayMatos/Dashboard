#!/bin/bash

# ===========================================
# Dashboard PMMT - Script de Configuração da VM
# ===========================================

# Configurações
PROJECT_DIR="/var/www/dsh"
VENV_PATH="$PROJECT_DIR/venv"

# Função para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para instalar dependências do sistema
install_system_deps() {
    log "Instalando dependências do sistema..."
    
    # Atualizar repositórios
    sudo apt update
    
    # Instalar Python e ferramentas
    sudo apt install -y python3 python3-pip python3-venv
    
    # Instalar Node.js (versão LTS)
    if ! command_exists node; then
        log "Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    
    # Instalar nginx (opcional, para servir arquivos estáticos)
    sudo apt install -y nginx
    
    # Instalar ferramentas úteis
    sudo apt install -y git curl wget htop
    
    log "Dependências do sistema instaladas"
}

# Função para configurar diretórios
setup_directories() {
    log "Configurando diretórios..."
    
    # Criar diretório do projeto se não existir
    sudo mkdir -p $PROJECT_DIR
    
    # Definir permissões
    sudo chown -R $USER:$USER $PROJECT_DIR
    sudo chmod -R 755 $PROJECT_DIR
    
    # Criar diretório de logs
    mkdir -p $PROJECT_DIR/logs
    
    log "Diretórios configurados"
}

# Função para configurar virtual environment
setup_virtual_environment() {
    log "Configurando virtual environment..."
    
    cd $PROJECT_DIR
    
    # Criar virtual environment se não existir
    if [ ! -d "$VENV_PATH" ]; then
        python3 -m venv venv
        log "Virtual environment criado"
    else
        log "Virtual environment já existe"
    fi
    
    # Ativar virtual environment
    source $VENV_PATH/bin/activate
    
    # Atualizar pip
    pip install --upgrade pip
    
    log "Virtual environment configurado"
}

# Função para configurar nginx
setup_nginx() {
    log "Configurando nginx..."
    
    # Criar configuração do nginx
    sudo tee /etc/nginx/sites-available/dashboard-pmmt > /dev/null <<EOF
server {
    listen 80;
    server_name localhost;
    
    # Frontend (arquivos estáticos)
    location / {
        root /var/www/dsh/build;
        try_files \$uri \$uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API (proxy para backend)
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Documentação da API
    location /docs {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Logs
    access_log /var/log/nginx/dashboard-pmmt-access.log;
    error_log /var/log/nginx/dashboard-pmmt-error.log;
}
EOF
    
    # Habilitar o site
    sudo ln -sf /etc/nginx/sites-available/dashboard-pmmt /etc/nginx/sites-enabled/
    
    # Remover configuração padrão
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        # Reiniciar nginx
        sudo systemctl restart nginx
        sudo systemctl enable nginx
        log "Nginx configurado e iniciado"
    else
        log "ERRO: Configuração do nginx inválida"
        exit 1
    fi
}

# Função para configurar firewall
setup_firewall() {
    log "Configurando firewall..."
    
    # Permitir SSH
    sudo ufw allow ssh
    
    # Permitir HTTP e HTTPS
    sudo ufw allow 80
    sudo ufw allow 443
    
    # Habilitar firewall
    sudo ufw --force enable
    
    log "Firewall configurado"
}

# Função para configurar systemd service
setup_systemd_service() {
    log "Configurando systemd service..."
    
    # Criar arquivo de serviço
    sudo tee /etc/systemd/system/dashboard-pmmt.service > /dev/null <<EOF
[Unit]
Description=Dashboard PMMT Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR/app
Environment=PATH=$PROJECT_DIR/venv/bin
ExecStart=$PROJECT_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Recarregar systemd
    sudo systemctl daemon-reload
    
    # Habilitar serviço
    sudo systemctl enable dashboard-pmmt
    
    log "Systemd service configurado"
}

# Função para configurar cron jobs
setup_cron() {
    log "Configurando cron jobs..."
    
    # Criar script de backup
    cat > $PROJECT_DIR/backup.sh <<EOF
#!/bin/bash
# Backup do projeto Dashboard PMMT

BACKUP_DIR="/var/backups/dashboard-pmmt"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup dos logs
tar -czf \$BACKUP_DIR/logs_\$DATE.tar.gz -C $PROJECT_DIR logs/

# Backup da configuração
tar -czf \$BACKUP_DIR/config_\$DATE.tar.gz -C $PROJECT_DIR app/config.py

# Manter apenas os últimos 7 backups
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup realizado: \$DATE"
EOF
    
    chmod +x $PROJECT_DIR/backup.sh
    
    # Adicionar ao crontab (backup diário às 2h da manhã)
    (crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/backup.sh") | crontab -
    
    log "Cron jobs configurados"
}

# Função para mostrar informações finais
show_final_info() {
    log "=== CONFIGURAÇÃO CONCLUÍDA ==="
    echo ""
    echo "🎉 Configuração da VM concluída com sucesso!"
    echo ""
    echo "📁 Diretório do projeto: $PROJECT_DIR"
    echo "🐍 Virtual environment: $VENV_PATH"
    echo "📝 Logs: $PROJECT_DIR/logs/"
    echo ""
    echo "🌐 URLs:"
    echo "   Frontend: http://localhost"
    echo "   API: http://localhost/api"
    echo "   Documentação: http://localhost/docs"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Status: $PROJECT_DIR/start_all.sh status"
    echo "   Iniciar: $PROJECT_DIR/start_all.sh start"
    echo "   Parar: $PROJECT_DIR/start_all.sh stop"
    echo "   Reiniciar: $PROJECT_DIR/start_all.sh restart"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Fazer upload do código para $PROJECT_DIR"
    echo "2. Executar: $PROJECT_DIR/start_all.sh install"
    echo "3. Executar: $PROJECT_DIR/start_all.sh start"
    echo ""
}

# Função principal
main() {
    log "=== INICIANDO CONFIGURAÇÃO DA VM ==="
    
    # Verificar se está rodando como root
    if [ "$EUID" -eq 0 ]; then
        echo "ERRO: Não execute este script como root"
        echo "Execute como usuário normal: ./setup_vm.sh"
        exit 1
    fi
    
    # Instalar dependências do sistema
    install_system_deps
    
    # Configurar diretórios
    setup_directories
    
    # Configurar virtual environment
    setup_virtual_environment
    
    # Configurar nginx
    setup_nginx
    
    # Configurar firewall
    setup_firewall
    
    # Configurar systemd service
    setup_systemd_service
    
    # Configurar cron jobs
    setup_cron
    
    # Mostrar informações finais
    show_final_info
    
    log "=== CONFIGURAÇÃO CONCLUÍDA ==="
}

# Executar função principal
main "$@"
