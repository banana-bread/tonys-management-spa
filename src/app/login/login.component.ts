import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { SnackbarNotificationService } from '@tonys/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('authForm') authForm: NgForm;

  loading = false; 

  name: string;
  email: string;
  phone: string;
  password: string;

  isHandset: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private router: Router,
    private notifications: SnackbarNotificationService,
  ) { }

  ngOnInit(): void {}

  /* 
  TODO:
    - Get user
    - Get company id
    - Set company id in appstate, doesn't need to be an observable
  */
  async onSubmit()
  {
    if (this.authForm.invalid) return;

    try
    {
      this.loading = true;
      await this.auth.login(this.email, this.password);
      this.router.navigate(['123', 'dashboard'])
      this.notifications.success('Signed in')
    }
    catch
    {
      this.notifications.error('Error Signing in')
    }
    finally
    {
      this.loading = false;
    }
  }

}
