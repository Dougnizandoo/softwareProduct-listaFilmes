import Link from "next/link";
import SEO from "../../components/SEO";
import { useState, useEffect } from "react";
import { adicionar_usuario } from "../../api/api_rotas";
import { useRouter } from "next/router";
import { get_usuario } from "../../code/Usuario/Usuario";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Registro(){
    const agora = new Date()
    const [dici, setDici] = useState({
        "nome": "",
        "dataNascimento": `${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, '0')}-${agora.getDate().toString().padStart(2, '0')}`,
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


    useEffect(() => {
        const busca_usuario = get_usuario();
        if (busca_usuario) router.replace("/");
    }, [router]);


    function handleChange(event){
        const {name, value} = event.target;

        if (name === "senha" || name === "cSenha"){
            setSenhas((prev) => ({
                ...prev,
                [name]: value
            }));
        } else {
            setDici((prev) => {
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


    function validar(event){
        if (senhas.senha.trim() === "" || senhas.cSenha.trim() === ""){
            event.preventDefault();
            alert("Senha Vazia")
        }else if (senhas.senha !== senhas.cSenha){
            event.preventDefault();
            alert("Senhas devem ser iguais")
        }else {
            dici.senha = senhas.senha
        }
    }


    async function chamar_api() {
        try{
            const resp = await adicionar_usuario(dici);
            return resp
        } catch {
            console.log("Erro ao adicionar usuario", err);
            alert(`erro: ${err}`);
            return null;
        }
    }


    async function Registrar(event){
        event.preventDefault();
        setLoading(true);
        const resp = await chamar_api();
        setLoading(false);

        if (resp){
            if (resp.status === "success"){
                alert("Conta registrada com sucesso!")
                router.push("/Usuario/Login")
            } else {
                alert("Email ja cadastrado!")
            }
        }
    }


    return(
        <>
        <SEO titulo={"Registro"} descricao={"Pagina de Registro!"}/>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "600px" }}>
                <h2 id="titulo-pagina" className="text-center mb-4">Registro: </h2>
                <hr />
                <form onSubmit={Registrar} id="form-registro">
                    <div id="div-nome" className="mb-3">
                        <label htmlFor="input-nome" className="form-label">Nome: </label>
                        <input type="text" id="input-nome" name="nome" onChange={handleChange} value={dici.nome} required autoFocus={true} className="form-control"/>
                    </div>
                    <div id="div-nascimento" className="mb-3">
                        <label htmlFor="input-nascimento" className="form-label">Data de Nascimento</label>
                        <input type="date" id="input-nascimento" name="dataNascimento" onChange={handleChange} value={dici.dataNascimento} className="form-control form-control-lg"/>
                    </div>
                    <div id="div-genero" className="mb-3">
                        <label id="select-genero" className="form-label">Genero: </label>
                        <select id="select-Genero" name="genero" onChange={handleChange} value={dici.genero} className="form-control form-control-lg">
                            <option value={1}>Masculino</option>
                            <option value={2}>Feminino</option>
                            <option value={3}>Prefiro não Dizer</option>
                        </select>
                    </div>
                    <div id="div-email" className="mb-3">
                        <label htmlFor="input-email" className="form-label">Email: </label>
                        <input type="email" id="input-email" name="email" onChange={handleChange} value={dici.email} required className="form-control"/>
                    </div>
                    <div id="div-senha" className="mb-3">
                        <label htmlFor="input-senha" className="form-label">Senha: </label>
                        <input type="password" id="input-senha" name="senha" value={senhas.senha} onChange={handleChange} className="form-control"/>

                        <label htmlFor="input-cSenha" className="form-label">Confirmar Senha: </label>
                        <input type="password" id="input-cSenha" name="cSenha" value={senhas.cSenha} onChange={handleChange} className="form-control"/>
                    </div>
                    <hr />
                    <div id="div-btn" className="d-flex justify-content-between align-items-center">
                        <Link href={"/Usuario/Login"} legacyBehavior={true}>
                            <a className="text-decoration-none">Fazer Login</a>
                        </Link>
                        <button id="btn-Registrar" type="submit" disabled={loading} onClick={validar} className="btn btn-success">
                            {loading ? "Aguarde..." : "Registrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}
