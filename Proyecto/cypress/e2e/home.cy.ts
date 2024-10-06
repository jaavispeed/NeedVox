describe('Página de inicio', () => {
  it('debería mostrar el título, las secciones y los botones correctos', () => {
    cy.visit('http://localhost:4200/home'); // Asegúrate de que tu aplicación esté corriendo

    // Verificar que el título principal esté presente
    cy.contains('Needvox').should('exist');

    // Verificar que las secciones de Misión, Visión y Propósito estén presentes
    cy.contains('Modernización de Almacenes').should('exist');
    cy.contains('Gestión simplificada del inventario').should('exist');
    cy.contains('Reportes de ventas en tiempo real').should('exist');
    cy.contains('Fácil de usar desde cualquier dispositivo').should('exist');
    cy.contains('Soporte en todo momento').should('exist');

    // Verificar que los botones "Ingresar" y "Registrarme" estén presentes
    cy.contains('Ingresar').should('exist');
    cy.contains('Registrarme').should('exist');

    // Botón Ingresar
    // Hacer clic en el botón "Ingresar" para abrir el pop-up
    cy.contains('Ingresar').click();

    // Esperar y verificar que el pop-up de "Ingresar" esté visible
    cy.get('app-login-page', { timeout: 10000 }).should('be.visible');

    // Hacer clic en el ícono "X" del pop-up de "Ingresar"
    cy.get('app-login-page').find('svg path[fill-rule="evenodd"]').should('exist').click(); // Hacemos clic en el ícono "X"

    // Botón Registrarme
    cy.contains('Registrarme').click();

    // Esperar y verificar que el pop-up de "Registro" esté visible
    cy.get('app-register-page', { timeout: 10000 }).should('be.visible');

    // Hacer clic en el ícono "X" del pop-up de "Registro"
    cy.get('app-register-page').find('svg path[fill-rule="evenodd"]').should('exist').click(); // Hacemos clic en el ícono "X"
  });
});
