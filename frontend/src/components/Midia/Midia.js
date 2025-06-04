import "bootstrap/dist/css/bootstrap.min.css";


/**
 *
 * Componente React que exibe os detalhes de um filme ou série.
 * Renderiza uma mensagem de erro caso `dados` não seja fornecido.
 * 
 * @param {Object} props
 * @param {Object} props.dados - Objeto contendo os detalhes da mídia.
 * @param {string} props.dados.nome - Nome do filme ou série.
 * @param {string} props.dados.poster - URL da imagem do poster.
 * @param {string} props.dados.descricao - Descrição da mídia.
 * @param {string[]} props.dados.genero - Lista de gêneros.
 * @param {number} props.dados.tipo_midia - Tipo da mídia (0 = filme, 1 = série).
 * 
 * // Para filmes (tipo_midia === 0)
 * @param {string[]} [props.dados.pais_origem] - Lista dos países de origem.
 * @param {number} [props.dados.duracao] - Duração em minutos.
 * @param {string} [props.dados.data_lancamento] - Data de lançamento.
 * @param {number} [props.dados.arrecadou] - Valor arrecadado.
 * 
 * // Para séries (tipo_midia === 1)
 * @param {number} [props.dados.num_episodios] - Número de episódios.
 * @param {number} [props.dados.num_temporadas] - Número de temporadas.
 * @param {string} [props.dados.data_primeiro_ep] - Data do primeiro episódio.
 * @param {string} [props.dados.status] - Status da série.
 * 
 * 
 * @returns {JSX.Element} Elemento React com os detalhes da mídia.
 */
export default function Details({dados}){
    return(
        <>
            {!dados && <span className="text-danger">Dados não foram informados</span>}

            {dados && (
                <div className="container mt-4">
                    <div className="card shadow-lg">
                        <div className="card-header text-center bg-dark text-white">
                            <h2 className="mb-0">{dados.nome}</h2>
                        </div>
                        
                        <div className="card-body d-flex flex-column flex-md-row">
                            {/* Imagem à esquerda */}
                            <img 
                                src={dados.poster} 
                                alt={`Poster de ${dados.nome}`} 
                                className="img-fluid rounded mx-auto d-block"
                                style={{ maxWidth: "300px", height: "auto" }}
                            />

                            {/* Detalhes à direita */}
                            <div className="ms-md-4 mt-3 mt-md-0">
                                <p className="fst-italic">{dados.descricao}</p>

                                <h5 className="fw-bold">Gêneros:</h5>
                                <ul className="list-group mb-3">
                                    {dados.genero.map((genero, index) => (
                                        <li key={index} className="list-group-item">{genero}</li>
                                    ))}
                                </ul>

                                {dados.tipo_midia === 1 ? (
                                    <>
                                        <p><b>Episódios:</b> {dados.num_episodios}</p>
                                        <p><b>Temporadas:</b> {dados.num_temporadas}</p>
                                        <p><b>Estreia do Primeiro Episódio:</b> {dados.data_primeiro_ep}</p>
                                        <p><b>Status da série:</b> {dados.status}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><b>País de Origem:</b> {dados.pais_origem}</p>
                                        <p><b>Duração:</b> {dados.duracao} min</p>
                                        <p><b>Data de Estreia:</b> {dados.data_lancamento}</p>
                                        <p><b>Arrecadação:</b> U$ {dados.arrecadou},00</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
