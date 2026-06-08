

const BASE_USERS = [
    { name: 'Usuario Demo', email: 'usuario1@empresa.cl', password: btoa('12345678'), role: 'user', token: 'token-user-123' },
    { name: 'Coach Demo', email: 'coach1@empresa.cl', password: btoa('12345678'), role: 'coach', token: 'token-coach-123' },
    { name: 'Admin Demo', email: 'admin1@empresa.cl', password: btoa('12345678'), role: 'admin', token: 'token-admin-123' }
  ];
  
  // Inicializa los usuarios base si la base de datos (localStorage) está vacía
  export const initAuth = () => {
    if (!localStorage.getItem('users_db')) {
      localStorage.setItem('users_db', JSON.stringify(BASE_USERS));
    }
  };
  
  // Validar inicio de sesión
  export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users_db')) || [];
    
    // Buscamos si existe el email y si la contraseña (codificada) coincide
    const user = users.find(u => u.email === email && u.password === btoa(password));
    
    if (!user) {
      throw new Error('Credenciales incorrectas o el usuario no existe.');
    }
    
    return user;
  };
  
  // Registrar un nuevo usuario (Siempre con rol 'user')
  export const registerUser = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users_db')) || [];
    
    // Verificar si el correo ya existe
    if (users.find(u => u.email === email)) {
      throw new Error('Este correo ya está registrado en SportClub.');
    }
  
    // Validación de seguridad de la contraseña (Mínimo 8 caracteres, 1 mayúscula, 1 número)
    const secureRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!secureRegex.test(password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.');
    }
  
    // Crear y guardar el nuevo usuario
    const newUser = {
      name,
      email,
      password: btoa(password), // Codificamos la contraseña por seguridad
      role: 'user', // Forzamos el rol 'user'
      token: `token-${Date.now()}` // Generamos un token único simulado
    };
  
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    
    return newUser;
  };