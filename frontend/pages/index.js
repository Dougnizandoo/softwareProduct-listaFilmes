import SEO from "../components/SEO"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Menu from "../components/Menu/Menu";
import { get_usuario } from "../code/Usuario/Usuario";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Home(){
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);


    useEffect(() => {
        const busca_usuario = get_usuario();
        if (!busca_usuario) router.replace("/Usuario/Login");
        else setUsuario(busca_usuario);
    }, [router]);


    return (
        <>
        <SEO titulo={"Pagina Inicial"} descricao={"Pagina inicial do usuario."}/>
        {usuario && (
            <div>
            <Menu />
            <h1 className="text-center">Bem-vindo, {usuario.nome}!</h1>
            <hr />
            </div>
        )}
        </>
    );
}
