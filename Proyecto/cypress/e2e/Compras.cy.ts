describe('Página de inicio', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('https://needvox.com/home');
  });
  describe('Pruebas de registro y login', () => {
    const username = 'usuario_ihvsy@gmail.com';
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
    cy.wait(8000); // Espera 1 segundo (1000 ms)
    cy.contains('Compra').click();
    //Dirigir a crear productos
    cy.contains('Agregar Compra').click();
    // Verificar que los campos están vacíos antes de comenzar
    cy.get('[formControlName="Precio de Compra"]').should('have.value', '');

    cy.get('[formControlName="stock"]').should('have.value', '');
    cy.get('[formControlName="fecha de Caducidad"]').should('have.value', '');

    // Rellenar el formulario
    cy.get('[formControlName="Precio de Compra"]').type('3000');
    cy.get('[formControlName="stock"]').type('20');
    cy.get('[formControlName="fecha de caducidad"]').type('');

    // Verificar que los valores se ingresaron correctamente
    cy.get('[formControlName="Precio de Compra"]').should('have.value', '3000');
    cy.get('[formControlName="stock"]').should('have.value', '20');
    cy.get('[formControlName="Fecha de caducidad"]').should('have.value', '');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que se muestra el mensaje de éxito
    cy.contains('Compra agregada con éxito').should('be.visible');

  });
});
});
