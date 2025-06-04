import Item from "./Item";


/**
 * Componente React que renderiza uma lista de itens de mídia em formato de grade responsiva.
 * 
 * Cada item da lista é exibido utilizando o componente <Item />.
 * 
 * @param {Array<Object>} dados - Array de objetos contendo os dados das mídias a serem exibidas.
 * @param {string} [rota_saida="Detalhes"] - Rota para onde cada item irá redirecionar ao ser clicado.
 * 
 * @returns {JSX.Element} Grade responsiva contendo os cards de mídia.
 */
export default function Lista_Item({dados, rota_saida="Detalhes"}){
    return (
        <div className="container mt-4">
            <div className="row">
                {dados.map((item, index) => (
                    <div
                        className="col-12 col-sm-6 col-md-4 row-g4 d-flex justify-content-center"
                        key={index}
                    >
                        <Item item={item} rota_saida={rota_saida} />
                    </div>
                ))}
            </div>
        </div>
    );
}
