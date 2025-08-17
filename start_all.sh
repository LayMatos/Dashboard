#!/bin/bash

# ===========================================
# Dashboard PMMT - Script de Inicialização
# ===========================================

PROJECT_DIR="/var/www/dsh"
BACKEND_DIR="$PROJECT_DIR/app"
FRONTEND_DIR="$PROJECT_DIR"
VENV_PATH="$PROJECT_DIR/venv/bin/activate"
LOG_DIR="$PROJECT_DIR/logs"

mkdir -p $LOG_DIR

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_DIR/startup.log
}

is_running() {
    pgrep -f "$1" > /dev/null
}

stop_existing_processes() {
    log "Verificando processos existentes..."

    if is_running "uvicorn.*app.main:app"; then
        log "Parando backend existente..."
        pkill -f "uvicorn.*app.main:app"
        sleep 2
    fi

    if is_running "serve.*build"; then
        log "Parando frontend existente..."
        pkill -f "serve.*build"
        sleep 2
    fi
}

check_dependencies() {
    log "Verificando dependências..."

    if [ ! -f "$VENV_PATH" ]; then
        log "ERRO: Virtual environment não encontrado em $VENV_PATH"
        exit 1
    fi

    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        log "ERRO: node_modules não encontrado"
        exit 1
    fi

    if [ ! -f "$PROJECT_DIR/requirements.txt" ]; then
        log "ERRO: requirements.txt não encontrado"
        exit 1
    fi

    log "Dependências verificadas com sucesso"
}

install_python_deps() {
    log "Instalando/atualizando dependências Python..."
    source $VENV_PATH
    pip install -r $PROJECT_DIR/requirements.txt
    log "Dependências Python instaladas"
}

install_node_deps() {
    log "Instalando/atualizando dependências Node.js..."
    cd $FRONTEND_DIR
    npm install
    log "Dependências Node.js instaladas"
}

start_backend() {
    log "Iniciando backend..."
    cd $PROJECT_DIR
    source $VENV_PATH

    nohup uvicorn app.main:app --host 172.16.10.54 --port 8000 --reload > $LOG_DIR/backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 3

    if is_running "uvicorn.*app.main:app"; then
        log "Backend iniciado (PID: $BACKEND_PID) - http://172.16.10.54:8000"
    else
        log "ERRO: Falha ao iniciar o backend"
        exit 1
    fi
}

build_frontend() {
    log "Construindo frontend para produção..."
    cd $FRONTEND_DIR

    if [ ! -f "package.json" ]; then
        log "ERRO: package.json não encontrado"
        exit 1
    fi

    npm run build
    if [ $? -eq 0 ]; then
        log "Frontend construído com sucesso"
    else
        log "ERRO: Falha ao construir o frontend"
        exit 1
    fi
}

start_frontend() {
    log "Iniciando frontend..."
    cd $FRONTEND_DIR

    if command -v serve &> /dev/null; then
        nohup serve -s build -l 3000 > $LOG_DIR/frontend.log 2>&1 &
        FRONTEND_PID=$!
        log "Frontend iniciado (PID: $FRONTEND_PID) - http://172.16.10.54:3000"
    else
        log "AVISO: 'serve' não encontrado. Instale com: npm install -g serve"
    fi
}

show_status() {
    log "=== STATUS DOS SERVIÇOS ==="
    if is_running "uvicorn.*app.main:app"; then
        log "? Backend rodando - http://172.16.10.54:8000"
    else
        log "? Backend parado"
    fi

    if is_running "serve.*build"; then
        log "? Frontend rodando - http://172.16.10.54:3000"
    else
        log "? Frontend parado"
    fi
    log "=== LOGS ==="
    log "Backend: $LOG_DIR/backend.log"
    log "Frontend: $LOG_DIR/frontend.log"
    log "Startup: $LOG_DIR/startup.log"
}

stop_all() {
    log "Parando todos os serviços..."
    if is_running "uvicorn.*app.main:app"; then
        pkill -f "uvicorn.*app.main:app"
        log "Backend parado"
    fi
    if is_running "serve.*build"; then
        pkill -f "serve.*build"
        log "Frontend parado"
    fi
    log "Todos os serviços parados"
}

main() {
    case "${1:-start}" in
        start)
            log "=== INICIANDO DASHBOARD PMMT ==="
            stop_existing_processes
            check_dependencies
            install_python_deps
            install_node_deps
            start_backend
            build_frontend
            start_frontend
            show_status
            log "=== DASHBOARD PMMT INICIADO ==="
            ;;
        stop)
            stop_all
            ;;
        restart)
            stop_all
            sleep 2
            $0 start
            ;;
        status)
            show_status
            ;;
        build)
            build_frontend
            ;;
        install)
            check_dependencies
            install_python_deps
            install_node_deps
            ;;
        help|--help|-h)
            echo "Uso: $0 [start|stop|restart|status|build|install]"
            ;;
        *)
            echo "Comando inválido: $1"
            exit 1
            ;;
    esac
}

main "$@"
