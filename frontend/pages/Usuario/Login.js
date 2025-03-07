import Link from "next/link"
import SEO from "../../components/SEO"
import { useState, useEffect } from "react"
import { buscar_usuario } from "../../api/api_rotas";
import { useRouter } from "next/router";
import { get_usuario } from "../../code/Usuario/Usuario";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Login(){
    const [dici, setDici] = useState({
        "email": "",
        "senha": ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter()


    useEffect(() => {
        const busca_usuario = get_usuario();
        if (busca_usuario) router.replace("/");
    }, [router]);


    function handleChange(event){
        const {name, value} = event.target;
        setDici((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    async function buscar_na_api(){
        try{
            const busca = await buscar_usuario(dici);
            return busca;
        } catch (err) {
            console.log("Erro na busca", err);
            alert(`erro: ${err}`);
            return null;
        }
    }


    async function Logar(event) {
        event.preventDefault();
        setLoading(true);
        const busca = await buscar_na_api();
        setLoading(false);
        
        if (busca) {
            if (busca.status === "success"){
                localStorage.setItem("usuario", JSON.stringify(busca.data));
                router.push("/");
            } else {
                alert("Email ou Senha invalidos!");
            }
        } else {
            alert("Carregando...");
        }
    }


    return(
        <>
        <SEO titulo={"Login"} descricao={"Pagina de Login!"}/>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 id="titulo-pagina" className="text-center mb-4">Login: </h2>
                <form id="form-login" onSubmit={Logar}>
                    <div id="div-email" className="mb-3">
                        <label htmlFor="input-email" className="form-label">Email: </label>
                        <input type="email" id="input-email" name="email" value={dici.email} onChange={handleChange} required autoFocus={true} className="form-control"/>
                    </div>
                    <div id="div-senha" className="mb-3">
                        <label htmlFor="input-senha" className="form-label">Senha: </label>
                        <input type="password" id="input-senha" name="senha" value={dici.senha} onChange={handleChange} required className="form-control"/>
                    </div>
                    <hr />
                    <div id="div-btn" className="d-flex justify-content-between align-items-center">
                        <Link href={"/Usuario/Registro"} legacyBehavior={true}>
                            <a className="text-decoration-none">Registrar-se</a>
                        </Link>
                        <button id="btn-logar" className="btn btn-info" type="submit" disabled={loading}>
                            {loading ? "Aguarde..." : "Logar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}
