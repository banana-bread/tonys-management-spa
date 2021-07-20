import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { SnackbarNotificationService } from '@tonys/shared';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

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

  constructor(
    private auth: AuthService,
    private router: Router,
    private notifications: SnackbarNotificationService,
    private state: AppStateService,
  ) { }

  ngOnInit(): void {}

  async onSubmit()
  {
    if (this.authForm.invalid) return;
    
    this.loading = true;

    // TODO: should probably refine this to get company and employee in one shot
    //       Will do, first need to figure out model relations
    try
    {
      await this.auth.login(this.email, this.password);

      this.router.navigate(['/', this.state.short_company_id]);
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
