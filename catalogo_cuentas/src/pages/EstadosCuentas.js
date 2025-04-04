import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function EstadosFinancieros() {
    // Estados para almacenar las cuentas, los estados financieros y los datos de los formularios
    const [cuentas, setCuentas] = useState([]);
    const [estadosFinancieros, setEstadosFinancieros] = useState([]);
    const [newEstado, setNewEstado] = useState({ CodigoCuenta: "", TipoEstado: "B" });
    const [editEstado, setEditEstado] = useState(null); // Estado para almacenar el estado financiero que se editará

    // Obtener las cuentas y los estados financieros desde el servidor
    useEffect(() => {
        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => {
                setCuentas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las cuentas:", error);
            });

        axios.get("http://localhost:5000/api/estados-financieros")
            .then((response) => {
                setEstadosFinancieros(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los estados financieros:", error);
            });
    }, []);

    const handleCreateEstado = () => {
        axios.post("http://localhost:5000/api/estados-financieros", newEstado)
            .then((response) => {
                setEstadosFinancieros([...estadosFinancieros, response.data]);
                setNewEstado({ CodigoCuenta: "", TipoEstado: "B" });
            })
            .catch((error) => {
                console.error("Error al asociar la cuenta a un estado financiero:", error);
            });
    };

    const handleUpdateEstado = () => {
        axios.put(`http://localhost:5000/api/estados-financieros/${editEstado.IdEstadoFinanciero}`, editEstado)
            .then((response) => {
                setEstadosFinancieros(estadosFinancieros.map(estado =>
                    estado.IdEstadoFinanciero === editEstado.IdEstadoFinanciero ? response.data : estado
                ));
                setEditEstado(null); // Limpiar el estado de edición
            })
            .catch((error) => {
                console.error("Error al actualizar el estado financiero:", error);
            });
    };

    // Eliminar la asociación de estado financiero
    const handleDeleteEstado = (idEstado) => {
        axios.delete(`http://localhost:5000/api/estados-financieros/${idEstado}`)
            .then(() => {
                setEstadosFinancieros(estadosFinancieros.filter((e) => e.IdEstadoFinanciero !== idEstado));
            })
            .catch((error) => {
                console.error("Error al eliminar la asociación:", error);
            });
    };

    // Hacer que el formulario de edición se rellene con los datos del estado financiero
    const handleEditEstado = (estado) => {
        setEditEstado(estado);
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Estados Financieros</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold">Asociar Nueva Cuenta a un Estado Financiero</h3>
                <div className="flex gap-4 mb-4">
                    <select
                        value={newEstado.CodigoCuenta}
                        onChange={(e) => setNewEstado({ ...newEstado, CodigoCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccionar Cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                            </option>
                        ))}
                    </select>
                    <select
                        value={newEstado.TipoEstado}
                        onChange={(e) => setNewEstado({ ...newEstado, TipoEstado: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="B">Balance General</option>
                        <option value="R">Estado de Resultados</option>
                    </select>
                    <button
                        onClick={handleCreateEstado}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Asociar
                    </button>
                </div>
            </div>

            {editEstado && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Editar Estado Financiero</h3>
                    <div className="flex gap-4 mb-4">
                        <select
                            value={editEstado.CodigoCuenta}
                            onChange={(e) => setEditEstado({ ...editEstado, CodigoCuenta: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar Cuenta</option>
                            {cuentas.map((cuenta) => (
                                <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                    {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                                </option>
                            ))}
                        </select>
                        <select
                            value={editEstado.TipoEstado}
                            onChange={(e) => setEditEstado({ ...editEstado, TipoEstado: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="B">Balance General</option>
                            <option value="R">Estado de Resultados</option>
                        </select>
                        <button
                            onClick={handleUpdateEstado}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            )}

            {/* Mostrar listado de estados financieros */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Cuenta</th>
                        <th className="border px-4 py-2">Estado Financiero</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estadosFinancieros.map((estado) => (
                        <tr key={estado.IdEstadoFinanciero} className="text-center">
                            <td className="border px-4 py-2">{estado.CodigoCuenta}</td>
                            <td className="border px-4 py-2">
                                {estado.TipoEstado === "B" ? "Balance General" : "Estado de Resultados"}
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEditEstado(estado)} // Mostrar formulario de edición con los datos de la fila
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteEstado(estado.IdEstadoFinanciero)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EstadosFinancieros;
