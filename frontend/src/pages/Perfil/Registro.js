import Link from "next/link";
import SEO from "../../components/SEO";
import { useState, useEffect } from "react";
import { chamar_api } from "@/services/API/api";
import { useRouter } from "next/router";
import { get_usuario } from "../../utils/get_usuario/get_usuario.js";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Registro(){
    const agora = new Date()
    const [loginData, setLoginData] = useState({
        "id": "",
        "nome": "",
        "data_nascimento": `${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, '0')}-${agora.getDate().toString().padStart(2, '0')}`,
        "genero": 1,
        "email": "",
        "senha": ""
    });
    const [senhas, setSenhas] = useState({
        "senha": "",
        "cSenha": ""
    })
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const [logado, setLogado] = useState(true);
    const [err, setErr] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);


    // Redirecionamento automático caso o usuário já esteja logado
    useEffect(() => {
        const usuario = get_usuario();
        if (!usuario) setLogado(false);
        else router.push('/');
    }, []);


    // Atualiza os valores conforme o usuário digita.
    function handleChange(event){
        const {name, value} = event.target;
        setErr('');

        if (name === "senha" || name === "cSenha"){
            setSenhas((prev) => ({
                ...prev,
                [name]: value
            }));
        } else {
            setLoginData((prev) => {
                if (name === "genero"){
                    return{
                        ...prev,
                        [name]: Number(value)
                    }
                }else {
                    return{
                        ...prev,
                        [name]: value
                    }
                }
            });
        };
    }


    // Envia os dados via POST para criar o novo usuário.
    async function api() {
        try{
            const resp = await chamar_api(loginData, 1, 'POST', 0);
            return resp;
        } catch (err){
            console.error("Erro ao adicionar usuario", err);
            alert(`erro: ${err}`);
            return null;
        }
    }


    // Valida se os campos de senha estão preenchidos e iguais.
    async function Registrar(event){
        event.preventDefault();

        if (senhas.senha.trim() === "" || senhas.cSenha.trim() === ""){
            setErr("Senha Vazia")
            return;
        }else if (senhas.senha !== senhas.cSenha){
            setErr("Senhas devem ser iguais")
            return;
        }

        // Envia os dados para a API.
        loginData.senha = senhas.senha
        setLoading(true);
        const resp = await api();
        setLoading(false);

        // Redireciona para login se for bem-sucedido.
        if (resp){
            if (resp.status === "error"){
                setErr("Email ja cadastrado!")
            } else {
                alert("Conta registrada com sucesso!\nCarregando pagina de login...")
                router.push("/Perfil/Login")
            }
        }
    }


    return(
        <>
        <SEO titulo={"Registro"} descricao={"Pagina de Registro!"}/>
        {/* Exibe o formulário de registro somente se o usuário não estiver logado. */}
        {!logado && (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "600px" }}>
                <h2 id="titulo-pagina" className="text-center mb-4">Registro: </h2>
                <hr />
                <form onSubmit={Registrar} id="form-registro">
                    {err != '' && (
                        <div className="alert alert-danger text-center mb-3" role="alert">
                            {err}
                        </div>
                    )}
                    <div id="div-nome" className="mb-3">
                        <label htmlFor="input-nome" className="form-label">Nome: </label>
                        <input disabled={loading} type="text" id="input-nome" name="nome" onChange={handleChange} value={loginData.nome} required autoFocus={true} className="form-control"/>
                    </div>

                    <div id="div-nascimento" className="mb-3">
                        <label htmlFor="input-nascimento" className="form-label">Data de Nascimento</label>
                        <input disabled={loading} type="date" id="input-nascimento" name="data_nascimento" onChange={handleChange} value={loginData.data_nascimento} className="form-control form-control-lg"/>
                    </div>

                    <div id="div-genero" className="mb-3">
                        <label id="select-genero" className="form-label">Genero: </label>
                        <select disabled={loading} id="select-Genero" name="genero" onChange={handleChange} value={loginData.genero} className="form-control form-control-lg">
                            <option value={1}>Masculino</option>
                            <option value={2}>Feminino</option>
                            <option value={3}>Prefiro não Dizer</option>
                        </select>
                    </div>

                    <div id="div-email" className="mb-3">
                        <label htmlFor="input-email" className="form-label">Email: </label>
                        <input disabled={loading} type="email" id="input-email" name="email" onChange={handleChange} value={loginData.email} required className="form-control"/>
                    </div>

                    <div id="div-senha" className="mb-3">
                        <label htmlFor="input-senha" className="form-label">Senha: </label>
                        <input disabled={loading} type={mostrarSenha ? "text" : "password"} id="input-senha" name="senha" value={senhas.senha} onChange={handleChange} className="form-control"/>

                        <label htmlFor="input-cSenha" className="form-label">Confirmar Senha: </label>
                        <input disabled={loading} type={mostrarSenha ? "text" : "password"} id="input-cSenha" name="cSenha" value={senhas.cSenha} onChange={handleChange} className="form-control"/>
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

                    <hr />
                    <div id="div-btn" className="d-flex justify-content-between align-items-center">
                        <Link href={"/Perfil/Login"} legacyBehavior={true}>
                            <a className="text-decoration-none">Fazer Login</a>
                        </Link>
                        {/* Troca o texto enquanto a requisição está sendo processada. */}
                        <button id="btn-Registrar" type="submit" disabled={loading} className="btn btn-success">
                            {loading ? "Aguarde..." : "Registrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        )}
        </>
    )
}
