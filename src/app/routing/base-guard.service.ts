import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BaseGuardService implements CanActivate {

  constructor(
      private auth: AuthService, 
      private router: Router
    ) {}

  canActivate(): boolean 
  {
    if (! this.auth.isLoggedIn()) 
    {
      this.router.navigate(['login']);
      return false;
    }

    // 'this.company.id'/dashboard
    // this.router.navigate('this.comp')
    return true;
  }
}