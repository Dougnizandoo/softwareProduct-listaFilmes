from enum import Enum


class EnumGenero(Enum):
    """
        Enumeração que representa os gêneros de filmes e séries com base nos códigos oficiais da API TMDB.

        Esta enum é usada para mapear nomes legíveis de gêneros para seus respectivos identificadores inteiros fornecidos pela The Movie Database (TMDB).
        Pode ser usada para conversões entre IDs e nomes de gêneros ou para validação e tradução de dados recebidos da API.

        Gêneros:
            - Ação (28)
            - Aventura (12)
            - Animação (16)
            - Comédia (35)
            - Crime (80)
            - Documentário (99)
            - Drama (18)
            - Família (10751)
            - Fantasia (14)
            - História (36)
            - Terror (27)
            - Música (10402)
            - Mistério (9648)
            - Romance (10749)
            - Ficção_Científica (878)
            - Cinema_TV (10770)
            - Thriller (53)
            - Guerra (10752)
            - Faroeste (37)
            - Ação_Aventura (10759)
            - Criaça (10762)
            - News (10463)
            - Reality (10764)
            - Sci_Fi__Fantasia (10765)
            - Novela (10766)
            - Conversa (10767)
            - Guerra__Politica (10768)

        Obs:
            - Os nomes seguem o padrão de escrita com acentuação e underscore `_` para casos em que o nome oficial do gênero contém espaços.
    """
    Ação = 28
    Aventura = 12
    Animação = 16
    Comédia = 35
    Crime = 80
    Documentário = 99
    Drama = 18
    Família = 10751
    Fantasia = 14
    História = 36
    Terror = 27
    Música = 10402
    Mistério = 9648
    Romance = 10749
    Ficção_Científica = 878
    Cinema_TV = 10770
    Thriller = 53
    Guerra = 10752
    Faroeste = 37
    # Series
    Ação_Aventura = 10759
    Criaça = 10762
    News = 10463
    Reality = 10764
    Sci_Fi__Fantasia = 10765
    Novela = 10766
    Conversa = 10767
    Guerra__Politica = 10768
