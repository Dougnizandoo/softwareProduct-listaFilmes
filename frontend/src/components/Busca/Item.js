import { useRouter } from "next/router"
import "bootstrap/dist/css/bootstrap.min.css";


/**
 * Componente React que exibe um cartão com detalhes básicos de uma mídia (filme ou série).
 * 
 * Funcionalidade principal:
 * - Ao clicar no card, armazena no localStorage a última mídia pesquisada (id e tipo) e redireciona para a rota de detalhes.
 * 
 * @param {Object} item - Objeto contendo os dados da mídia.
 * @param {string} item.id - Identificador da mídia (ex: TMDB id).
 * @param {string} item.nome - Nome da mídia.
 * @param {string} item.poster - URL do pôster da mídia.
 * @param {Array<string>} item.genero - Lista de gêneros da mídia.
 * @param {number} item.tipo_midia - Tipo da mídia (ex: 0 para filme, 1 para série).
 * 
 * @param {string} rota_saida - Caminho para onde será redirecionado ao clicar no card.
 * 
 * @returns {JSX.Element} Cartão interativo com informações resumidas da mídia.
 */
export default function Item({ item, rota_saida }){
    const router = useRouter();

    // Salva a ultima busca do usuario no localStorage
    function setUltimaBusca(event){
        event.preventDefault();
        let tmdb_id = event.currentTarget.getAttribute("data-id");
        let tipo = event.currentTarget.getAttribute("data-type");
        localStorage.setItem("ultima_pesquisa", JSON.stringify({"tmdb_id": tmdb_id, "tipo": tipo}));
        router.push(`/${rota_saida}`)
    }

    return(
        <div
            className="card m-3 shadow d-flex flex-row"
            style={{ cursor: "pointer", maxWidth: "800px", maxHeight: "600px" }}
            onClick={setUltimaBusca}
            data-id={item.id}
            data-type={item.tipo_midia}
        >
            <img
                src={item.poster}
                className="img-fluid rounded-start"
                alt="Imagem indisponível"
                style={{ width: "50%", height: "100%", objectFit: "contain", borderRadius: "16px" }}
            />
            <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-center"><strong>{item.nome}</strong></h5>
                <hr />
                <div>
                    <ul className="list-unstyled mb-0 list-group">
                        {item.genero.map((genero, index) => (
                            <li key={index} className="list-group-item">{genero}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}