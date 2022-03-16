import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { ApiService } from 'src/app/services/api.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthedUserService } from 'src/app/services/authed-user.service';
import { UnsavedChangesRouterService } from 'src/app/unsaved-changes/unsaved-changes-router.service';

@Component({
  selector: 'app-account-editor',
  templateUrl: './account-editor.component.html',
  // styleUrls: ['./account-editor.component.scss']
})
export class AccountEditorComponent implements OnInit, OnDestroy {

  @ViewChild('profileForm') profileForm: NgForm;
  @ViewChild('accountForm') accountForm: NgForm;

  loading = false;
  saving = false;
  hasBaseScheduleUpdates = false;
  hasProfileUpdates = false;
  hasPasswordUpdate = false;

  oldPassword: string;
  newPassword: string;

  original: Employee;
  employee: Employee = new Employee();
  authedEmployee: Employee = new Employee();
  employeeName: string;
  employeeId: string = this.route.snapshot.paramMap.get('id');

  urlCompanyId: string;
  urlExpires: string;
  urlSignature: string;

  accountUpdates = new Map();
  baseScheduleInvalid = false;

  authedUserSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    public state: AppStateService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private unsavedChangesRouter: UnsavedChangesRouterService,
    public authedUser: AuthedUserService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    this.authedUserSubscription = this.authedUser.user$.subscribe(res =>  {
      if (! res.id) return;

      this.original = res;
      this.employee = this.original.copy();

      this.loading = false;
    });
  }

  ngOnDestroy()
  {
    this.authedUserSubscription.unsubscribe();
  }

  toggleActiveDay(event: MatSlideToggleChange, day: {day: string, start: number, end: number, active: boolean})
  {
    day.active = event.checked;
  }

  onClose()
  {
    if (! this.original) return;

    const hasUpdates = !!this.accountUpdates.size 
      || this.hasBaseScheduleUpdates 
      || this.hasProfileUpdates
      || this.hasPasswordUpdate;

    this.unsavedChangesRouter.tryNavigate(`/${this.state.company_id}/calendar`, () => !hasUpdates);
  }

  async onSaveBaseSchedule(): Promise<void>
  {
    if (this.baseScheduleInvalid) 
    {
      this.notifications.warning('Schedule is invalid')
      return;
    }

    this.saving = true;

    try
    {
      await this.employeeService.updateBaseSchedule(this.employee);
      this.hasBaseScheduleUpdates = false;
      this.notifications.success('Schedule updated');
    }
    catch (e)
    {
      this.notifications.error(e.error.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  async onSaveProfile(): Promise<void>
  {
    if (this.profileForm.invalid) 
    {
      this.notifications.warning('Profile is invalid')
      return;
    }

    this.saving = true;

    try
    {
      await this.employeeService.updateProfile(this.employee);
      this.hasProfileUpdates = false;
      this.notifications.success('Profile updated');
    }
    catch (e)
    {
      this.notifications.error(e.error.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  async onSavePassword(): Promise<void>
  {
    this.saving = true;
    try
    {
      await this.employeeService.updateProfile(this.employee, this.oldPassword, this.newPassword);
      this.hasPasswordUpdate = false;
      this.notifications.success('Password updated');
      this.newPassword = '';
      this.oldPassword = '';
    }
    catch (e)
    {
      this.notifications.error(e.error.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  async onSaveAccount(): Promise<void>
  {
    this.saving = true;
    try
    {
      await Promise.all([...this.accountUpdates.values()].map(callback => callback()))
      this.accountUpdates.clear();
      this.notifications.success('Account updated');
    }
    catch (e)
    {
      this.notifications.error(e.error.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  onBaseScheduleErrorChange(isError: boolean)
  {
    this.baseScheduleInvalid = isError;
  }

  onAdminChanged()
  {
    this.accountUpdates.set('admin_update', () => this.employeeService.updateAdmin(this.employee));
  }

  onOwnerChanged()
  {
    this.accountUpdates.set('owner_update', () => this.employeeService.updateOwner(this.employee));
  }

  onActiveChanged()
  {
    this.accountUpdates.set('active', () => this.employeeService.updateActive(this.employee))
  }
}
