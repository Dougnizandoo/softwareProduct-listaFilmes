export async function chamar_api_usuario(usuario = {}, rota = "Login", method="POST"){
    const API_URL = 'http://localhost:2323/Usuario';
    try{
        const response = await fetch(`${API_URL}/${rota}` , {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: method === "GET" ? null : JSON.stringify(usuario)
        });

        let resposta;

        try {
            resposta = await response.json();
        } catch (jsonError) {
            console.log(response.status);
            return null
        }

        return resposta
    }catch (err){
        console.error('Erro ao consultar api: ' + err);
        return null;
    }
}


export async function chamar_api_busca(dados = {}, pagina = Number){
    const url = `http://localhost:2323/Busca/${dados.tipo}/${dados.pesquisa}/${pagina}`
    try{
        const response = await fetch(url, {
            method: "GET",
        })

    let resp = await response.json();
    return resp

    } catch (err){
        console.log(err);
        return null;
    }
}


export async function chamar_api_busca_id(code, tipo){
    const url = `http://localhost:2323/Busca/${tipo}/${code}`
    try{
        const response = await fetch(url, {
            method: "GET",
        })

    let resp = await response.json();
    return resp

    } catch (err){
        console.log(err);
        return null;
    }
}


export async function chamar_api_favorito(dados={}, rota="Read", method="GET") {
    const URL = 'http://localhost:2323/Favorito';
    let API_URL = `${URL}/${rota}`
    if (rota === 'Read') API_URL += `/${dados.user_id}`

    try{
        const response = await fetch(API_URL , {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: method === "GET" ? null : JSON.stringify(dados)
        });

        let resposta;

        try {
            resposta = await response.json();
        } catch (jsonError) {
            console.log(response.status);
            return null
        }

        return resposta
    }catch (err){
        console.error('Erro ao consultar api: ' + err);
        return null;
    }
}
