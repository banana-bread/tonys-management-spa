import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
      private auth: AuthService, 
      private router: Router
    ) {}

  async canActivate(): Promise<boolean> 
  {
    if (! this.auth.isLoggedIn())
    {
      await this.auth.attemptRefresh()

      if (! this.auth.isLoggedIn())
      {
        this.router.navigate(['login']);
        return false;
      }
    }
    
    return true;    
  }

}