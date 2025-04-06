import { chamar_api_busca_id } from "@/services/API/api";
import { useState, useEffect } from "react";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import Details from "@/components/Details/Details";
import SEO from "@/components/SEO";
import Menu from "@/components/Menu/Menu";


export default function Detalhes_Favoritos(){
    const [ dados, setDados ] = useState(null);
    const usuario = get_usuario();


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

    return(
        <>
        <Menu />
        {dados ? (
            <>
            <SEO titulo={dados.nome} descricao={`Pagina de sobre a midia favorita: ${dados.nome}`}/>
            <Details dados={dados}/>
            </>
        ) : (
            <span>Erro ao carregar dados!</span>
        )}
        </>
    )
}
