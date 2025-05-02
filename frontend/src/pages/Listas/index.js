import SEO from "@/components/SEO.js";
import Menu from "@/components/Menu/Menu.js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { chamar_api } from "@/services/API/api.js";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import { useRouter } from "next/router";


export default function home(){
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const usuario = get_usuario();
    const router = useRouter();
    const [novaLista, setNovaLista] = useState({
        "user_id": "",
        "table_nome": ""
    });
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (usuario === null) {router.replace("/Perfil/Login")}
        else { setNovaLista((prev) => ({ ...prev, user_id: usuario.id })) }
        setLoading(true);
        api();
    }, []);


    async function api(){
        if (usuario !== null){
            const resp = await chamar_api({"code": usuario.id}, 0, "GET", 4);

            if (resp){
                setDados(resp.data);
                setLoading(false);
                }
        }
    }


    function handleChange(event){
        const { value } = event.target;
        setNovaLista((prev) => ({
            ...prev,
            table_nome: value
        }))
    }


    async function createNovaLista(event) {
        event.preventDefault();
        setLoading(true);

        if (novaLista.table_nome.trim() === "" || novaLista.table_nome.trim().length < 3){
            setErro("Para criar uma nova lista, o titulo dela tem que ter 3 letras ou mais!")
        }else{
            const resp = await chamar_api(novaLista, 1, "POST", 4);

            if (resp.status === "success"){
                await api();
                setMostrarForm(false);
                setNovaLista((prev) => ({ ...prev, table_nome: "" }))
                alert("Lista criada com sucesso!");
            } else{
                setErro(`Erro ao criar a lista: ${resp.errors}`)
                console.log(resp)
            }
        }

        setLoading(false);
    }


    return (
        
    <>
    {usuario !== null && (
        <>
            <SEO titulo={"Minhas Listas"} descricao={"Pagina de listas do usuario"} />
            <Menu />
            <main className="container mt-4">
            {!mostrarForm ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="fw-bold m-0">Minhas Listas</h2>
                        <button className="btn btn-info" onClick={() => setMostrarForm(true)}>
                            + Nova Lista
                        </button>
                    </div>
                </>
            ) : (
                <div className="mb-3" id="nova-lista">
                    {erro && (
                        <div className="alert alert-danger py-1 px-2 mb-2" role="alert" style={{ fontSize: "0.9rem" }}>
                            {erro}
                        </div>
                    )}

                    <form className="d-flex align-items-center gap-2" onSubmit={createNovaLista}>
                        <label htmlFor="nova-lista-input" className="form-label mb-0 me-2">Título:</label>

                        <input
                        id="nova-lista-input"
                        onChange={handleChange}
                        type="text"
                        value={novaLista.table_nome}
                        className="form-control flex-grow-1"
                        placeholder="Digite o nome da lista..."
                        onKeyDown={() => setErro("")}
                        autoFocus
                        />

                        <button disabled={loading} type="button" onClick={() => (setMostrarForm(false), setErro(""))} className="btn btn-secondary">
                        Cancelar
                        </button>
                        <button disabled={loading} type="submit" className="btn btn-success">
                        Criar
                        </button>
                    </form>
                </div>
        )}


            <div className="row g-4">
            <hr className="w-100 mb-4" />

                <div className="col-12 col-md-6 col-lg-4">
                <Link href="/Listas/Favoritos" className="text-decoration-none">
                    <div className="card bg-dark text-light shadow-lg h-100 p-4">
                    <h5 className="mb-0 text-center">⭐ Favoritos</h5>
                    </div>
                </Link>
                </div>

                {dados && dados.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={index}>
                    <Link href={`/Listas/Dados?lista_id=${item.table_id}&lista_nome=${item.table_nome}`} className="text-decoration-none">
                    <div className="card bg-dark text-light shadow-lg h-100 p-4">
                        <h5 className="mb-0 text-center">{item.table_nome}</h5>
                    </div>
                    </Link>
                </div>
                ))}
            </div>

            </main>
        </>
    )}
    </>

    )
}