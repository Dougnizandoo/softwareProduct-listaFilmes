import { chamar_api } from "@/services/API/api.js"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Item from "@/components/Busca/Item"
import Link from "next/link"


export default function Listagem({header}){
    const router = useRouter();
    const [colecao, setColecao] = useState([]);
    const [load, setLoad] = useState(false);
    const [deletando, setDeletando] = useState(false);


    useEffect(() => {
        ChamarApi();
    }, [])


    async function ChamarApi(){
        const resp = await chamar_api(header, 0, "GET", header.canal)
        if (resp){
            if (resp.data !== null){
                setColecao(resp.data);
            }else { setColecao([]) }
            setLoad(true);
        }
        else {
            alert("Erro ao consultar API!\nVoltando a pagina inicial!");
            router.push("/");
        }
    }

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
                dici = {"table_id": header.code, "tmdb_id": formData.get("itemId")}
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


    async function excluirLista(event) {
        event.preventDefault();
        const confirmar = window.confirm("Tem certeza que deseja excluir essa lista?");
        
        if (confirmar) {
            let dici = {
                "user_id": header.user_id,
                "table_id": header.code
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
            {!load && <span>Carregando...</span>}
            {load && (
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="m-0">{header.canal === 1 ? ("Meus Favoritos") : (header.titulo)}</h2>
                        {header.canal !== 1 && (
                            <form onSubmit={excluirLista}>
                                <button className="btn btn-danger">🗑️ Excluir Lista</button>
                            </form>
                        )}
                    </div>
                    <hr className="bg-light" />

                    {colecao?.length > 0 ? (
                        <div className="row">
                            {colecao.map((item, index) => (
                                <div className="col-12 col-md-6 d-flex justify-content-center mb-3" key={index}>
                                    <div className="card bg-dark text-light shadow-lg p-3 position-relative" style={{ maxWidth: "600px", width: "100%" }}>
                                        
                                        <form onSubmit={ExcluirItem} className="position-absolute top-0 end-0 m-1">
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <input type="hidden" name="itemNome" value={item.nome}/>
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
                                        </form>
                                        <Item item={item} rota_saida="/Detalhes" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "50vh" }}>
                            <h3 className="mb-3 text-center">Esta lista está vazia!</h3>
                            <Link href="/" className="btn btn-secondary">
                                🔍 Buscar mídia
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
