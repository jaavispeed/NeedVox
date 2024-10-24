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

    cy.wait(8000); // Espera 1 segundo (1000 ms)

    cy.contains('Productos').click();

    cy.contains('Editar').click();
    // Generar datos aleatorios para llenar el formulario
    const randomTitle = `Producto ${Math.random().toString(36).substring(2, 7)}`;
    const randomCompraPrice = (Math.random() * 100).toFixed(2); // Precio aleatorio entre 0 y 100
    const randomVentaPrice = (parseFloat(randomCompraPrice) + Math.random() * 50).toFixed(2); // Precio de venta aleatorio
    const randomStock = Math.floor(Math.random() * 100) + 1; // Stock aleatorio entre 1 y 100
    const randomExpiryDate = new Date(Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString().split('T')[0]; // Fecha de caducidad aleatoria en el próximo año
    const randomBarcode = Math.random().toString().substring(2, 10); // Generar un código de barras aleatorio
    // Rellenar el formulario con datos aleatorios
    cy.get('[formControlName="title"]').clear().type(randomTitle);
    cy.get('[formControlName="compraPrice"]').clear().type(randomCompraPrice);
    cy.get('[formControlName="ventaPrice"]').clear().type(randomVentaPrice);
    cy.get('[formControlName="stock"]').clear().type(randomStock.toString());
    cy.get('[formControlName="expiryDate"]').type(randomExpiryDate);
    cy.get('[formControlName="barcode"]').type(randomBarcode);
    // Completar el formulario (asumiendo que hay un botón de guardar o actualizar)
    cy.get('button[type="submit"]').click();

  });
});
});
