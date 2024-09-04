import { inject, Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { UserInterface } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);

  getAuth() {
    return getAuth();
  }

  // Método para autenticación con Google
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.getAuth(), provider)
      .then((result) => {
        // Puedes guardar el usuario en el localStorage aquí, si lo deseas

        return result.user;
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
        throw error;
      });
  }
  signIn(user:UserInterface){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password, );
  }

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
