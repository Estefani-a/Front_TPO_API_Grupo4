import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar usuarios desde la API
    const fetchUsers = async () => {
      try {
        console.log('📡 Cargando usuarios desde la base de datos...');
        const response = await fetch('http://localhost:8080/api/auth/users');
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Usuarios cargados desde la BASE DE DATOS:', data);
          setUsers(data);
        } else {
          setError('Error al cargar usuarios');
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="auth-body">
        <div className="auth-container">
          <div className="auth-form-card">
            <h2>Cargando usuarios...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-body">
        <div className="auth-container">
          <div className="auth-form-card">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-body">
      <div className="auth-container" style={{ maxWidth: 800 }}>
        <div className="auth-form-card">
          <div className="auth-logo">
            <img src="/Steam_icon_logo.png" alt="Steam Logo" className="auth-logo-image" />
          </div>
          
          <h2>Usuarios en la Base de Datos MySQL</h2>
          
          <p style={{ textAlign: 'center', color: '#8f98a0', marginBottom: 20 }}>
            Total de usuarios registrados: <strong>{users.length}</strong>
          </p>

          <div style={{ marginBottom: 20 }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: '#2a475e',
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  border: user.role === 'ADMIN' ? '2px solid #66c0f4' : '1px solid #1b2838'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#66c0f4', fontSize: 18, fontWeight: 600, marginBottom: 5 }}>
                      {user.name}
                      {user.role === 'ADMIN' && (
                        <span style={{ 
                          marginLeft: 10, 
                          background: '#66c0f4', 
                          color: '#171a21', 
                          padding: '2px 8px', 
                          borderRadius: 4, 
                          fontSize: 12 
                        }}>
                          🔑 ADMIN
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#c7d5e0', fontSize: 14 }}>
                      📧 {user.email}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#171a21', 
                    padding: '8px 12px', 
                    borderRadius: 4,
                    color: '#66c0f4',
                    fontWeight: 600
                  }}>
                    ID: {user.id}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link 
              to="/" 
              className="auth-btn" 
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            >
              Volver al Login
            </Link>
            <Link 
              to="/register" 
              className="auth-btn" 
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                textDecoration: 'none',
                background: 'linear-gradient(90deg, #66c0f4 0%, #417a9b 100%)'
              }}
            >
              Registrar Nuevo Usuario
            </Link>
          </div>

          <p className="auth-switch-text" style={{ marginTop: 20, fontSize: 12, color: '#8f98a0' }}>
            ℹ️ Estos usuarios están guardados permanentemente en la base de datos MySQL, no en localStorage
          </p>
        </div>
      </div>
    </div>
  );
}
