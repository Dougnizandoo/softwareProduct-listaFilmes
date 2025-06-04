import { chamar_api } from "@/services/API/api";
import { useState, useEffect } from "react"
import Lista_Item from "./Lista_Item";


/**
 * Componente React que exibe uma barra de busca para filmes e séries.
 * 
 * Estados internos:
 * - `busca`: objeto contendo tipo (0=filme, 1=série), texto da pesquisa e página atual.
 * - `resultado`: array com os itens retornados da API.
 * - `carregando`: booleano que indica se a busca está em andamento.
 * - `pagina`: objeto com a página atual e o total de páginas.
 * 
 * Funcionalidades:
 * - Formulário de busca com select e input.
 * - Botões de navegação de páginas (anterior/próximo).
 * - Lista de resultados utilizando o componente <Lista_Item />.
 * - Indicador de carregamento.
 * 
 * @returns {JSX.Element} Interface da busca com paginação e resultados.
 */
export default function Busca(){
    const [busca, setBusca] = useState({
        "tipo": 0,
        "pesquisa": "",
        "pagina": 1
    })
    const [resultado, setResultado] = useState([]);
    const [carregando, setCarregando] = useState(null);
    const [pagina, setPagina] = useState({"pagina_inicial": 1, "total_paginas": 1});
    const [erroPg, setErroPg] = useState(false);


        // Limpa a mensagem de sucesso após 5 segundos
        useEffect(() => {
            if (erroPg){
                const timer = setTimeout(() => {
                    setErroPg(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [erroPg])


    // Define o objeto busca
    function handleChange(event){
        const {name, value} = event.target;
        setBusca((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Faz a chamada à API com os parâmetros atuais de busca
    async function ChamarApi(){
        setCarregando(true);
        let resp = await chamar_api(busca, 0, "GET", 2);
        setResultado(resp?.data?.busca);
        setPagina((prev) => ({
            ...prev,
            pagina_inicial: resp?.data?.pagina,
            total_paginas: resp?.data?.total_paginas
        }));
        setCarregando(false);
    }

    // Realiza a primeira busca (pela pesquisa do usuario).
    async function Barra_Busca(event){
        event.preventDefault();
        setBusca((prev) => ({ ...prev, pagina: 1 }));
        await ChamarApi();
    }

    // Atualiza a busca atualizando a pagina para a sucessora ou antecessora.
    async function alterar_pagina(event) {
        const {name} = event.target;
        if (name === 'btn-mais' && pagina.pagina_inicial < pagina.total_paginas){
            busca.pagina = pagina.pagina_inicial + 1;
            await ChamarApi();

        } else if (name === 'btn-menos' && pagina.pagina_inicial > 1){
            busca.pagina = pagina.pagina_inicial - 1;
            await ChamarApi();
        }

        else{
            setErroPg(true);
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
                    {erroPg && (
                        <div className="alert alert-danger text-center mb-3" role="alert">
                            Limite de páginas atingido!
                        </div>
                    )}
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
                    {erroPg && (
                        <div className="alert alert-danger text-center mt-3" role="alert">
                            Limite de páginas atingido!
                        </div>
                    )}
                </>
            )}

            {carregando === true && (
                <div className="d-flex justify-content-center align-items-center vh-50">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}