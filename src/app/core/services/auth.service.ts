import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, authState, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Credential } from '../models/credential.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private auth: Auth = inject(Auth);

  readonly authState$ = authState(this.auth);

  loginWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth, 
      credential.email, 
      credential.password
    );
  }

  async logOut(): Promise<void> {
    return await this.auth.signOut();
  }

}
