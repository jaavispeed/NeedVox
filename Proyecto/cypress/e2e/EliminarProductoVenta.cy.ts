describe('Página de inicio', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('http://localhost:4200/home');
  });
  describe('Pruebas de registro y login', () => {
    const username = 'cesar@gmail.com';
    const password = '123456';

   it('debería registrarse y luego iniciar sesión con las mismas credenciales', () => {
    // Abrir el modal de registrs
    cy.contains('Ingresar').click();

    // Completar el formulario de login con las credenciales usadas para el registro
    cy.get('input[name="email"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Verificar si el login fue exitoso
    cy.contains('Bienvenido').should('exist'); // Cambia el mensaje si es diferente
    cy.wait(8000); // Espera 8 segundo (8000 ms)
    cy.contains('Venta').click();
    cy.wait(1000); // Espera 1 segundo (1000 ms)
    cy.contains('Agregar').click();
    cy.contains('Agregar').click()
    cy.wait(2000); // Espera 1 segundo (1000 ms)
    cy.get('button.inline-flex').contains('Eliminar').click();



  });
});
});
