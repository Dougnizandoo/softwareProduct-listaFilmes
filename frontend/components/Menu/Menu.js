import Link from "next/link"
import "bootstrap/dist/css/bootstrap.min.css";


export default function Menu(){

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="container-fluid">
                <div id="div-1" className="navbar-nav me-auto d-flex">
                    <Link href={"/"} legacyBehavior={true}>
                        <a id="pgInicial" className="nav-link fs-3"><li>Inicio</li></a>
                    </Link>
                </div>

                <div id="div-2" className="navbar-nav">
                    <Link href={"/Usuario"} legacyBehavior={true}>
                        <a id="pgUsuario" className="nav-link btn btn-lg px-3 fs-4"><li>Perfil</li></a>
                    </Link>
                </div>
            </ul>
        </nav>
    )
}