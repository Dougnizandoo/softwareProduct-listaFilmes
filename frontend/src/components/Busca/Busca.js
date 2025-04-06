import { chamar_api_busca } from "@/services/API/api";
import { useState } from "react"
import Lista_Item from "./Lista_Item";


export default function Busca(){
    const [busca, setBusca] = useState({
        "tipo": 0,
        "pesquisa": ""
    })
    const [resultado, setResultado] = useState([]);
    const [carregando, setCarregando] = useState(null);
    const [pagina, setPagina] = useState({"pagina_inicial": 1, "total_paginas": 1});


    function handleChange(event){
        const {name, value} = event.target;
        setBusca((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    async function ChamarApi(){
        setCarregando(true);
        let resp = await chamar_api_busca(busca, pagina.pagina_inicial);
        setResultado(resp?.data?.busca);
        setPagina((prev) => ({
            ...prev,
            pagina_inicial: resp?.data?.pagina,
            total_paginas: resp?.data?.total_paginas
        }));
        setCarregando(false);
    }


    async function Barra_Busca(event){
        event.preventDefault();
        pagina.pagina_inicial = 1;
        await ChamarApi();
    }


    async function alterar_pagina(event) {
        const {name} = event.target;
        if (name === 'btn-mais' && pagina.pagina_inicial < pagina.total_paginas){
            pagina.pagina_inicial = pagina.pagina_inicial + 1;
            await ChamarApi();

        } else if (name === 'btn-menos' && pagina.pagina_inicial > 1){
            pagina.pagina_inicial = pagina.pagina_inicial - 1;
            await ChamarApi();
        }

        else{
            alert("Limite de paginas atingido!")
        }
    }


    return(
        <div className="container mt-4">
            {/* Barra de Pesquisa */}
            <form onSubmit={Barra_Busca}>
                <div className="input-group mb-3">
                    {/* Select dentro da barra */}
                    <select
                        className="form-select"
                        name="tipo"
                        onChange={handleChange}
                        style={{ maxWidth: "120px" }}
                    >
                        <option value={0}>Filme</option>
                        <option value={1}>Série</option>
                    </select>

                    {/* Input de pesquisa */}
                    <input
                        type="text"
                        name="pesquisa"
                        className="form-control"
                        placeholder="O que você gostaria de ver..."
                        onChange={handleChange}
                        autoFocus
                    />

                    {/* Botão de pesquisa no final */}
                    <button className="btn btn-primary" name="btn-pesquisar">
                        Pesquisar
                    </button>
                </div>
            </form>

            <hr />

            {/* Resultados da busca */}
            {carregando === false && resultado?.length > 0 && (
                <>
                    {/* Botões de navegação */}
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <button
                            className="btn btn-outline-secondary mx-2"
                            onClick={alterar_pagina}
                            name="btn-menos"
                        >
                            ← Anterior
                        </button>
                        <span className="mx-2">
                            Página {pagina.pagina_inicial} de {pagina.total_paginas}
                        </span>
                        <button
                            className="btn btn-outline-secondary mx-2"
                            onClick={alterar_pagina}
                            name="btn-mais"
                        >
                            Próximo →
                        </button>
                    </div>

                    <Lista_Item dados={resultado} />

                    {/* Botões de navegação */}
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <button
                            className="btn btn-outline-secondary mx-2"
                            onClick={alterar_pagina}
                            name="btn-menos"
                        >
                            ← Anterior
                        </button>
                        <span className="mx-2">
                            Página {pagina.pagina_inicial} de {pagina.total_paginas}
                        </span>
                        <button
                            className="btn btn-outline-secondary mx-2"
                            onClick={alterar_pagina}
                            name="btn-mais"
                        >
                            Próximo →
                        </button>
                    </div>
                </>
            )}

            {carregando === true && <p className="text-center">Carregando...</p>}
        </div>
    )
}