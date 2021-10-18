import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { AppStateService } from '../services/app-state.service';
import { AuthedUserService } from '../services/authed-user.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
    private router: Router,
    private state: AppStateService,
    private authedUser: AuthedUserService,
    private notification: SnackbarNotificationService,
    ) {}

  async canActivate(): Promise<boolean> 
  {
    // this.authedUser.user$.subscribe(user => {
    //   if 
    //   if (! this.authedUser.isAdmin())
    //   {
    //     this.notification.error('Unauthorized.');
    //     this.router.navigate([`/${this.state.company_id}/calendar`]);
    //     return false;
    //   }

    //   if ()
      
    //   return true;    
    // });

    return true;
  }

}