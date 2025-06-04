import SEO from "../../components/SEO";
import Menu from "../../components/Menu/Menu";
import { get_usuario } from "../../utils/get_usuario/get_usuario.js";
import { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import VerificarLogin from "@/components/VerificarLogin/verificar_login";
import { useRouter } from "next/router";


export default function Perfil(){
    const lista_genero = ["Indefinido", "Masculino", "Feminino"];
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);

    // Verifica se o usuário está logado
    useEffect(() => {
        const u = get_usuario();
        if (u){
            setUsuario(u);
        }
    }, []);

    // Remove todos os dados salvos do usuário e redireciona para a pagina de login
    function sair_perfil(){
        localStorage.clear();
        router.push("/Perfil/Login");
    }

    return(
        <>
        <VerificarLogin />
        <SEO titulo={"Perfil"} descricao={"Pagina inicial do perfil"}/>
        {/** A página só é exibida se o usuário estiver logado e seus dados tiverem sido carregados. */}
        {usuario && (
            <>
            <Menu />
            <div id="corpo" className="d-flex">
                <div id="menu-perfil" className="bg-dark text-light p-3 position-fixed vh-100" style={{ width: "250px" }}>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <Link href={"/Perfil/Deletar"} legacyBehavior={true}>
                                <a className="text-decoration-none text-light">Excluir Conta</a>
                            </Link>
                        </li>

                        <li className="mb-3">
                            <a href="#" id="logout" className="text-danger cursor-pointer" onClick={sair_perfil}>Sair</a>
                        </li>
                    </ul>
                </div>
                <div id="div-info" className="container p-4" style={{ marginLeft: "270px" }}>
                    <h3 className="text-center mb-3">Dados do Usuario: </h3>
                    <hr />
                    <ul className="list-group">
                        <li className="list-group-item"><b>Nome:</b> {usuario.nome}</li>
                        <li className="list-group-item"><b>Data Nascimento:</b> {usuario.data_nascimento}</li>
                        <li className="list-group-item"><b>Sexo:</b> {lista_genero[usuario.genero]}</li>
                        <li className="list-group-item"><b>Email:</b> {usuario.email}</li>
                    </ul>
                </div>
            </div>
            </>
        )}        
        </>
    )
}