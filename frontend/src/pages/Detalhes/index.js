import { useRouter } from "next/router"
import { chamar_api } from "@/services/API/api.js";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Menu from "@/components/Menu/Menu";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import Details from "@/components/Midia/Midia.js";


export default function Detalhes(){
    const router = useRouter();
    const [ dados, setDados ] = useState(null);
    const usuario = get_usuario();
    const ultimaPesquisa = JSON.parse(localStorage.getItem("ultima_pesquisa"));
    const [novoItem, setNovoItem] = useState({
        "user_id": usuario.id, 
        "tmdb_id": ultimaPesquisa.tmdb_id,
        "tipo_midia": ultimaPesquisa.tipo,
        "table_id": "",
        "canal_api": 1,
        "table_nome": "Favoritos"
    })
    const [loading, setLoading] = useState(false);
    const [listas, setListas] = useState(null);


    useEffect(() => {
        buscar_detalhes();
        buscar_listas();
    }, []);


    async function buscar_listas(){
        const busca = await chamar_api({"code": usuario.id}, 0, "GET", 4);

        if (busca){
            setListas(busca.data);
        }
    }


    async function buscar_detalhes(){
        try{
            if (!ultimaPesquisa) {
                throw new Error("Nenhuma Pesquisa encontrada!")
            }

            const busca = await chamar_api({'code': ultimaPesquisa.tmdb_id, 'tipo': ultimaPesquisa.tipo}, 0, "GET", 3);
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


    function handleChange(event){
        const selectedIndex = event.target.selectedIndex;
        const selectedOption = event.target.options[selectedIndex];
        const value = selectedOption.value;
        const nome = selectedOption.getAttribute("data-name");

        if (value !== "1"){
            setNovoItem((prev) => ({
                ...prev,
                table_id: value,
                canal_api: 5,
                table_nome: nome
            }))
        } else {
            setNovoItem((prev) => ({
                ...prev,
                table_id: "",
                canal_api: 1,
                table_nome: "Favoritos"
            }))
        }
    }


    async function Adicionar(){
        setLoading(true);
        const resp = await chamar_api(novoItem, 1, "POST", novoItem.canal_api);

        if (resp){
            if (resp.status === "success"){
                alert (`A midia foi adicionada a lista '${novoItem.table_nome}' com sucesso!`)
            } else{
                alert (`Erro ao adicionar item a lista!\nA lista já possui essa midida!`)
                console.error(resp.errors);
                console.error(resp.message);
            }
        }else {
            alert('Erro ao chamar api');
        }
        setLoading(false);
    }

    return (
        <>
            <Menu />
            <div className="container mt-3 mb-3">
                {dados ? (
                    <div className="row justify-content-center">
                        <SEO titulo={dados.nome} descricao={`Página de detalhes sobre ${dados.nome}`} />
    
                        <div className="col-md-10 col-lg-8 bg-dark text-light p-4 rounded shadow-lg">
                            <Details dados={dados} tipo={novoItem.tipo_midia} />
                            
                            <hr className="bg-light my-4" />
    
                            <div className="text-center d-flex flex-column flex-sm-row align-items-center gap-3">
                                <label htmlFor="select-listas" className="form-label mb-0 me-sm-2">
                                    Adicionar a lista:
                                </label>
                                <select 
                                    onChange={handleChange} 
                                    id="select-listas" 
                                    disabled={loading} 
                                    className="form-select w-100 w-sm-auto"
                                >
                                    <option value={1}>Favorito</option>
                                    {listas.map((item) => (
                                        <option 
                                            data-name={item.table_nome} 
                                            key={item.table_id} 
                                            value={item.table_id}
                                        >
                                            {item.table_nome}
                                        </option>
                                    ))}
                                </select>
    
                                <button 
                                    onClick={Adicionar} 
                                    id="btn-add" 
                                    disabled={loading} 
                                    className="btn btn-success"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-danger mt-5">
                        <SEO titulo="Detalhes" descricao="Erro ao consultar detalhes!" />
                        <h3>Erro ao consultar dados</h3>
                    </div>
                )}
            </div>
        </>
    );    
}
