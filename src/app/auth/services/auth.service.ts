import { inject, Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "@angular/fire/auth";
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        return updateProfile(response.user, { displayName: username })
          .then(() => sendEmailVerification(response.user))
          .catch(error => {
            console.error("Error updating profile or sending email verification:", error);
            throw error;
          });
      })
      .catch(error => {
        console.error("Error en el registro:", error);
        throw error;
      });

    return from(promise);
  }
}
