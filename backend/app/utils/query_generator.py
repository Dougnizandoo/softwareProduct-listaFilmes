# Create
def query_create(table_name: str, colunas_retorno: list | tuple) -> str:
    """
        Gera uma query SQL de inserção (INSERT) com placeholders para valores (%s).

        Args:
            table_name (str): Nome da tabela no banco de dados.
            colunas_retorno (list | tuple): Lista ou tupla com os nomes das colunas onde os dados serão inseridos.
        Returns:
            str: Query SQL do tipo INSERT com placeholders para os valores.
    """
    colunas = _format_keys(colunas_retorno, True)
    valores = ", ".join(["%s"] * len(colunas_retorno))
    query = f'INSERT INTO impacta.{table_name} ({colunas}) VALUES ({valores});'
    return query


# Read
def query_read(table_name: str, campos_busca: list | tuple, colunas_retorno: list | tuple = ()) -> str:
    """
        Gera uma query SQL de leitura (SELECT) com cláusula WHERE baseada nas chaves fornecidas.

        Args:
            table_name (str): Nome da tabela no banco de dados.
            campos_busca (list | tuple): Lista ou tupla com os nomes das colunas a serem usadas como filtro na cláusula WHERE.
            colunas_retorno (list | tuple, opcional): Lista ou tupla com os nomes das colunas que devem ser retornadas. Se não for informado, retornará todas (*).
        Returns:
            str: Query SQL do tipo SELECT com cláusula WHERE.
    """
    colunas = _format_keys(colunas_retorno, True) if colunas_retorno else '*'
    busca = _format_keys(campos_busca)
    query = f"SELECT {colunas} FROM impacta.{table_name} WHERE {busca};"
    return query


# Delete
def query_delete(table_name: str, campos_busca: list | tuple) -> str:
    """
        Gera uma query SQL de remoção (DELETE) com cláusula WHERE baseada nas chaves fornecidas.

        Args:
            table_name (str): Nome da tabela no banco de dados.
            campos_busca (list | tuple): Lista ou tupla com os nomes das colunas a serem usadas como filtro na cláusula WHERE.
        Returns:
            str: Query SQL do tipo DELETE com cláusula WHERE.
    """
    busca = _format_keys(campos_busca)
    query = f"DELETE FROM impacta.{table_name} WHERE {busca};"
    return query


def _format_keys(chaves: list | tuple, only_comma=False) -> str:
    """
        Formata uma lista de chaves para uso em queries SQL.

        Args:
            chaves (list | tuple): Lista ou tupla de strings representando os nomes das colunas.
            only_comma (bool): Se True, retorna as chaves separadas por vírgula (para uso em INSERT e SELECT). Se False, retorna como expressões `coluna=%s` separadas por AND (para WHERE).

        Returns:
            str: String formatada para uso em query SQL.
    """
    if not isinstance(chaves, (list, tuple)):
        chaves = [chaves]
    if only_comma:
        return ', '.join(chaves)
    return ' AND '.join(f"{key}=%s" for key in chaves)
