// Utilidades para la gestión de autenticación y usuarios

/**
 * Obtiene el usuario actualmente logueado
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
 * Obtiene todos los usuarios registrados
 * @returns {Array} Lista de usuarios registrados
 */
export const getAllUsers = () => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario {name, email, password}
 * @returns {Object} Resultado de la operación {success: boolean, message: string, user?: Object}
 */
export const registerUser = (userData) => {
  const { name, email, password } = userData;
  
  // Validaciones
  if (!name || !email || !password) {
    return { success: false, message: "Todos los campos son obligatorios" };
  }
  
  if (password.length < 6) {
    return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
  }
  
  // Verificar si el usuario ya existe
  const existingUsers = getAllUsers();
  if (existingUsers.find(user => user.email === email.toLowerCase())) {
    return { success: false, message: "Este email ya está registrado" };
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password, // En un sistema real, esto debería estar hasheado
    createdAt: new Date().toISOString()
  };
  
  // Guardar en localStorage
  existingUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(existingUsers));
  
  return { 
    success: true, 
    message: "Usuario registrado exitosamente",
    user: { ...newUser, password: undefined } // No devolver la contraseña
  };
};

/**
 * Autentica un usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} Resultado de la autenticación {success: boolean, message: string, user?: Object}
 */
export const loginUser = (email, password) => {
  if (!email || !password) {
    return { success: false, message: "Email y contraseña son obligatorios" };
  }
  
  const emailLower = email.toLowerCase().trim();
  
  // Verificar credenciales de admin
  if (emailLower === "admin@admin" && password === "admin") {
    const adminUser = {
      name: "Administrador",
      email: "admin@admin",
      isAdmin: true
    };
    
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    
    return { 
      success: true, 
      message: "Inicio de sesión exitoso",
      user: adminUser 
    };
  }
  
  // Verificar credenciales de usuarios registrados
  const users = getAllUsers();
  const user = users.find(u => u.email === emailLower && u.password === password);
  
  if (user) {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: false
    };
    
    localStorage.removeItem("isAdmin");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    return { 
      success: true, 
      message: "Inicio de sesión exitoso",
      user: userData 
    };
  }
  
  return { success: false, message: "Email o contraseña incorrectos" };
};

/**
 * Cierra la sesión del usuario actual
 */
export const logoutUser = () => {
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
  return getCurrentUser() !== null;
};