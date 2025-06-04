import SEO from "../components/SEO"
import Menu from "../components/Menu/Menu";
import { useState, useEffect } from "react"
import { get_usuario } from "../utils/get_usuario/get_usuario.js";
import VerificarLogin from "@/components/VerificarLogin/verificar_login";
import Busca from "@/components/Busca/Busca";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Home(){
    const [usuario, setUsuario] = useState(null);

    // Recupera dados do usuario assim que o componente for montado
    useEffect(() => {
        const u = get_usuario();
        if (u){
            setUsuario(u);
        }
    }, []);


    return (
        <>
        <SEO titulo={"Pagina Inicial"} descricao={"Pagina inicial do usuario."}/>
        <VerificarLogin />

        {/* Renderiza conteúdo apenas se o usuário estiver definido */}
        {usuario && (
            <div>
            <Menu />
            <h1 className="text-center">Bem-vindo, {usuario.nome}!</h1>
            <hr />
            <Busca />
            </div>
        )}
        </>
    );
}
