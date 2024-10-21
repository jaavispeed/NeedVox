// src/app/auth/models/user.model.ts
export interface User {
  id: string;       // Cambia 'uid' por 'id' si es necesario
  email: string;
  username: string;
  password?: string; // Opcional si no lo necesitas en el frontend
  token?: string;    // Opcional, solo si lo recibes del servidor
  roles: string[];   // Asegúrate de que esta propiedad esté aquí
}
