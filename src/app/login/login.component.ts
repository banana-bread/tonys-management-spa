import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { SnackbarNotificationService } from '@tonys/shared';
import { Router } from '@angular/router';
import { EmployeeService } from '../models/employee/employee.service';
import { CompanyService } from '../models/company/company.service';
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
    private state: AppStateService,
    private notifications: SnackbarNotificationService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {}

  /* 
  TODO:

    - Set company and user in appstate, doesn't need to be an observable
  */
  async onSubmit()
  {
    if (this.authForm.invalid) return;
    
    this.loading = true;

    // TODO: should probably refine this to get company and employee in one shot
    //       Will do, first need to figure out model relations
    try
    {
      await this.auth.login(this.email, this.password);

      this.state.employee = await this.employeeService.getAuthed()
      this.state.company = await this.companyService.get(this.state.employee.company_id);

      this.router.navigate([this.state.company.id, 'dashboard'])
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
