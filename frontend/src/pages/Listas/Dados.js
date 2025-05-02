import { useRouter } from "next/router"
import SEO from "@/components/SEO.js";
import Menu from "@/components/Menu/Menu.js";
import Listagem from "@/components/Listagem/Listagem.js";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";


export default function home(){
    const router = useRouter();
    const { lista_id, lista_nome } = router.query;
    const usuario = get_usuario();

    return (
        <>
        <main>
            <SEO titulo={"Favoritos"} descricao={"Pagina de favoritos do usuario"}/>
            <Menu />
            <Listagem header={{"canal": 5, "code": lista_id, "titulo": lista_nome, "user_id": usuario.id}}/>
        </main>
        </>
    )
}
