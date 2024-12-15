describe('Página de inicio', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('https://needvox.com/home');
  });

  it('debería mostrar el título, las secciones y los botones correctos', () => {
    // Verificar el contenido de la página principal
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
    const username = Math.random().toString(36).substring(2, 7).slice(0, 5);
    const password = '123456';

    it('debería registrarse y luego iniciar sesión con las mismas credenciales', () => {
      // Abrir el modal de registro
      cy.contains('Registrarme').click();



      // Completar el formulario de registro
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="confirmpassword"]').type(password);
      cy.get('button[type="submit"]').click(); // Hacer clic en el botón de enviar

      // Esperar a que el modal de registro se cierre (si corresponde)
      cy.get('app-register-page').should('not.exist');

      // Abrir el modal de login
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
