import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CompanyService } from '../models/company/company.service';
import { AuthService } from '../services/auth.service';
import { SnackbarNotificationService } from '@tonys/shared';
import { Router } from '@angular/router';
import { AuthedUserService } from '../services/authed-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  isExpanded = false;

  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // TODO: move company getting into login spot.
  constructor(
    private breakpointObserver: BreakpointObserver,
    public authedUser: AuthedUserService,
    private auth: AuthService,
    private router: Router,
    private notification: SnackbarNotificationService,
  ) {}

  ngOnInit(): void {}

  async logout(): Promise<void>
  {
    try
    {
      await this.auth.logout();
      this.router.navigate(['login'])
      this.notification.success('Signed out')
    }
    catch
    {
      this.notification.error('Couldn\'t log out');
    }
  }
}