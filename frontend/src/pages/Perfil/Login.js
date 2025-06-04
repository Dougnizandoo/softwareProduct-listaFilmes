import SEO from "../../components/SEO"
import { chamar_api} from "../../services/API/api.js";
import { get_usuario } from "../../utils/get_usuario/get_usuario.js";
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Login(){
    const router = useRouter()
    const [loginData, setLoginData] = useState({
        "email": "",
        "senha": ""
    });
    const [loading, setLoading] = useState(false);
    const [logado, setLogado] = useState(null);
    const [err, setErr] = useState('');
    const usuario = useMemo(() => get_usuario(), []);
    const [mostrarSenha, setMostrarSenha] = useState(false);


    // Se já estiver logado, redireciona para a home.
    useEffect(() => {
        if (!usuario){
            setLogado(false);
        }else {
            router.replace("/");
        }
    }, [usuario]);


    // Atualiza os campos conforme o usuário digita.
    function handleChange(event){
        const {name, value} = event.target;
        setErr('');
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    // Faz a requisição à API para verificar se o email/senha estão corretos.
    async function buscar_na_api(){
        try{
            const busca = await chamar_api(loginData, 0, "POST", 0);
            return busca;
        } catch (err) {
            console.error("Erro na busca", err);
            setErr(`Erro ao consultar a api!`);
            return null;
        }
    }


    // Salva o usuário no localStorage em caso de sucesso ao valida com a API.
    async function Logar(event) {
        event.preventDefault();
        setLoading(true);
        const busca = await buscar_na_api();
        setLoading(false);
        console.log(busca);
        if (!busca) {
            setErr("Erro ao buscar os dados, tente novamente.");
            return;
        }
        if (busca.status === "success") {
            localStorage.setItem("usuario", JSON.stringify(busca.data));
            router.push("/");
        } else {
            setErr(busca.errors);
        }
        
    }

    return(
        <>
        <SEO titulo={"Login"} descricao={"Pagina de Login!"}/>
        {/* Só exibe o formulário se o usuário não estiver logado. */}
        {!logado && (
            <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 id="titulo-pagina" className="text-center mb-4">Login: </h2>

                {err != '' && (
                    <div className="alert alert-danger" role="alert">
                        {err}
                    </div>
                )}

                <form id="form-login" onSubmit={Logar}>
                    <div id="div-email" className="mb-3">
                        <label htmlFor="input-email" className="form-label">Email: </label>
                        <input disabled={loading} type="email" id="input-email" name="email" value={loginData.email} onChange={handleChange} required autoFocus={true} className="form-control"/>
                    </div>

                    <div id="div-senha" className="mb-3">
                        <label htmlFor="input-senha" className="form-label">Senha: </label>
                        <input disabled={loading} type={mostrarSenha ? "text" : "password"} id="input-senha" name="senha" value={loginData.senha} onChange={handleChange} required className="form-control"/>
                    </div>

                    <div className="d-flex justify-content-center mb-3">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary" 
                            id="btn-mostrarSenha" 
                            onMouseDown={() => setMostrarSenha(true)}
                            onMouseUp={() => setMostrarSenha(false)}
                            onMouseLeave={() => setMostrarSenha(false)}>  
                            {mostrarSenha ? "🔒 Ocultar Senha" : "🔓 Mostrar Senha"}
                        </button>
                    </div>

                    {/* Exibe mensagens de erro caso falhe o login ou a API. */}
                    <hr />

                    {/** Botão de login + link para registro */}
                    <div id="div-btn" className="d-flex justify-content-between align-items-center">
                        <Link href={"/Perfil/Registro"} legacyBehavior={true}>
                            <a className="text-decoration-none">Registrar-se</a>
                        </Link>
                        <button id="btn-logar" className="btn btn-info" type="submit" disabled={loading}>
                            {loading ? "Aguarde..." : "Logar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        )}
        </>
    )
}
