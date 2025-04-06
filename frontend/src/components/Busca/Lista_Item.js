import Item from "./Item";


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
