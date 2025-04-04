import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";

function Home() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra superior */}
            <header className="bg-blue-600 p-4 text-white">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Sistema Contable</h1>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link to="/cuentas" className="hover:text-gray-300">Cuentas Contables</Link>
                            </li>
                            <li>
                                <Link to="/grupos" className="hover:text-gray-300">Grupos de Cuentas</Link>
                            </li>
                            <li>
                                <Link to="/jerarquias" className="hover:text-gray-300">Jerarquía de Cuentas</Link>
                            </li>
                            <li>
                                <Link to="/estado-financiero" className="hover:text-gray-300">Estado Financiero</Link>
                            </li>
                            <li>
                                <Link to="/impuestos" className="hover:text-gray-300">Impuestos</Link>
                            </li>
                            <li>
                                <Link to="/auditoria" className="hover:text-gray-300">Auditoría</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center mt-10">
                <h2 className="text-2xl font-bold mb-4">Bienvenido al Sistema Contable</h2>
                <p className="text-gray-600">Elige una opción en la barra superior para gestionar los datos contables.</p>
            </div>
        </div>
    );
}

export default Home;
