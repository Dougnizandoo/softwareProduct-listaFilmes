import { chamar_api } from "@/services/API/api.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/SEO.js";
import Item from "@/components/Busca/Item";
import Link from "next/link";


/**
 * Componente React para exibir uma lista de mídias (filmes ou séries) de um usuário ou lista específica.
 * 
 * Funcionalidades:
 * - Busca os dados da lista via API com base no header fornecido.
 * - Exibe itens da lista com possibilidade de remoção individual (se o usuário for proprietário).
 * - Permite exclusão completa da lista (se o usuário for proprietário).
 * - Mostra mensagens de carregamento e lista vazia.
 * - Utiliza componentes SEO e Item para exibição.
 * 
 * Props:
 * @param {Object} header - Objeto contendo informações necessárias para a requisição da lista.
 * @param {number} header.canal - Indica o tipo da lista (ex: 1 para favoritos, 4 para listas personalizadas).
 * @param {string} header.code - Código identificador da lista/usuário.
 * @param {string} header.user_id - ID do usuário dono da lista.
 * @param {string} header.table_nome - Nome da lista (exibido no título).
 * 
 * Estados internos:
 * @state {Array} colecao - Lista de mídias obtidas da API.
 * @state {boolean} owner - Indica se o usuário atual é dono da lista (permite ações extras).
 * @state {string} listName - Nome da lista para exibição.
 * @state {boolean} load - Indica se os dados já foram carregados.
 * @state {boolean} deletando - Controla o estado de exclusão para desabilitar botões.
 * @state {string} code - Código de identificação para requisições.
 * 
 * 
 * @returns {JSX.Element} Elemento React que exibe a listagem com controles de exclusão e mensagens de estado.
 */
export default function Listagem({header}){
    const router = useRouter();
    const [colecao, setColecao] = useState([]);
    const [owner, setOwner] = useState(true);
    const [listName, setListName] = useState('');
    const [load, setLoad] = useState(false);
    const [deletando, setDeletando] = useState(false);
    const [code, setCode] = useState('');


    // Realiza a aquisição inicial na API
    useEffect(() => {
        setCode(header.code);
        if (header.canal === 5 && code === ''){
            header.code += `/${header.user_id}`;
        }
        
        ChamarApi();
    }, [])


    // Consulta a API e define: colecao, owner e listName. Caso ocorra algum erro na consulta, retorna a pagina inicial
    async function ChamarApi(){
        const resp = await chamar_api(header, 0, "GET", header.canal)
        console.log(header)
        if (resp){
            if (resp.data !== null){
                console.log(resp.data)
                if (header.canal === 5){
                    setColecao(resp.data.lista_registro);
                    setOwner(resp.data.lista_usuario);
                    setListName(resp.data.table_nome);
                }else {
                    setColecao(resp.data);
                }
                
            }else { 
                setColecao(false);
                setOwner(false);
                setListName("Erro") 
            }
            setLoad(true);
        }
        else {
            alert("Erro ao consultar API!\nVoltando a pagina inicial!");
            router.push("/");
        }
    }

    // exclui um filme ou uma serie da lista.
    async function ExcluirItem(event){
        event.preventDefault();
        setDeletando(true);
        const formData = new FormData(event.target);
        let dici;
        const confirm = window.confirm(`Deseja excluir '${formData.get("itemNome")}' da lista ?`);

        if (confirm){
            if (header.canal === 1){
                dici = {"user_id": header.code, "tmdb_id": formData.get("itemId")}
            } else {
                dici = {"table_id": code, "tmdb_id": formData.get("itemId")}
            }

            const resp = await chamar_api(dici, 2, "DELETE", header.canal);
            if (resp){
                if (resp.status === "success"){
                    alert("Midia Removida com sucesso!");
                    await ChamarApi();
                } else {
                    alert(`Erro ao excluir midia!\n${resp.message}\n${resp.errors}`)
                }

            }else {
                alert("Erro ao chamar api!")
                router.replace("/");
            }
        }
        setDeletando(false);
    }


    // Realiza a exclusão da lista
    async function excluirLista(event) {
        event.preventDefault();
        const confirmar = window.confirm("Tem certeza que deseja excluir essa lista?");
        
        if (confirmar) {
            let dici = {
                "user_id": header.user_id,
                "table_id": code
            }

            const resp = await chamar_api(dici, 2, "DELETE", 4);
            if (resp){
                if (resp.status === "success"){
                    alert("Lista foi excluida!");
                    router.replace("/Listas");
                }else {
                    alert("Erro ao excluir lista!");
                    console.error(resp.errors, resp.message);
                }
            }
        }
    }


    return (
        <>
            {!load && (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p>Buscando dados...</p>
                    </div>
                </div>
            )}
            {load && (
                <div className="container mt-4">
                    <SEO titulo={listName} descricao={`Pagina de listagem da lista ${listName}`}/>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="m-0">{header.canal === 1 ? ("Meus Favoritos") : (listName)}</h2>
                        {header.canal !== 1 && owner === true && (
                            <form onSubmit={excluirLista}>
                                <button className="btn btn-danger">🗑️ Excluir Lista</button>
                            </form>
                        )}
                    </div>
                    <hr className="bg-light" />

                    {colecao === false ? (
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "50vh" }}>
                            <h3 className="mb-3 text-center alert alert-danger py-1 px-2 mb-2" role="alert">Nenhuma lista vinculada a esse ID foi encontrada!</h3>
                        </div>
                        ) : (
                            colecao?.length > 0 ? (
                            <div className="row">
                                {colecao.map((item, index) => (
                                    <div className="col-12 col-md-6 d-flex justify-content-center mb-3" key={index}>
                                        <div className="card bg-dark text-light shadow-lg p-3 position-relative" style={{ maxWidth: "600px", width: "100%" }}>
                                            
                                            <form onSubmit={ExcluirItem} className="position-absolute top-0 end-0 m-1">
                                                <input type="hidden" name="itemId" value={item.id} />
                                                <input type="hidden" name="itemNome" value={item.nome}/>
                                                {owner && (
                                                    <button
                                                    className="btn btn-danger px-2 py-1"
                                                    disabled={deletando}
                                                    title="Remover midia da lista"
                                                    style={{
                                                        fontSize: "1rem",
                                                        fontWeight: "bold",
                                                        borderRadius: "50%",
                                                        zIndex: 10,
                                                        position: "relative"
                                                    }}
                                                    >
                                                        X
                                                    </button>
                                                )}
                                                
                                            </form>
                                            <Item item={item} rota_saida="/Detalhes" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "50vh" }}>
                                <h3 className="mb-3 text-center">Esta lista está vazia!</h3>
                                {owner && (
                                    <Link href="/" className="btn btn-secondary">
                                        🔍 Buscar mídia
                                    </Link>
                                )}
                            </div>
                        )
                    )
                    }
                </div>
            )}
        </>
    )
}
