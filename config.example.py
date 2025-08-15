# ===========================================
# Dashboard PMMT - Configuration Template
# ===========================================

import os
from typing import List

# ===========================================
# Database Configuration
# ===========================================

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "172.16.74.224"),
    "database": os.getenv("DB_NAME", "PMMT"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "m4stervi4@2009"),
    "port": int(os.getenv("DB_PORT", "5432"))
}

# ===========================================
# API Configuration
# ===========================================

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_RELOAD = os.getenv("API_RELOAD", "true").lower() == "true"
API_LOG_LEVEL = os.getenv("API_LOG_LEVEL", "info")

# ===========================================
# CORS Configuration
# ===========================================

# Allowed origins for CORS
CORS_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# Add custom origins from environment variable
custom_origins = os.getenv("CORS_ORIGINS", "")
if custom_origins:
    CORS_ORIGINS.extend([origin.strip() for origin in custom_origins.split(",")])

# ===========================================
# Security Configuration
# ===========================================

# JWT Settings (if using authentication)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# ===========================================
# Logging Configuration
# ===========================================

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "app.log")

# ===========================================
# Development Settings
# ===========================================

DEBUG = os.getenv("DEBUG", "true").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ===========================================
# External Services Configuration
# ===========================================

# Email Configuration
SMTP_CONFIG = {
    "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
    "port": int(os.getenv("SMTP_PORT", "587")),
    "user": os.getenv("SMTP_USER", ""),
    "password": os.getenv("SMTP_PASSWORD", "")
}

# ===========================================
# Monitoring Configuration
# ===========================================

# Sentry Configuration
SENTRY_DSN = os.getenv("SENTRY_DSN", "")

# ===========================================
# Application Settings
# ===========================================

# Application metadata
APP_NAME = "Dashboard PMMT"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Dashboard para Polícia Militar de Mato Grosso"

# ===========================================
# Instructions
# ===========================================

"""
INSTRUCTIONS:

1. Copy this file to app/config.py
2. Update the values according to your environment
3. Never commit the actual config.py file to version control
4. Keep sensitive information secure

Example:
    cp config.example.py app/config.py
    nano app/config.py

For production:
    - Set DEBUG=False
    - Use strong JWT_SECRET_KEY
    - Configure proper CORS_ORIGINS
    - Use environment variables for all sensitive data
"""
