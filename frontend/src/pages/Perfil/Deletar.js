import SEO from "../../components/SEO";
import Menu from "../../components/Menu/Menu";
import { chamar_api_usuario } from "../../services/API/api.js";
import { get_usuario } from "../../utils/get_usuario/get_usuario.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Deletar(){
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [senhas, setSenhas] = useState({"senha": "", "cSenha": ""});
    const [bilhete_exclusao, setBilhete_exclusao] = useState({"id": "", "email": "", "senha": ""});

    useEffect(() => {
        const busca_usuario = get_usuario();
        if (!busca_usuario) router.replace("/Login");
        else { 
            setUsuario(busca_usuario);
            setBilhete_exclusao(prev => ({
                ...prev,
                id: busca_usuario.id,
                email: busca_usuario.email
            }));
        }
    }, []);

    function handleChange(event){
        const {name, value} = event.target;
        setSenhas((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validar(){
        if (senhas.senha.trim() === "" || senhas.cSenha.trim() === "") return false;
        else if (senhas.senha !== senhas.cSenha) return false;
        bilhete_exclusao.senha = senhas.senha;
        return true;
    }

    async function chamar_api() {
        try {
            const resposta = await chamar_api_usuario(bilhete_exclusao, "Excluir", "DELETE");
            return resposta;
        } catch (err) {
            console.log("Erro ao chamar API: ", err);
            alert("Erro ao chamar API");
            return null;
        }
    }

    async function Deletar_Usuario(event){
        event.preventDefault();
        setLoading(true);
        const resp = validar();
        if (resp === false) {
            alert("Senhas não combinam ou estão em branco");
            setLoading(false);
        } else {
            const resp = await chamar_api();

            if (resp) {
                if (resp.status === "success"){
                    alert("Usuario Excluido com Sucesso!");
                    localStorage.clear();
                    router.push("/Login");
                } else{
                    alert("Senha invalida!");
                    setLoading(false);
                }
            }
        }
    }

    return(
        <>
        <SEO titulo={"Excluir Usuario"} descricao={"Pagina para deletar conta de usuario."}/>
        {usuario && (
            <>
            <Menu />
            <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "5vh"}}>
                <div className="container-4" style={{ width: "70%" }}>
                    <h2 className="fs-1 mb-4">Deseja Excluir sua Conta?</h2>
                    <h3 className="fs-2 mb-4">Para excluir a conta de: <b>{usuario.nome}</b>, digite sua senha:</h3>
                    <hr />
                    <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "2vh"}}>
                        <div className="card shadow p-4" style={{ width: "100%" }}>
                            <form onSubmit={Deletar_Usuario}>
                                <div className="mb-3">
                                    <label htmlFor="input-senha" className="form-label">Senha: </label>
                                    <input id="input-senha" name="senha" type="password" className="form-control" required onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="input-cSenha" className="form-label">Confirme a Senha: </label>
                                    <input id="input-cSenha" name="cSenha" type="password" className="form-control" required onChange={handleChange}/>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    {!loading ? (
                                        <button type="submit" className="btn btn-danger text-center" id="btn-excluir">Excluir</button>
                                    ) : (
                                        <p>Processando...</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    )
}
