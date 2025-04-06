from app.models import EnumGenero as Genero


def ConverterGenero(dici: dict, genero_dici: bool = False) -> dict:
    """
        -> Metodo para converter a chave 'genero' do dicionario

        Args:
            dici (dict): dicionario com a chave 'genero presente'.
            genero_dici (bool, opcional): verifica se a chave genero é um dicionario, padrão é false, true se for um dicionario.
        Returns:
            dict: retorna um dicionario com os campos convertidos.
    """
    genero_formatado = []
    if not genero_dici:
        for gen in dici['genero']:
            novo_gen = Genero(gen).name.replace('__', ' & ').replace('_', ' ')
            genero_formatado.append(novo_gen)

    else:
        for gen in dici['genero']: 
            for chave in gen:
                if chave == 'id':
                    novo_gen = Genero(gen[chave]).name.replace('__', ' & ').replace('_', ' ')
                    genero_formatado.append(novo_gen)

    dici['genero'] = genero_formatado
    return dici
