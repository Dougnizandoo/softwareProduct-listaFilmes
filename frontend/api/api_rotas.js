export async function buscar_usuario(usuario) {
    const response = await fetch("http://localhost:2323/Usuario/Login", {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    const dados = await response.json();
    return dados
}


export async function adicionar_usuario(usuario) {
    const response = await fetch("http://localhost:2323/Usuario/Registro", {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    const dados = await response.json();
    return dados
}


export async function excluir_usuario(usuario) {
    const response = await fetch("http://localhost:2323/Usuario/Excluir", {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    const dados = await response.json();
    return dados
}
