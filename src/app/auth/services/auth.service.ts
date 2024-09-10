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
import { User } from "../models/user.model";
import { doc, getDoc, getFirestore, setDoc } from "@angular/fire/firestore";

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
  signIn(user:User){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password, );
  }

  register(email: string, username: string, password: string): Observable<void> {
  const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: username })
        .then(() => sendEmailVerification(response.user))
        .then(() => {
          // Crear o actualizar el documento del usuario en la colección 'users'
          const userDocPath = `users/${response.user.uid}`;
          const userData = {
            email: email,
            username: username,
            uid: response.user.uid
          };
          return this.setDocument(userDocPath, userData);
        })
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


  setDocument(path: any, data:any){
    return setDoc(doc(getFirestore(),path),data)
  }
  async getDocument(path:any){
    return (await getDoc(doc(getFirestore(),path))).data()
  }
}
