import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Cuentas() {
    // Estados para almacenar las cuentas, grupos y la cuenta a crear/editar
    const [cuentas, setCuentas] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [newCuenta, setNewCuenta] = useState({ CodigoCuenta: "", NombreCuenta: "", TipoCuenta: "A", Estado: "A", IdGrupo: "" });
    const [editCuenta, setEditCuenta] = useState(null);

    // Obtener las cuentas y los grupos desde el servidor
    useEffect(() => {
        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => {
                setCuentas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las cuentas:", error);
            });

        axios.get("http://localhost:5000/api/grupos")
            .then((response) => {
                setGrupos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los grupos:", error);
            });
    }, []);

    // Crear una nueva cuenta
    const handleCreate = () => {
        axios.post("http://localhost:5000/api/cuentas", newCuenta)
            .then((response) => {
                setCuentas([...cuentas, response.data]);  // Agregar la nueva cuenta al listado
                setNewCuenta({ CodigoCuenta: "", NombreCuenta: "", TipoCuenta: "A", Estado: "A", IdGrupo: "" });
            })
            .catch((error) => {
                console.error("Error al crear la cuenta:", error);
            });
    };

    // Eliminar una cuenta
    const handleDelete = (codigo) => {
        axios.delete(`http://localhost:5000/api/cuentas/${codigo}`)
            .then(() => {
                setCuentas(cuentas.filter((cuenta) => cuenta.CodigoCuenta !== codigo));  // Eliminar la cuenta de la lista
            })
            .catch((error) => {
                console.error("Error al eliminar la cuenta:", error);
            });
    };

    // Editar una cuenta
    const handleEdit = (cuenta) => {
        setEditCuenta(cuenta);
    };

    // Actualizar una cuenta
    const handleUpdate = () => {
        axios.put(`http://localhost:5000/api/cuentas/${editCuenta.CodigoCuenta}`, editCuenta)
            .then((response) => {
                const updatedCuentas = cuentas.map((cuenta) =>
                    cuenta.CodigoCuenta === editCuenta.CodigoCuenta ? response.data : cuenta
                );
                setCuentas(updatedCuentas);
                setEditCuenta(null);
            })
            .catch((error) => {
                console.error("Error al actualizar la cuenta:", error);
            });
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Cuentas Contables</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold">Crear Nueva Cuenta</h3>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={newCuenta.CodigoCuenta}
                        onChange={(e) => setNewCuenta({ ...newCuenta, CodigoCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Código de Cuenta"
                    />
                    <input
                        type="text"
                        value={newCuenta.NombreCuenta}
                        onChange={(e) => setNewCuenta({ ...newCuenta, NombreCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Nombre de Cuenta"
                    />
                    <select
                        value={newCuenta.TipoCuenta}
                        onChange={(e) => setNewCuenta({ ...newCuenta, TipoCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="A">Activo</option>
                        <option value="P">Pasivo</option>
                        <option value="I">Ingreso</option>
                        <option value="G">Gasto</option>
                        <option value="C">Capital</option>
                    </select>
                    <select
                        value={newCuenta.Estado}
                        onChange={(e) => setNewCuenta({ ...newCuenta, Estado: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                    </select>

                    <select
                        value={newCuenta.IdGrupo}
                        onChange={(e) => setNewCuenta({ ...newCuenta, IdGrupo: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccionar Grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.IdGrupo} value={grupo.IdGrupo}>
                                {grupo.NombreGrupo}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Crear
                    </button>
                </div>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Código</th>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Tipo</th>
                        <th className="border px-4 py-2">Estado</th>
                        <th className="border px-4 py-2">Grupo</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cuentas.map((cuenta) => (
                        <tr key={cuenta.CodigoCuenta} className="text-center">
                            <td className="border px-4 py-2">{cuenta.CodigoCuenta}</td>
                            <td className="border px-4 py-2">{cuenta.NombreCuenta}</td>
                            <td className="border px-4 py-2">{cuenta.TipoCuenta}</td>
                            <td className="border px-4 py-2">{cuenta.Estado}</td>
                            <td className="border px-4 py-2">{cuenta.IdGrupo}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEdit(cuenta)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(cuenta.CodigoCuenta)}
                                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editCuenta && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Editar Cuenta</h3>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={editCuenta.NombreCuenta}
                            onChange={(e) => setEditCuenta({ ...editCuenta, NombreCuenta: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                            placeholder="Nombre de Cuenta"
                        />
                        <select
                            value={editCuenta.TipoCuenta}
                            onChange={(e) => setEditCuenta({ ...editCuenta, TipoCuenta: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="A">Activo</option>
                            <option value="P">Pasivo</option>
                            <option value="I">Ingreso</option>
                            <option value="G">Gasto</option>
                        </select>
                        <select
                            value={editCuenta.Estado}
                            onChange={(e) => setEditCuenta({ ...editCuenta, Estado: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="A">Activo</option>
                            <option value="I">Inactivo</option>
                        </select>

                        <select
                            value={editCuenta.IdGrupo}
                            onChange={(e) => setEditCuenta({ ...editCuenta, IdGrupo: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar Grupo</option>
                            {grupos.map((grupo) => (
                                <option key={grupo.IdGrupo} value={grupo.IdGrupo}>
                                    {grupo.NombreGrupo}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cuentas;
