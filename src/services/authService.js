const API_BASE_URL = 'http://localhost:8080';
const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    PROFILE: `${API_BASE_URL}/api/users/me`,
    LOGOUT: `${API_BASE_URL}/api/users/logout`
};

export const authService = {
    login: async (username, password, setTokenCallback) => {
        try {
            console.log('Intentando login con:', { username });
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Respuesta completa del servidor:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    throw new Error('Usuario o contraseña incorrectos');
                } else if (data.message) {
                    throw new Error(data.message);
                } else {
                    throw new Error('Error en el proceso de login. Por favor, intenta de nuevo.');
                }
            }

            const data = await response.json();
            console.log('Login exitoso, procesando respuesta...');
            
            // Guardar token en Redux
            if (setTokenCallback) {
                setTokenCallback(data.token || data.accessToken || data.jwt);
            }
            console.log('Token guardado en Redux correctamente');
            return data;
        } catch (error) {
            console.error('Login error completo:', error);
            throw error;
        }
    },

    logout: async (token) => {
        try {
            if (token) {
                try {
                    await fetch(AUTH_ENDPOINTS.LOGOUT, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.warn('Error al hacer logout en el servidor:', error);
                }
            }
        } finally {
            console.log('Sesión cerrada localmente');
        }
    },

    getToken: () => {
        // getToken debe ser adaptado para Redux en los componentes
        // Por ahora retorna null, pero en el futuro se puede conectar con Redux
        return null;
    },

    isAuthenticated: () => {
        return !!authService.getToken();
    },

    getUserProfile: async (token) => {
        try {
            if (!token) {
                throw new Error('No hay token disponible');
            }

            const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener el perfil');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            throw error;
        }
    }
}; 