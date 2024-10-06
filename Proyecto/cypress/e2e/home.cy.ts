describe('Página de inicio', () => {
  it('debería mostrar el título, las secciones y los botones correctos', () => {
    cy.visit('http://localhost:4200/home'); // Asegúrate de que tu aplicación esté corriendo

    // Verificar que el título principal esté presente
    cy.contains('Needvox').should('exist');

    // Verificar que las secciones de Misión, Visión y Propósito estén presentes
    cy.contains('Misión').should('exist');
    cy.contains('Visión').should('exist');
    cy.contains('Propósito').should('exist');

    // Verificar que los botones "Ingresar" y "Registrarme" estén presentes
    cy.contains('Ingresar').should('exist');
    cy.contains('Registrarme').should('exist');


    // Boton Ingresar

    // Hacer clic en el botón "Ingresar" para abrir el pop-up
    cy.contains('Ingresar').click();

    // Esperar y verificar que el pop-up de "Ingresar" esté visible
    cy.get('#login-popup', { timeout: 10000 }).should('be.visible');

    // Hacer clic en el ícono "X" del pop-up de "Ingresar"
    cy.get('#login-popup svg path[fill-rule="evenodd"]').should('exist').click(); // Hacemos clic en el ícono "X"


    // Boton Register

    cy.contains('Registrarme').click();

    // Esperar y verificar que el pop-up de "Ingresar" esté visible
    cy.get('#login-popup', { timeout: 10000 }).should('be.visible');

    // Hacer clic en el ícono "X" del pop-up de "Ingresar"
    cy.get('#login-popup svg path[fill-rule="evenodd"]').should('exist').click(); // Hacemos clic en el ícono "X"


  });
});
