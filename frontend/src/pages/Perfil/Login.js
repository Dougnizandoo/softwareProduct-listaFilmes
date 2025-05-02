import SEO from "../../components/SEO"
import { chamar_api} from "../../services/API/api.js";
import { get_usuario } from "../../utils/get_usuario/get_usuario.js";
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Login(){
    const router = useRouter()
    const [dici, setDici] = useState({
        "email": "",
        "senha": ""
    });
    const [loading, setLoading] = useState(false);
    const [logado, setLogado] = useState(null);

    useEffect(() => {
        const usuario = get_usuario();
        if (!usuario) setLogado(false);
        else router.replace("/");
    }, []);


    function handleChange(event){
        const {name, value} = event.target;
        setDici((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    async function buscar_na_api(){
        try{
            const busca = await chamar_api(dici, 0, "POST", 0);
            return busca;
        } catch (err) {
            console.error("Erro na busca", err);
            alert(`erro: ${err}`);
            return null;
        }
    }


    async function Logar(event) {
        event.preventDefault();
        setLoading(true);
        const busca = await buscar_na_api();
        setLoading(false);
        if (!busca) {
            alert("Erro ao buscar os dados, tente novamente.");
            return;
        }
        if (busca.status === "success") {
            localStorage.setItem("usuario", JSON.stringify(busca.data));
            router.push("/");
        } else {
            alert("Email ou Senha inválidos!");
        }
        
    }


    return(
        <>
        <SEO titulo={"Login"} descricao={"Pagina de Login!"}/>
        {!logado && (
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
