import { useRouter } from "next/router";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


export default function RedirecionarParaLista() {
    const r = useRouter();
    const { lista_id } = r.query;

    useEffect(() => {
        if (lista_id) {
            r.replace(`/Listas/Dados?lista_id=${lista_id}`);
        }
    }, [lista_id]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Redirecionando para lista...</p>
            </div>
        </div>
    );
}
