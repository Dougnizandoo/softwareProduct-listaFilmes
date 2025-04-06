import { useRouter } from "next/router"
import { chamar_api_busca_id, chamar_api_favorito } from "@/services/API/api.js";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Menu from "@/components/Menu/Menu";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import Details from "@/components/Details/Details.js";


export default function Detalhes(){
    const router = useRouter();
    const [ dados, setDados ] = useState(null);
    const usuario = get_usuario();
    const [novoFavorito, setNovoFavorito] = useState({
        "user_id": null,
        "tmdb_id": null,
        "tipo_midia": null
    })
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function buscar_detalhes(){
            try{
                const ultimaPesquisa = JSON.parse(localStorage.getItem("ultima_pesquisa"));
                if (!ultimaPesquisa) {
                    throw new Error("Nenhuma Pesquisa encontrada!")
                }

                const busca = await chamar_api_busca_id(ultimaPesquisa.tmdb_id, ultimaPesquisa.tipo);

                if (busca){
                    if (busca.status === "success"){
                        setDados(busca.data);
                        setNovoFavorito((prev) => ({
                            ...prev,
                            user_id: usuario.id,
                            tmdb_id: ultimaPesquisa.tmdb_id,
                            tipo_midia: ultimaPesquisa.tipo
                        }));
                    } else {
                        alert(`Erro ao buscar dados: ${busca.errors}\n${busca.message}`);
                    }
                } else {
                    throw new Error("Erro ao chamar api!");
                }

            }catch (err){
                console.error(err);
                setDados(null);
            }
        }
        buscar_detalhes();
    }, [usuario]);


    async function Adicionar(){
        setLoading(true);
        const resp = await chamar_api_favorito(novoFavorito, "Create", "POST")

        if (resp){
            if (resp.status === "success"){
                alert ("Favorito adicionado a lista de Favoritos com sucesso!")
                router.push("/Favoritos")
            } else{
                alert (`Erro ao adicionar item a lista!\nErro ${resp.errors}\n${resp.message}`)
            }
        }else {
            alert('Erro ao chamar api');
        }
        setLoading(false);
    }


    return (
        <>
        {/* Menu fixo no topo */}
        <Menu />

        {/* Página de detalhes */}
        <div className="container mt-4">
            {dados ? (
                <div className="row justify-content-center">
                    <SEO titulo={dados.nome} descricao={`Página de detalhes sobre ${dados.nome}`} />

                    {/* Card de detalhes */}
                    <div className="col-md-8">
                        <Details dados={dados} tipo={novoFavorito.tipo_midia} />
                    </div>

                    {/* Botão abaixo do card */}
                    <div className="col-md-8 text-center mt-3">
                        <button 
                            onClick={Adicionar} 
                            disabled={loading} 
                            className="btn btn-primary"
                        >
                            {loading ? "Adicionando..." : "Adicionar aos Favoritos"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-danger mt-4">
                    <SEO titulo="Detalhes" descricao="Erro ao consultar detalhes!" />
                    <h3>Erro ao consultar dados</h3>
                </div>
            )}
        </div>
    </>
    )
}
