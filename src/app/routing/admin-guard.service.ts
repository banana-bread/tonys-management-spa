import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { AppStateService } from '../services/app-state.service';
import { AuthedUserService } from '../services/authed-user.service';
import { filter } from 'rxjs/operators';
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

  async canActivate(route: ActivatedRouteSnapshot,): Promise<boolean> 
  {
    this.authedUser.user$
      .pipe(filter(user => !!user.id))
      .subscribe(user => {
        if ((! this.authedUser.isAdmin()) && (user.id !== route.params.id))
        {
          this.notification.error('Unauthorized.');
          this.router.navigate([`/${this.state.company_id}/calendar`]);
          return false;
        }

        return true;
      })


    return true;
  }

}