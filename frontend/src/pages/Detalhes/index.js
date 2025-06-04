import { chamar_api } from "@/services/API/api.js";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Menu from "@/components/Menu/Menu";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import Details from "@/components/Midia/Midia.js";
import VerificarLogin from "@/components/VerificarLogin/verificar_login";


export default function Detalhes(){
    const [dados, setDados] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [ultimaPesquisa, setUltimaPesquisa] = useState(null);
    const [novoItem, setNovoItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [listas, setListas] = useState(null);
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');


    // Recupera o usuário e a última pesquisa ao montar o componente
    useEffect(() => {
        const user = get_usuario();
        const pesquisa = JSON.parse(localStorage.getItem("ultima_pesquisa"));

        if (user && pesquisa){
            setUsuario(user);
            setUltimaPesquisa(pesquisa);

            // Inicializa o novo item com valores padrão
            setNovoItem({
                user_id: user.id,
                tmdb_id: pesquisa.tmdb_id,
                tipo_midia: pesquisa.tipo,
                table_id: "",
                canal_api: 1,
                table_nome: "Favoritos"
            });
        }
    }, []);


    // Após ter usuário e pesquisa, busca detalhes e listas
    useEffect(() => {
        if (usuario && ultimaPesquisa){
            buscar_detalhes();
            buscar_listas();
        }
    }, [usuario, ultimaPesquisa])


    // Busca todas as listas do usuário
    async function buscar_listas(){
        if (ultimaPesquisa){
            const busca = await chamar_api({"code": usuario.id}, 0, "GET", 4);

            if (busca){
                setListas(busca.data);
            }
        }
    }


    // Busca os detalhes da mídia com base no tmdb_id e tipo de midia
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
                    setErr(`Erro ao buscar dados: ${busca.errors}\n${busca.message}`);
                }
            } else {
                throw new Error("Erro ao chamar api!");
            }

        }catch (erro){
            console.error(erro);
            setDados(null);
        }
    }


    // Manipula a seleção da lista no <select>
    function handleChange(event){
        const selectedIndex = event.target.selectedIndex;
        const selectedOption = event.target.options[selectedIndex];
        const value = selectedOption.value;
        const nome = selectedOption.getAttribute("data-name");

        setErr('');
        setSuccess('');
        setLoading(true);

        // Atualiza a lista selecionada para o novo item
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
        setLoading(false);
    }


    // Adiciona a mídia selecionada à lista do usuário
    async function Adicionar(){
        setLoading(true);
        setErr('');
        setSuccess('');
        const resp = await chamar_api(novoItem, 1, "POST", novoItem.canal_api);

        if (resp){
            if (resp.status === "success"){
                setSuccess(`${dados.nome} foi adicionada a lista '${novoItem.table_nome}' com sucesso!`)
            } else{
                setErr(`${dados.nome} já está presente na lista: '${novoItem.table_nome}'!`)
                return;
            }
        }else {
            setErr('Erro ao chamar api');
        }
        setLoading(false);
    }

    return (
        <>
            <VerificarLogin />
            <Menu />
            <div className="container mt-3 mb-3">
                {dados ? (
                    <div className="row justify-content-center">
                        <SEO titulo={dados.nome} descricao={`Página de detalhes sobre ${dados.nome}`} />
    
                        <div className="col-md-10 col-lg-8 bg-dark text-light p-4 rounded shadow-lg">
                            {/* Exibe detalhes da mídia */}
                            <Details dados={dados} tipo={novoItem.tipo_midia} />
                            
                            <hr className="bg-light my-4" />
    
                            {/* Formulário para adicionar item à lista */}
                            <div className="text-center d-flex flex-column flex-sm-row align-items-center gap-3">
                                <label htmlFor="select-listas" className="form-label mb-0 me-sm-2">
                                    Adicionar a lista:
                                </label>
                                <select 
                                    onChange={handleChange} 
                                    id="select-listas" 
                                    className="form-select w-100 w-sm-auto"
                                >
                                    <option value={1}>Favorito</option>
                                    {listas && listas.map((item) => (
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
                                    className="btn btn-success shadow-sm"
                                >
                                    Adicionar
                                </button>
                            </div>
                                {/* Feedback de erro/sucesso */}
                                {err != '' && (
                                    <div className="alert alert-danger text-center mb-3" role="alert" style={{marginTop: "20px"}}>
                                        {err}
                                    </div>
                                )}
                                {success != '' && (
                                    <div className="alert alert-success text-center mb-3" role="alert" style={{marginTop: "20px"}}>
                                        {success}
                                    </div>
                                )}
                        </div>
                    </div>
                ) : (
                    // Mensagem de erro caso falhe ao buscar os dados
                    <div className="text-center text-danger mt-5">
                        <SEO titulo="Detalhes" descricao="Erro ao consultar detalhes!" />
                        <h3>Erro ao consultar dados</h3>
                    </div>
                )}
            </div>
        </>
    );    
}
