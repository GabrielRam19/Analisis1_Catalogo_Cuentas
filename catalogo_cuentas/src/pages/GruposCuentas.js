import { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function GruposCuentas() {
    const [grupos, setGrupos] = useState([]);
    const [nombreGrupo, setNombreGrupo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editando, setEditando] = useState(false);
    const [idGrupo, setIdGrupo] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/grupos')
            .then(response => {
                setGrupos(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los grupos:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoGrupo = { NombreGrupo: nombreGrupo, Descripcion: descripcion };

        if (editando) {
            // Actualizar el grupo
            axios.put(`http://localhost:5000/api/grupos/${idGrupo}`, nuevoGrupo)
                .then(() => {
                    setGrupos(grupos.map(grupo => grupo.IdGrupo === idGrupo ? { ...grupo, ...nuevoGrupo } : grupo));
                    setEditando(false);
                    setIdGrupo(null);
                    setNombreGrupo('');
                    setDescripcion('');
                })
                .catch(error => console.error('Error al actualizar grupo', error));
        } else {
            // Crear un nuevo grupo
            axios.post('http://localhost:5000/api/grupos', nuevoGrupo)
                .then(response => {
                    const grupoCreado = response.data;
                    if (grupoCreado && grupoCreado.IdGrupo) {
                        setGrupos([...grupos, grupoCreado]);
                        setNombreGrupo('');
                        setDescripcion('');
                    } else {
                        console.error('Error: El grupo creado no tiene un IdGrupo válido');
                    }
                })
                .catch(error => console.error('Error al crear grupo', error));
        }
    };

    const handleEdit = (grupo) => {
        setEditando(true);
        setIdGrupo(grupo.IdGrupo);
        setNombreGrupo(grupo.NombreGrupo);
        setDescripcion(grupo.Descripcion);
    };

    const handleDelete = (idGrupo) => {
        axios.delete(`http://localhost:5000/api/grupos/${idGrupo}`)
            .then(() => {
                setGrupos(grupos.filter(grupo => grupo.IdGrupo !== idGrupo));
            })
            .catch(error => console.error('Error al eliminar grupo', error));
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Gestión de Grupos de Cuentas</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    placeholder="Nombre del Grupo"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg mb-2 w-full"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                    {editando ? "Actualizar Grupo" : "Crear Grupo"}
                </button>
            </form>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Nombre del Grupo</th>
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {grupos.map((grupo) => (
                        <tr key={grupo.IdGrupo}>
                            <td className="border px-4 py-2">{grupo.NombreGrupo}</td>
                            <td className="border px-4 py-2">{grupo.Descripcion}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEdit(grupo)}
                                    className="px-4 py-1 bg-yellow-400 text-white rounded-lg mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(grupo.IdGrupo)}
                                    className="px-4 py-1 bg-red-500 text-white rounded-lg"
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

export default GruposCuentas;
