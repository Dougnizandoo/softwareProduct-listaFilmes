import SEO from "@/components/SEO.js"
import Menu from "@/components/Menu/Menu.js"
import { get_usuario } from "@/utils/get_usuario/get_usuario.js"
import { useState, useEffect } from "react"
import Listagem from "@/components/Listagem/Listagem.js"
import VerificarLogin from "@/components/VerificarLogin/verificar_login"


export default function Favoritos(){
    const [usuario, setUsuario] = useState(null);

    // Obtém o usuário do localStorage ao montar o componente
    useEffect(() => {
        const u = get_usuario();
        if (u){
            setUsuario(u); 
        }
    }, [])

    return (
        <>
        <SEO titulo={"Favoritos"} descricao={"Pagina de favoritos do usuario"}/>
        <Menu />
        <VerificarLogin />
        {/* Se o usuário estiver autenticado, renderiza a listagem dos favoritos */}
        {usuario && (
            <Listagem header={{"canal": 1, "code": usuario.id}}/>
        )}
        </>
    )
}