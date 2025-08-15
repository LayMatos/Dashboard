import unicodedata
import re

def remover_caracteres_especiais(texto: str) -> str:
    """Remove caracteres especiais (acentos, cedilhas) de uma string."""
    # Normaliza o texto para decompor os caracteres acentuados
    texto_normalizado = unicodedata.normalize('NFKD', texto)
    # Remove caracteres que não são ASCII (como acentos e cedilhas)
    return ''.join([c for c in texto_normalizado if unicodedata.category(c) != 'Mn'])

def normalizar_nome_cidade(cidade: str) -> str:
    """
    Normaliza o nome de uma cidade para busca no banco de dados.
    Remove pontuação, normaliza espaços e trata variações comuns.
    """
    if not cidade:
        return ""
    
    # Converte para maiúsculas e remove espaços extras
    cidade = cidade.upper().strip()
    
    # Normaliza espaços múltiplos
    cidade = re.sub(r'\s+', ' ', cidade)
    
    return cidade.strip()

def normalizar_nome_cidade_sem_pontuacao(cidade: str) -> str:
    """
    Normaliza o nome de uma cidade removendo pontuação para busca flexível.
    """
    if not cidade:
        return ""
    
    # Converte para maiúsculas e remove espaços extras
    cidade = cidade.upper().strip()
    
    # Remove pontuação (apóstrofos, hífens, pontos, etc.)
    cidade = re.sub(r'[^\w\s]', '', cidade)
    
    # Normaliza espaços múltiplos
    cidade = re.sub(r'\s+', ' ', cidade)
    
    # Trata variações comuns
    cidade = cidade.replace("DO OESTE", "DOESTE")
    cidade = cidade.replace("D OESTE", "DOESTE")
    cidade = cidade.replace("DA PRAIA", "DAPRAIA")
    cidade = cidade.replace("D PRAIA", "DAPRAIA")
    cidade = cidade.replace("DE GOIAS", "DEGOIAS")
    cidade = cidade.replace("D GOIAS", "DEGOIAS")
    
    return cidade.strip()

def normalizar_nome_cidade_sem_acentos(cidade: str) -> str:
    """
    Normaliza o nome de uma cidade removendo acentos para busca flexível.
    """
    if not cidade:
        return ""
    
    # Converte para maiúsculas e remove espaços extras
    cidade = cidade.upper().strip()
    
    # Remove acentos usando unicodedata
    cidade_sem_acentos = remover_caracteres_especiais(cidade)
    
    # Normaliza espaços múltiplos
    cidade_sem_acentos = re.sub(r'\s+', ' ', cidade_sem_acentos)
    
    return cidade_sem_acentos.strip()

def normalizar_nome_cidade_completa(cidade: str) -> str:
    """
    Normaliza o nome de uma cidade removendo acentos e pontuação para busca flexível.
    """
    if not cidade:
        return ""
    
    # Converte para maiúsculas e remove espaços extras
    cidade = cidade.upper().strip()
    
    # Remove acentos
    cidade = remover_caracteres_especiais(cidade)
    
    # Remove pontuação
    cidade = re.sub(r'[^\w\s]', '', cidade)
    
    # Normaliza espaços múltiplos
    cidade = re.sub(r'\s+', ' ', cidade)
    
    # Trata variações comuns
    cidade = cidade.replace("DO OESTE", "DOESTE")
    cidade = cidade.replace("D OESTE", "DOESTE")
    cidade = cidade.replace("DA PRAIA", "DAPRAIA")
    cidade = cidade.replace("D PRAIA", "DAPRAIA")
    cidade = cidade.replace("DE GOIAS", "DEGOIAS")
    cidade = cidade.replace("D GOIAS", "DEGOIAS")
    
    # Trata variações comuns de nomes de cidades
    cidade = cidade.replace("POXOREU", "POXOREO")  # Poxoréu -> Poxoreo
    cidade = cidade.replace("CUIABA", "CUIABÁ")    # Cuiaba -> Cuiabá
    cidade = cidade.replace("VARZEA", "VÁRZEA")    # Varzea -> Várzea
    
    return cidade.strip()

def gerar_padroes_busca_cidade(cidade: str) -> list:
    """
    Gera uma lista de padrões de busca para uma cidade,
    considerando variações com pontuação, acentos e sem pontuação.
    """
    if not cidade:
        return []
    
    padroes = []
    
    # Padrão original (mantém apóstrofos, pontuação e acentos)
    cidade_original = cidade.upper().strip()
    padroes.append(cidade_original)
    
    # Padrão sem acentos (mantém pontuação)
    cidade_sem_acentos = normalizar_nome_cidade_sem_acentos(cidade)
    padroes.append(cidade_sem_acentos)
    
    # Padrão normalizado (sem pontuação, mantém acentos)
    cidade_norm = normalizar_nome_cidade_sem_pontuacao(cidade)
    padroes.append(cidade_norm)
    
    # Padrão completamente normalizado (sem acentos e sem pontuação)
    cidade_completa = normalizar_nome_cidade_completa(cidade)
    padroes.append(cidade_completa)
    
    # Se contém "D'OESTE", criar variações
    if "D'OESTE" in cidade_original:
        nome_base = cidade_original.replace("D'OESTE", "").strip()
        padroes.extend([
            f"{nome_base} D'OESTE",
            f"{nome_base} DO OESTE",
            f"{nome_base} D OESTE",
            f"{nome_base}%OESTE"
        ])
    
    # Se contém "DO OESTE", criar variações
    elif "DO OESTE" in cidade_original:
        nome_base = cidade_original.replace("DO OESTE", "").strip()
        padroes.extend([
            f"{nome_base} DO OESTE",
            f"{nome_base} D'OESTE",
            f"{nome_base} D OESTE",
            f"{nome_base}%OESTE"
        ])
    
    # Se contém "DA PRAIA", criar variações
    elif "DA PRAIA" in cidade_original:
        nome_base = cidade_original.replace("DA PRAIA", "").strip()
        padroes.extend([
            f"{nome_base} DA PRAIA",
            f"{nome_base} D PRAIA",
            f"{nome_base}%PRAIA"
        ])
    
    # Se contém "DE GOIAS", criar variações
    elif "DE GOIAS" in cidade_original:
        nome_base = cidade_original.replace("DE GOIAS", "").strip()
        padroes.extend([
            f"{nome_base} DE GOIAS",
            f"{nome_base} D GOIAS",
            f"{nome_base}%GOIAS"
        ])
    
    # Se contém "POXORÉU", criar variações
    elif "POXORÉU" in cidade_original:
        padroes.extend([
            "POXOREO",
            "POXORÉU",
            "%POXOR%"
        ])
    
    # Se contém "POXOREU", criar variações
    elif "POXOREU" in cidade_original:
        padroes.extend([
            "POXOREO",
            "POXORÉU",
            "%POXOR%"
        ])
    
    # Padrões com wildcard para busca flexível
    padroes.extend([
        f"%{cidade_original}%",      # Com acentos e pontuação
        f"%{cidade_sem_acentos}%",   # Sem acentos, com pontuação
        f"%{cidade_norm}%",          # Com acentos, sem pontuação
        f"%{cidade_completa}%"       # Sem acentos e sem pontuação
    ])
    
    # Remove duplicatas mantendo a ordem
    padroes_unicos = []
    for padrao in padroes:
        if padrao not in padroes_unicos:
            padroes_unicos.append(padrao)
    
    return padroes_unicos 