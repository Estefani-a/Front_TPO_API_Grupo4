// ====================================================================
// UTILIDADES PARA LA GESTIÓN DE AUTENTICACIÓN
// IMPORTANTE: Este archivo NO guarda usuarios en localStorage
// Los usuarios se gestionan únicamente a través de la API del backend
// Solo se guarda la sesión actual del usuario logueado
// ====================================================================

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Obtiene el usuario actualmente logueado desde la sesión
 * @returns {Object|null} Información del usuario o null si no está logueado
 */
export const getCurrentUser = () => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch {
    return null;
  }
};

/**
 * Obtiene el token JWT del usuario actual
 * @returns {string|null} Token JWT o null
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("currentUser");
};

/**
 * Verifica si el usuario actual es administrador
 * @returns {boolean} True si es administrador
 */
export const isAdmin = () => {
  try {
    return localStorage.getItem('isAdmin') === 'true';
  } catch {
    return false;
  }
};

/**
 * Verifica si hay un usuario logueado
 * @returns {boolean} True si hay un usuario logueado
 */
export const isLoggedIn = () => {
  return getCurrentUser() !== null && getAuthToken() !== null;
};

/**
 * Obtiene todos los usuarios desde la API (solo para visualización)
 * @returns {Promise<Array>} Lista de usuarios desde la base de datos
 */
export const getAllUsersFromAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error al obtener usuarios desde la API:', error);
    return [];
  }
};