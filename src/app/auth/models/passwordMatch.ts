import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatch(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    const passwordControl = form.get(passwordKey);
    const confirmPasswordControl = form.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) {
      return null; // No se puede validar si alguno de los controles no existe
    }

    if (!confirmPasswordControl.value) {
      // Si el campo de confirmación está vacío, no validamos la coincidencia aún
      return null;
    }

    if (passwordControl.value === confirmPasswordControl.value) {
      return null; // Las contraseñas coinciden, no hay error
    }

    return { passwordMismatchError: true }; // Las contraseñas no coinciden
  };
}
