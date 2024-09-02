import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({"projectId":"needvox-75042","appId":"1:984539807356:web:57696bbf6ec6ca86e3d3f9","storageBucket":"needvox-75042.appspot.com","apiKey":"AIzaSyC3y8ffFps926Q1gsZE7FeAmR0nchwyyzI","authDomain":"needvox-75042.firebaseapp.com","messagingSenderId":"984539807356","measurementId":"G-9ESD71YHM5"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
