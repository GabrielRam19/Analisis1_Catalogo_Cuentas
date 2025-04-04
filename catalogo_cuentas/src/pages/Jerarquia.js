import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function JerarquiaCuentas() {
    // Estados para almacenar las cuentas, la jerarquía y la jerarquía a modificar
    const [cuentas, setCuentas] = useState([]);
    const [jerarquia, setJerarquia] = useState([]);
    const [newJerarquia, setNewJerarquia] = useState({ CodigoCuentaPadre: "", CodigoCuentaHijo: "", Nivel: 1 });
    const [editJerarquia, setEditJerarquia] = useState({ IdJerarquia: null, CodigoCuentaPadre: "", CodigoCuentaHijo: "", Nivel: 1 });

    // Obtener las cuentas y la jerarquía desde el servidor
    useEffect(() => {
        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => {
                setCuentas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las cuentas:", error);
            });

        axios.get("http://localhost:5000/api/jerarquia")
            .then((response) => {
                setJerarquia(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener la jerarquía:", error);
            });
    }, []);

    // Crear una nueva relación jerárquica entre cuentas
    const handleCreateJerarquia = () => {
        axios.post("http://localhost:5000/api/jerarquia", newJerarquia)
            .then((response) => {
                setJerarquia([...jerarquia, response.data]);  // Agregar la nueva jerarquía
                setNewJerarquia({ CodigoCuentaPadre: "", CodigoCuentaHijo: "", Nivel: 1 });
            })
            .catch((error) => {
                console.error("Error al crear la jerarquía:", error);
            });
    };

    // Modificar una jerarquía existente
    const handleEditJerarquia = () => {
        axios.put(`http://localhost:5000/api/jerarquia/${editJerarquia.IdJerarquia}`, editJerarquia)
            .then((response) => {
                setJerarquia(jerarquia.map((j) =>
                    j.IdJerarquia === editJerarquia.IdJerarquia ? response.data : j
                ));  // Actualizar la jerarquía modificada
                setEditJerarquia({ IdJerarquia: null, CodigoCuentaPadre: "", CodigoCuentaHijo: "", Nivel: 1 });
            })
            .catch((error) => {
                console.error("Error al modificar la jerarquía:", error);
            });
    };

    // Eliminar una relación jerárquica
    const handleDeleteJerarquia = (idJerarquia) => {
        axios.delete(`http://localhost:5000/api/jerarquia/${idJerarquia}`)
            .then(() => {
                setJerarquia(jerarquia.filter((j) => j.IdJerarquia !== idJerarquia));  // Eliminar la jerarquía
            })
            .catch((error) => {
                console.error("Error al eliminar la jerarquía:", error);
            });
    };

    // Rellenar los campos de edición con la jerarquía seleccionada
    const handleSelectJerarquiaForEdit = (jerarquiaSeleccionada) => {
        setEditJerarquia(jerarquiaSeleccionada);
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Jerarquía de Cuentas</h2>

            {/* Formulario para crear una nueva jerarquía */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold">Crear Nueva Jerarquía</h3>
                <div className="flex gap-4 mb-4">
                    <select
                        value={newJerarquia.CodigoCuentaPadre}
                        onChange={(e) => setNewJerarquia({ ...newJerarquia, CodigoCuentaPadre: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccionar Cuenta Padre</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                            </option>
                        ))}
                    </select>
                    <select
                        value={newJerarquia.CodigoCuentaHijo}
                        onChange={(e) => setNewJerarquia({ ...newJerarquia, CodigoCuentaHijo: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccionar Cuenta Hijo</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={newJerarquia.Nivel}
                        onChange={(e) => setNewJerarquia({ ...newJerarquia, Nivel: parseInt(e.target.value) })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Nivel"
                    />
                    <button
                        onClick={handleCreateJerarquia}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Crear
                    </button>
                </div>
            </div>

            {/* Formulario para editar una jerarquía */}
            {editJerarquia.IdJerarquia && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Editar Jerarquía</h3>
                    <div className="flex gap-4 mb-4">
                        <select
                            value={editJerarquia.CodigoCuentaPadre}
                            onChange={(e) => setEditJerarquia({ ...editJerarquia, CodigoCuentaPadre: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar Cuenta Padre</option>
                            {cuentas.map((cuenta) => (
                                <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                    {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                                </option>
                            ))}
                        </select>
                        <select
                            value={editJerarquia.CodigoCuentaHijo}
                            onChange={(e) => setEditJerarquia({ ...editJerarquia, CodigoCuentaHijo: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar Cuenta Hijo</option>
                            {cuentas.map((cuenta) => (
                                <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                    {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={editJerarquia.Nivel}
                            onChange={(e) => setEditJerarquia({ ...editJerarquia, Nivel: parseInt(e.target.value) })}
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Nivel"
                        />
                        <button
                            onClick={handleEditJerarquia}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Modificar
                        </button>
                    </div>
                </div>
            )}

            {/* Mostrar listado de jerarquías */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Cuenta Padre</th>
                        <th className="border px-4 py-2">Cuenta Hijo</th>
                        <th className="border px-4 py-2">Nivel</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {jerarquia.map((j) => (
                        <tr key={j.IdJerarquia} className="text-center">
                            <td className="border px-4 py-2">{j.CodigoCuentaPadre}</td>
                            <td className="border px-4 py-2">{j.CodigoCuentaHijo}</td>
                            <td className="border px-4 py-2">{j.Nivel}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDeleteJerarquia(j.IdJerarquia)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleSelectJerarquiaForEdit(j)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                                >
                                    Modificar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default JerarquiaCuentas;
