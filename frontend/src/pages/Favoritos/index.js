import SEO from "@/components/SEO.js"
import Menu from "@/components/Menu/Menu.js"
import { chamar_api_favorito } from "@/services/API/api.js"
import { get_usuario } from "@/utils/get_usuario/get_usuario.js"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Item from "@/components/Busca/Item"


export default function Favoritos(){
    const usuario = get_usuario();
    const router = useRouter();
    const [favs, setFavs] = useState(null);
    const [load, setLoad] = useState(false);
    const [deletando, setDeletando] = useState(false);


    useEffect(() => {
        async function ChamarApi(){
            const resp = await chamar_api_favorito({"user_id": usuario.id})
            if (resp){
                setFavs(resp.data);
                setLoad(true);
            }
            else {
                alert("Erro ao consultar API!\nVoltando a pagina inicial!");
                router.push("/");
            }
        }
        ChamarApi();
    }, [deletando])


    async function ExcluirItem(event){
        event.preventDefault();
        setDeletando(true);
        const formData = new FormData(event.target);
        const itemId = formData.get("itemId");
        const resp = await chamar_api_favorito({"user_id": usuario.id, "tmdb_id": itemId}, "Delete", "DELETE");

        if (resp){
            if (resp.status === "success"){
                alert("Favorito Removido!");
                router.replace("/Favoritos");
            } else {
                alert(`Erro ao excluir favorito!\n${resp.message}\n${resp.errors}`)
            }
        }else {
            alert("Erro ao chamar api!")
            router.replace("/");
        }
        setDeletando(false);
    }


    return (
        <>
            <SEO titulo="Favoritos" descricao="Página de Favoritos do Usuário!" />
            <Menu />
            {!load && <span>Carregando...</span>}
            {load && (
                <div className="container mt-4">
                    <h2 className="text-center">Meus Favoritos</h2>
                    <hr className="bg-light"/>

                    {favs?.length > 0 ? (
                        <div className="row">
                            {favs.map((item, index) => (
                                <div className="col-12 col-md-6 d-flex justify-content-center mb-3" key={index}>
                                    <div className="card bg-dark text-light shadow-lg p-3 position-relative" style={{ maxWidth: "600px", width: "100%" }}>
                                        
                                        {/* Botão X no canto superior direito, agora vermelho */}
                                        <form onSubmit={ExcluirItem} className="position-absolute top-0 end-0 m-1">
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <button
                                                className="btn btn-danger px-2 py-1"
                                                disabled={deletando}
                                                title="Remover dos favoritos"
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: "bold",
                                                    borderRadius: "50%",
                                                    zIndex: 10,  // Garante que fica acima de outros elementos
                                                    position: "relative"  // Mantém dentro do form
                                                }}
                                            >
                                                X
                                            </button>
                                        </form>
                                        <Item item={item} rota_saida="/Favoritos/Detalhes" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light">Nada aqui...</p>
                    )}
                </div>
            )}
        </>
    )
}
