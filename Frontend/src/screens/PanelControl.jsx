// src/screens/PanelControl.jsx
import React, { useState, useEffect} from 'react';
import '../css/PanelControl.css';

export const PanelControl = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ usuario: '', contrasena: '', roles: '' });
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const rolesOptions = ['Admin', 'Jefe de Area', 'Secretaria'];

  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


  useEffect(() => {
    fetchUsuarios();
  }, []);


  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/users/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${apiBaseUrl}/users/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      fetchUsuarios();
      setFormData({ usuario: '', contrasena: '', roles: '' });
    } catch (error) {
      console.error('Error creating usuario:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${apiBaseUrl}/users/usuarios/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      fetchUsuarios();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating usuario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiBaseUrl}/users/usuarios/${id}`, {
        method: 'DELETE'
      });
      fetchUsuarios();
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };

  const openModal = (usuario) => {
    setEditData(usuario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  return (
    <div className="panel-control">
      {/* Muestra el nombre de usuario logueado */}
      

      <form className="form2" onSubmit={handleSubmit}>
        <h2>Agregar Usuario</h2>
        <input
          type="text"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />
        <select
          name="roles"
          value={formData.roles}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Seleccione un rol</option>
          {rolesOptions.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button type="submit">Agregar Usuario</button>
      </form>

      <div className="user-list">
        <h2>Lista de Usuarios</h2>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.usuario}</td>
                <td>{usuario.contrasena}</td>
                <td>{usuario.roles}</td>
                <td>
                  <button className="btn-edit" onClick={() => openModal(usuario)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Usuario</h2>
            <form className='form-CrearUser' onSubmit={handleUpdate}>
              <input
                type="text"
                name="usuario"
                value={editData.usuario}
                onChange={handleEditChange}
                placeholder="Usuario"
                required
              />
              <input
                type="password"
                name="contrasena"
                value={editData.contrasena}
                onChange={handleEditChange}
                placeholder="Contraseña"
                required
              />
              <select
                name="roles"
                value={editData.roles}
                onChange={handleEditChange}
                required
              >
                <option value="" disabled>Seleccione un rol</option>
                {rolesOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <button type="submit">Actualizar Usuario</button>
              <button type="button" onClick={closeModal}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
