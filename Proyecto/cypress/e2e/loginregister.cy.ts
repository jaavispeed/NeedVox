describe('Página de inicio', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('http://localhost:4200/home');
  });

  it('debería mostrar el título, las secciones y los botones correctos', () => {
    // Pruebas de contenido de la página principal
    cy.contains('Needvox').should('exist');
    cy.contains('Modernización de Almacenes').should('exist');
    cy.contains('Gestión simplificada del inventario').should('exist');
    cy.contains('Reportes de ventas en tiempo real').should('exist');
    cy.contains('Fácil de usar desde cualquier dispositivo').should('exist');
    cy.contains('Soporte en todo momento').should('exist');
    cy.contains('Ingresar').should('exist');
    cy.contains('Registrarme').should('exist');
  });

  describe('Pruebas de registro y login', () => {
    const randomEmail = `usuario_${Math.random().toString(36).substring(2, 7)}@gmail.com`;
    const username = Math.random().toString(36).substring(2, 7).slice(0, 5); // Generar un nombre de usuario aleatorio de máximo 5 letras
    const password = '123456'; // Contraseña fija

    it('debería registrarse y luego iniciar sesión con las mismas credenciales', () => {
      // Abrir el pop-up de registro
      cy.contains('Registrarme').click();

      // Esperar y verificar que el pop-up de "Registro" esté visible
      cy.get('#login-popup', { timeout: 10000 }).should('be.visible');

      // Completar el formulario de registro
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="confirmpassword"]').type(password);
      cy.get('button[type="submit"]').click();


      // Abrir el pop-up de login
      cy.contains('Ingresar').click();

      // Completar el formulario de login con las credenciales usadas para el registro
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      // Verificar si el login fue exitoso
      cy.contains('Bienvenido').should('exist'); // Cambia el mensaje si es diferente
    });
  });
});
