import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

// Función para ajustar la fecha a la zona horaria de Guatemala
function formatDate(date) {
    // Asegurarnos de que la fecha esté en la zona horaria local
    const localDate = new Date(date); // Si el date ya es UTC, lo convierte a hora local

    // Ajustar la hora si hay una diferencia (por ejemplo, si la diferencia es de -6 horas)
    localDate.setHours(localDate.getHours() + 6); // Ajuste de la hora local (puedes cambiar el -6 si es otra diferencia)

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const formattedDate = localDate.toLocaleString('en-US', options);

    return formattedDate.replace(',', '').replace('AM', 'A.M.').replace('PM', 'P.M.');
}

function AuditoriaCuentas() {
    const [auditorias, setAuditorias] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [newAuditoria, setNewAuditoria] = useState({ CodigoCuenta: "", Accion: "" });
    const [editingAuditoria, setEditingAuditoria] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/auditorias")
            .then((response) => {
                setAuditorias(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las auditorías:", error);
            });

        axios.get("http://localhost:5000/api/cuentas")
            .then((response) => {
                setCuentas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las cuentas:", error);
            });
    }, []);

    // Crear nueva auditoría
    const handleCreateAuditoria = () => {
        axios.post("http://localhost:5000/api/auditorias", newAuditoria)
            .then((response) => {
                setAuditorias([...auditorias, response.data]);
                setNewAuditoria({ CodigoCuenta: "", Accion: "" });
            })
            .catch((error) => {
                console.error("Error al agregar la auditoría:", error);
            });
    };

    // Eliminar auditoría
    const handleDeleteAuditoria = (idAuditoria) => {
        axios.delete(`http://localhost:5000/api/auditorias/${idAuditoria}`)
            .then(() => {
                setAuditorias(auditorias.filter((audit) => audit.IdAuditoria !== idAuditoria));
            })
            .catch((error) => {
                console.error("Error al eliminar la auditoría:", error);
            });
    };

    // Actualizar auditoría
    const handleUpdateAuditoria = () => {
        if (editingAuditoria) {
            const updatedAuditoria = {
                CodigoCuenta: newAuditoria.CodigoCuenta,
                Accion: newAuditoria.Accion,
            };

            axios.put(`http://localhost:5000/api/auditorias/${editingAuditoria.IdAuditoria}`, updatedAuditoria)
                .then((response) => {
                    setAuditorias(
                        auditorias.map((audit) =>
                            audit.IdAuditoria === editingAuditoria.IdAuditoria ? response.data : audit
                        )
                    );
                    setNewAuditoria({ CodigoCuenta: "", Accion: "" });
                    setEditingAuditoria(null);
                })
                .catch((error) => {
                    console.error("Error al actualizar la auditoría:", error);
                });
        }
    };

    // Cargar auditoría en el formulario de edición
    const handleEditAuditoria = (auditoria) => {
        setEditingAuditoria(auditoria);
        setNewAuditoria({
            CodigoCuenta: auditoria.CodigoCuenta,
            Accion: auditoria.Accion,
        });
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Auditoría de Cuentas Contables</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold">{editingAuditoria ? "Editar Auditoría" : "Agregar Nueva Auditoría"}</h3>
                <div className="flex gap-4 mb-4">
                    <select
                        value={newAuditoria.CodigoCuenta}
                        onChange={(e) => setNewAuditoria({ ...newAuditoria, CodigoCuenta: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Seleccione una cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.CodigoCuenta} value={cuenta.CodigoCuenta}>
                                {cuenta.CodigoCuenta} - {cuenta.NombreCuenta}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={newAuditoria.Accion}
                        onChange={(e) => setNewAuditoria({ ...newAuditoria, Accion: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Acción"
                    />
                    <button
                        onClick={editingAuditoria ? handleUpdateAuditoria : handleCreateAuditoria}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {editingAuditoria ? "Actualizar" : "Agregar"}
                    </button>
                </div>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Código Cuenta</th>
                        <th className="border px-4 py-2">Acción</th>
                        <th className="border px-4 py-2">Fecha de Cambio</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {auditorias.map((auditoria) => (
                        <tr key={auditoria.IdAuditoria} className="text-center">
                            <td className="border px-4 py-2">{auditoria.CodigoCuenta}</td>
                            <td className="border px-4 py-2">{auditoria.Accion}</td>
                            <td className="border px-4 py-2">{formatDate(auditoria.FechaCambio)}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDeleteAuditoria(auditoria.IdAuditoria)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleEditAuditoria(auditoria)}
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

export default AuditoriaCuentas;
