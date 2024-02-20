import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyBqs9qeIMYDp9JFjPjos0PRSN_qRlTD2x4",
        authDomain: "psico-app-de1b4.firebaseapp.com",
        projectId: "psico-app-de1b4",
        storageBucket: "psico-app-de1b4.appspot.com",
        messagingSenderId: "476249960395",
        appId: "1:476249960395:web:964dfbb8c28e6e5aee504e",
        measurementId: "G-VHH9BGLLZZ"
      })),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth())
    ]),
  ]
};
