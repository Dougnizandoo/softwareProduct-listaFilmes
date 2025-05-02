import SEO from "@/components/SEO.js"
import Menu from "@/components/Menu/Menu.js"
import { get_usuario } from "@/utils/get_usuario/get_usuario.js"
import Listagem from "@/components/Listagem/Listagem.js"


export default function Favoritos(){
    const usuario = get_usuario();

    return (
        <>
        <SEO titulo={"Favoritos"} descricao={"Pagina de favoritos do usuario"}/>
        <Menu />
        <Listagem header={{"canal": 1, "code": usuario.id}}/>
        </>
    )
}