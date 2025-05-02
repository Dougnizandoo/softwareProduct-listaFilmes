/**
    * Função para realizar chamadas HTTP à API do backend.
    * Permite realizar operações de leitura, criação e exclusão em múltiplos canais de dados.
    *
    * @param {Object} dados - Objeto contendo os dados que serão enviados na requisição (body ou parâmetros de rota).
    * @param {number} rota - Índice da ação desejada: 
    *   0 = Read (GET), 
    *   1 = Create (POST), 
    *   2 = Delete (DELETE)
    * @param {string} method - Método HTTP da requisição (GET, POST, DELETE). Padrão é "GET".
    * @param {number} canal - Índice do canal de comunicação:
    *   0 = Usuario,
    *   1 = Favorito,
    *   2 = Busca1 (usa tipo, pesquisa e pagina),
    *   3 = Busca2 (usa tipo e code),
    *   4 = Listas,
    *   5 = Listas Registro
    * 
    * @returns {Object|null} - Retorna o resultado da API como objeto JSON, ou null em caso de erro.
    *
    * Exemplo de uso:
    * const resposta = await chamar_api({ tipo: 0, pesquisa: "batman", pagina: 1 }, 0, "GET", 2);
*/
export async function chamar_api(dados={}, rota=0, method="GET", canal=0) {
    const rotas = ['Read', 'Create', 'Delete'];
    const canais = ['Usuario', 'Favorito', 'Busca1', 'Busca2', 'Listas', 'Listas/Registro'];

    if (rota < 0 || rota > rotas.length){
        console.error("Numero de rota invalido!");
        return null;
    }

    if (canal < 0 || canal > canais.length){
        console.error("Numero do canal invalido!");
        return null;
    }

    let url = 'http://localhost:2323';
    switch (canal){
        case 2: // busca1
            url += `/Busca/${dados.tipo}/${dados.pesquisa}/${dados.pagina}`;
            break;

        case 3: // busca2
            url += `/Busca/${dados.tipo}/${dados.code}`;
            break;

        default:
            url += `/${canais[canal]}/${rotas[rota]}`
            if (rota === 0 && canal !== 0 ){
                url += `/${dados.code}`;
            };
            break;
    };


    try{
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: method === "GET" ? null : JSON.stringify(dados)
        });

        let resposta = await response.json();
        return resposta
    } catch (err){
        console.error('Erro ao consultar api: ' + err);
        return null;
    }
}