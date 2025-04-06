import "bootstrap/dist/css/bootstrap.min.css";


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
