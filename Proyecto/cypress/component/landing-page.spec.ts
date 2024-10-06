import { mount } from 'cypress/angular';
import { HttpClientModule } from '@angular/common/http';
import LandingPageComponent from '../../src/app/home/pages/landing-page/landing-page.component';
import { AuthService } from '../../src/app/auth/services/auth-service.service';

class MockAuthService {
  // Implementa los métodos necesarios que tu componente necesita, si es necesario
}

describe('Landing Page Component', () => {
  beforeEach(() => {
    mount(LandingPageComponent, {
      imports: [HttpClientModule], // Proveer HttpClientModule
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // Proveer el mock del servicio
      ],
    });
  });

  it('should display the main heading', () => {
    cy.get('h2').contains('Modernización de Almacenes'); // Verifica el título principal
  });

  it('should display the introductory text', () => {
    cy.get('p').contains('Potencia tu negocio con soluciones tecnológicas accesibles que optimizan'); // Verifica el texto introductorio
  });

  it('should have call-to-action buttons', () => {
    cy.get('button').contains('Ingresar'); // Verifica que el botón "Ingresar" esté presente
    cy.get('button').contains('Registrarme'); // Verifica que el botón "Registrarme" esté presente
  });

  it('should open login modal on "Ingresar" button click', () => {
    cy.get('button').contains('Ingresar').click(); // Simula clic en el botón "Ingresar"
    cy.get('app-login-page').should('exist'); // Verifica que el modal de login esté presente
    cy.get('app-login-page').should('be.visible'); // Asegura que el modal esté visible
  });

  it('should open register modal on "Registrarme" button click', () => {
    cy.get('button').contains('Registrarme').click(); // Simula clic en el botón "Registrarme"
    cy.get('app-register-page').should('exist'); // Verifica que el modal de registro esté presente
    cy.get('app-register-page').should('be.visible'); // Asegura que el modal esté visible
  });

  it('should display benefit sections', () => {
    cy.get('.grid-cols-1 .text-center').should('have.length', 4); // Verifica que haya 4 secciones de beneficios
  });

  it('should have a footer with copyright text', () => {
    cy.get('footer').contains('Copyright © Needvox'); // Verifica que el footer contenga el texto de copyright
  });
});
