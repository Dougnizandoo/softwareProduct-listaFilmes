import SEO from "../../components/SEO";
import Menu from "../../components/Menu/Menu";
import { chamar_api } from "../../services/API/api.js";
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
    const [err, setErr] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Redireciona para login se não houver usuário logado.
    useEffect(() => {
        const busca_usuario = get_usuario();
        if (!busca_usuario) router.replace("/Perfil/Login");
        else { 
            // Preenche bilhete_exclusao com ID e e-mail do usuário.
            setUsuario(busca_usuario);
            setBilhete_exclusao(prev => ({
                ...prev,
                id: busca_usuario.id,
                email: busca_usuario.email
            }));
        }
    }, []);

    // Atualiza os campos de senha digitados.
    function handleChange(event){
        const {name, value} = event.target;
        setErr('');
        setSenhas((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Verifica se os campos foram preenchidos e coincidem.
    function validar(){
        if (senhas.senha.trim() === "" || senhas.cSenha.trim() === "") return false;
        else if (senhas.senha !== senhas.cSenha) return false;
        return true;
    }

    // Envia a requisição DELETE para a API com os dados do usuário.
    async function enviarSolicitacaoExclusao() {
        try {
            const resposta = await chamar_api(bilhete_exclusao, 2, "DELETE", 0);
            return resposta;
        } catch (erro) {
            console.log("Erro ao chamar API: ", erro);
            setErr("Erro ao chamar API");
            return null;
        }
    }

    // Valida os dados e confirma com o usuário, se confirmado e bem-sucedido: Limpa o localStorage; Redireciona para login.
    async function Deletar_Usuario(event){
        event.preventDefault();
        setLoading(true);
        const resp = validar();
        if (resp === false) {
            setErr("Senhas não combinam ou estão em branco");
        } else {
            const resposta = window.confirm("Deseja mesmo excluir essa conta ?")

            if (resposta){
                setBilhete_exclusao(prev => ({
                    ...prev,
                    senha: senhas.senha
                }));
                const resp = await enviarSolicitacaoExclusao();

                if (resp) {
                    if (resp.status === "success"){
                        alert("Usuario Excluido com Sucesso!");
                        localStorage.clear();
                        router.push("/Perfil/Login");
                    } else{
                        setErr("Senha invalida!");
                    }
                }
            }
        }
        setLoading(false);
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
                    {/** Mostra mensagem de erro caso algo falhe. */}
                    {err && (
                        <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.9rem" }}>
                            {err}
                        </div>
                    )}
                    <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "2vh"}}>
                        <div className="card shadow p-4" style={{ width: "100%" }}>
                            <form onSubmit={Deletar_Usuario}>
                                <div className="mb-3">
                                    <label htmlFor="input-senha" className="form-label">Senha: </label>
                                    <input id="input-senha" name="senha" type={mostrarSenha ? "text" : "password"} className="form-control" required onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="input-cSenha" className="form-label">Confirme a Senha: </label>
                                    <input id="input-cSenha" name="cSenha" type={mostrarSenha ? "text" : "password"} className="form-control" required onChange={handleChange}/>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    {!loading ? (
                                        <div>
                                            <button type="submit" className="btn btn-danger text-center" id="btn-excluir" style={{marginRight: "10px"}}>Excluir</button>
                                            <button type="button" 
                                            className="btn btn-sm btn-outline-secondary" 
                                            id="btn-mostrarSenha" 
                                            style={{marginLeft: "10px"}}
                                            onMouseDown={() => setMostrarSenha(true)}
                                            onMouseUp={() => setMostrarSenha(false)}
                                            onMouseLeave={() => setMostrarSenha(false)}>
                                                {mostrarSenha ? "🔒 Ocultar Senha" : "🔓 Mostrar Senha"}
                                            </button>
                                        </div>
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
