import { get_usuario } from "../../utils/get_usuario/get_usuario";
import { useRouter } from "next/router";
import { useEffect } from "react";


/**
  * Componente React para verificar se o usuário está logado.
 * Caso o usuário não esteja logado, exibe um alerta e redireciona para a página de login.
 * 
 * @component
 * @returns {null} Este componente não renderiza nada visualmente.
 */
export default function VerificarLogin(){
    const router = useRouter();

    useEffect(() => {
        if (!get_usuario()){
            alert('Parece que você não está logado!\nRedirecionando para area de login!')
            router.replace("/Perfil/Login")
        }
    }, [])

    return null;
}
