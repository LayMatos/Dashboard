import unicodedata

def remover_caracteres_especiais(texto: str) -> str:
    """Remove caracteres especiais (acentos, cedilhas) de uma string."""
    # Normaliza o texto para decompor os caracteres acentuados
    texto_normalizado = unicodedata.normalize('NFKD', texto)
    # Remove caracteres que não são ASCII (como acentos e cedilhas)
    return ''.join([c for c in texto_normalizado if unicodedata.category(c) != 'Mn']) 