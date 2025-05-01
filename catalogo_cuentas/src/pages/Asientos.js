import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Asientos() {
    const [asientos, setAsientos] = useState([]);
    const [newAsiento, setNewAsiento] = useState({ fecha: "", descripcion: "" });
    const [detalles, setDetalles] = useState([{ CodigoCuenta: "", debe: 0, haber: 0 }]);
    const [editAsiento, setEditAsiento] = useState(null);
    const [cuentas, setCuentas] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/asientos")
            .then((response) => setAsientos(response.data))
            .catch((error) => console.error("Error al obtener los asientos:", error));

        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => setCuentas(response.data))
            .catch((error) => console.error("Error al obtener las cuentas:", error));
    }, []);

    const handleAddDetalle = () => {
        setDetalles([...detalles, { CodigoCuenta: "", debe: 0, haber: 0 }]);
    };

    const handleRemoveDetalle = (index) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const handleDetalleChange = (index, field, value) => {
        const newDetalles = [...detalles];
        newDetalles[index][field] = value;
        setDetalles(newDetalles);
    };

    const handleCreate = () => {
        const payload = { ...newAsiento, detalles };
        axios.post("http://localhost:5000/api/asientos", payload)
            .then((response) => {
                setAsientos([...asientos, response.data.asiento]);
                setNewAsiento({ fecha: "", descripcion: "" });
                setDetalles([{ CodigoCuenta: "", debe: 0, haber: 0 }]);
            })
            .catch((error) => console.error("Error al crear el asiento:", error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/asientos/${id}`)
            .then(() => setAsientos(asientos.filter((asiento) => asiento.idAsiento !== id)))
            .catch((error) => console.error("Error al eliminar el asiento:", error));
    };

    const handleEdit = (asiento) => {
        setEditAsiento({ idAsiento: asiento.idAsiento, fecha: asiento.fecha, descripcion: asiento.descripcion });
        axios.get(`http://localhost:5000/api/asientos/${asiento.idAsiento}`)
            .then((response) => setDetalles(response.data.detalles || []))
            .catch((error) => console.error("Error al obtener detalles del asiento:", error));
    };

    const handleUpdate = () => {
        const payload = { ...editAsiento, detalles };
        axios.put(`http://localhost:5000/api/asientos/${editAsiento.idAsiento}`, payload)
            .then((response) => {
                const updatedAsientos = asientos.map((asiento) =>
                    asiento.idAsiento === editAsiento.idAsiento ? response.data.asiento : asiento
                );
                setAsientos(updatedAsientos);
                setEditAsiento(null);
                setNewAsiento({ fecha: "", descripcion: "" });
                setDetalles([{ CodigoCuenta: "", debe: 0, haber: 0 }]);
            })
            .catch((error) => console.error("Error al actualizar el asiento:", error));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Gestión de Asientos Contables
            </h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-semibold mb-4">
                    {editAsiento ? "Editar Asiento" : "Crear Nuevo Asiento"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="date"
                        value={editAsiento ? editAsiento.fecha : newAsiento.fecha}
                        onChange={(e) => {
                            const value = e.target.value;
                            editAsiento
                                ? setEditAsiento({ ...editAsiento, fecha: value })
                                : setNewAsiento({ ...newAsiento, fecha: value });
                        }}
                        className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        value={editAsiento ? editAsiento.descripcion : newAsiento.descripcion}
                        onChange={(e) => {
                            const value = e.target.value;
                            editAsiento
                                ? setEditAsiento({ ...editAsiento, descripcion: value })
                                : setNewAsiento({ ...newAsiento, descripcion: value });
                        }}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Descripción del Asiento"
                    />
                </div>

                <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-2">Detalle de Asiento</h4>
                    {detalles.map((detalle, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                            <select
                                value={detalle.CodigoCuenta}
                                onChange={(e) =>
                                    handleDetalleChange(index, "CodigoCuenta", e.target.value)
                                }
                                className="p-2 border rounded"
                            >
                                <option value="">Seleccione una cuenta</option>
                                {cuentas.map((cuenta) => (
                                    <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                        {cuenta.CodigoCuenta}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Debe"
                                value={detalle.debe}
                                onChange={(e) =>
                                    handleDetalleChange(index, "debe", parseFloat(e.target.value) || 0)
                                }
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Haber"
                                value={detalle.haber}
                                onChange={(e) =>
                                    handleDetalleChange(index, "haber", parseFloat(e.target.value) || 0)
                                }
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() => handleRemoveDetalle(index)}
                                className="bg-red-500 text-white px-3 rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddDetalle}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Agregar Detalle
                    </button>
                </div>

                <button
                    onClick={editAsiento ? handleUpdate : handleCreate}
                    className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg"
                >
                    {editAsiento ? "Actualizar Asiento" : "Crear Asiento"}
                </button>
            </div>

            {/* Tabla de Asientos */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="py-3 px-6 text-left">Fecha</th>
                            <th className="py-3 px-6 text-left">Descripción</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {asientos.map((asiento) => (
                            <tr key={asiento.idAsiento} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-6">{asiento.fecha}</td>
                                <td className="py-3 px-6">{asiento.descripcion}</td>
                                <td className="py-3 px-6 flex justify-start gap-4">
                                    <button
                                        onClick={() => handleEdit(asiento)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asiento.idAsiento)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Asientos;
