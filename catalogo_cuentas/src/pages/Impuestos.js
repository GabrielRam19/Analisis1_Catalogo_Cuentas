import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Impuestos() {
    const [cuentas, setCuentas] = useState([]);
    const [impuestos, setImpuestos] = useState([]);
    const [newImpuesto, setNewImpuesto] = useState({ CodigoCuenta: "", Porcentaje: "", TipoImpuesto: "V" });
    const [editingImpuesto, setEditingImpuesto] = useState(null);

    // Obtener cuentas e impuestos desde el servidor
    useEffect(() => {
        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => {
                setCuentas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las cuentas:", error);
            });

        axios.get("http://localhost:5000/api/impuestos")
            .then((response) => {
                setImpuestos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los impuestos:", error);
            });
    }, []);

    // Crear un nuevo impuesto
    const handleCreateImpuesto = () => {
        axios.post("http://localhost:5000/api/impuestos", newImpuesto)
            .then((response) => {
                setImpuestos([...impuestos, response.data]);
                setNewImpuesto({ CodigoCuenta: "", Porcentaje: "", TipoImpuesto: "V" });
            })
            .catch((error) => {
                console.error("Error al agregar el impuesto:", error);
            });
    };

    // Eliminar un impuesto
    const handleDeleteImpuesto = (idImpuesto) => {
        axios.delete(`http://localhost:5000/api/impuestos/${idImpuesto}`)
            .then(() => {
                setImpuestos(impuestos.filter((imp) => imp.IdImpuesto !== idImpuesto));
            })
            .catch((error) => {
                console.error("Error al eliminar el impuesto:", error);
            });
    };

    // Actualizar un impuesto
    const handleUpdateImpuesto = () => {
        if (editingImpuesto) {
            const impuestoActualizado = {
                CodigoCuenta: newImpuesto.CodigoCuenta,
                Porcentaje: newImpuesto.Porcentaje,
                TipoImpuesto: newImpuesto.TipoImpuesto,
            };

            axios.put(`http://localhost:5000/api/impuestos/${editingImpuesto.IdImpuesto}`, impuestoActualizado)
                .then((response) => {
                    setImpuestos(impuestos.map(imp => imp.IdImpuesto === editingImpuesto.IdImpuesto ? response.data : imp));
                    setNewImpuesto({ CodigoCuenta: "", Porcentaje: "", TipoImpuesto: "V" });
                    setEditingImpuesto(null);
                })
                .catch((error) => {
                    console.error("Error al actualizar el impuesto:", error);
                });
        }
    };

    const handleEditImpuesto = (impuesto) => {
        setEditingImpuesto(impuesto);
        setNewImpuesto({
            CodigoCuenta: impuesto.CodigoCuenta,
            Porcentaje: impuesto.Porcentaje,
            TipoImpuesto: impuesto.TipoImpuesto,
        });
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Impuestos por Cuenta</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold">{editingImpuesto ? "Editar Impuesto" : "Agregar Nuevo Impuesto"}</h3>
                <div className="flex gap-4 mb-4">
                    <select
                        value={newImpuesto.CodigoCuenta}
                        onChange={(e) => setNewImpuesto({ ...newImpuesto, CodigoCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccionar Cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                {cuenta.NombreCuenta} ({cuenta.CodigoCuenta})
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={newImpuesto.Porcentaje}
                        onChange={(e) => setNewImpuesto({ ...newImpuesto, Porcentaje: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Porcentaje de Impuesto"
                    />
                    <select
                        value={newImpuesto.TipoImpuesto}
                        onChange={(e) => setNewImpuesto({ ...newImpuesto, TipoImpuesto: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="V">IVA Ventas</option>
                        <option value="C">IVA Compras</option>
                    </select>
                    <button
                        onClick={editingImpuesto ? handleUpdateImpuesto : handleCreateImpuesto}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {editingImpuesto ? "Actualizar" : "Agregar"}
                    </button>
                </div>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Cuenta</th>
                        <th className="border px-4 py-2">Porcentaje</th>
                        <th className="border px-4 py-2">Tipo de Impuesto</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {impuestos.map((impuesto) => (
                        <tr key={impuesto.IdImpuesto} className="text-center">
                            <td className="border px-4 py-2">{impuesto.CodigoCuenta}</td>
                            <td className="border px-4 py-2">{impuesto.Porcentaje}%</td>
                            <td className="border px-4 py-2">
                                {impuesto.TipoImpuesto === "V" ? "IVA Ventas" : "IVA Compras"}
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDeleteImpuesto(impuesto.IdImpuesto)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleEditImpuesto(impuesto)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Impuestos;
