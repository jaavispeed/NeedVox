export interface User {
  uid: string;
  email: string;
  username: string;
  token: string;
  roles?: string[];  // Hacer que "roles" sea opcional si no siempre está presente en la respuesta
}
