import { useRouter } from "next/router";
import Menu from "@/components/Menu/Menu.js";
import Listagem from "@/components/Listagem/Listagem.js";
import { get_usuario } from "@/utils/get_usuario/get_usuario.js";
import { useState, useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { lista_id } = router.query;
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            // Tenta obter o usuário logado
            const user = get_usuario();
            if (user) {
                setUsuario(user);
            }else {
                setUsuario(false);
            }
        // Se falhar, define como objeto vazio
        } catch (err) {
            console.error(err);
            setUsuario({ id: '' });
        // Marca como "carregando concluído"
        } finally {
            setLoading(true);
        }
    }, []);

    return (
        <main>
            {/* Só mostra o menu se o usuario estiver logado */}
            {usuario && (
                <Menu />
            )}
            {/* Somente renderiza a listagem se loading for verdadeiro e houver um lista_id válido */}
            {loading && lista_id && (
                <Listagem header={{ canal: 5, code: lista_id, user_id: usuario.id }} />
            )}
        </main>
    );
}
