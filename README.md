# Needvox

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


--- Primera vez en Git ---
1. git init (Inicializar un repositorio)
2. git add . (Añadir archivos al repositorio)
3. git commit -m "Primer commit"  (Es importante hacer un primer commit antes de intentar unirte al repositorio remoto)
4. git remote add origin <URL-del-repositorio>



--- Crear una nueva rama ---
1. git checkout -b Javier-Rama (Crea la nueva rama y te cambia a ella)
2. git push -u origin Javier-Rama  (Empuja la nueva rama al repositorio remoto)
3. git branch (Para verificar las ramas locales)
4. git branch -r (Para verificar las ramas remotas)



--- Para fusionar la rama propia con la main ---
1. git commit -m "commit" (Tienes que hacer un commit para pasar tus cambios a la main)
2. git checkout main (Es importante que estes en la rama main para hacer el merge)
3. git merge nombre-de-tu-rama (Fusiona tu rama actual con main)
4. git push origin main (Empuja los cambios fusionados al repositorio remoto)
Nota: (Al hacer esto, se solicita en github y el administrador tiene que hacer el Pull Request para que los cambios se hagan.)



--- Despues del Pull Request ---
1. git checkout main (Te cambia a la rama main)
2. git pull origin main (te actualiza los cambios de la rama main para que sean visibles en tu VS)
<<<<<<< HEAD



--- Adicional (Cambiar el nombre de Master a Main)---
1. git branch -m master main (Cambia el nombre de la rama local)
2. git push -u origin main (Luego, empuja la nueva rama main al remoto)



--- Adicional ( CRLF - el problema no es nada serio) ---
1. git config core.autocrlf true
