import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Hardcoded for now as required by Hands-On 7 Step 75
  isLoggedIn = true;

  constructor() {}
}
