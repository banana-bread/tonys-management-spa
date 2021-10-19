import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
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
export class AccountEditorComponent implements OnInit {

  @ViewChild('profileForm') profileForm: NgForm;
  @ViewChild('accountForm') accountForm: NgForm;

  loading = false;
  saving = false;
  submitted = false;

  original: Employee;
  employee: Employee = new Employee();
  authedEmployee: Employee = new Employee();
  employeeName: string;
  employeeId: string = this.route.snapshot.paramMap.get('id');
  employeeRegistrationUrl = this.route.snapshot.queryParams['signed-url'];
  password: string;

  urlCompanyId: string;
  urlExpires: string;
  urlSignature: string;

  updates = new Map();
  baseScheduleInvalid = false;

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

    this.authedUser.user$.subscribe(res =>  {
      if (! res.id) return;

      this.original = res;
      this.employee = this.original.copy();

      this.loading = false;
    });
  }

  toggleActiveDay(event: MatSlideToggleChange, day: {day: string, start: number, end: number, active: boolean})
  {
    day.active = event.checked;
  }

  onClose()
  {
    if (! this.original) return;

    this.unsavedChangesRouter.tryNavigate(`/${this.state.company_id}/calendar`, () => !this.hasUpdates());
  }

  async onSave(): Promise<void>
  {
    if (this.baseScheduleInvalid || this.profileForm.invalid)
    {
      this.notifications.warning('Please resolve existing errors')
      return;
    }

    this.saving = true;
  
      try
      {
        await Promise.all([...this.updates.values()].map(callback => callback()))
  
        this.router.navigate([`/${this.state.company_id}/calendar`]);
        
        this.notifications.success('Employee updated');
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

  onBaseScheduleChanged()
  {
    this.updates.set('base_schedule', () => this.employeeService.updateBaseSchedule(this.employee))
  }

  onBaseScheduleErrorChange(isError: boolean)
  {
    this.baseScheduleInvalid = isError;
  }

  onProfileChanged()
  {
    this.updates.set('profile_update', () => this.employeeService.updateProfile(this.employee));
  }

  onAdminChanged()
  {
    this.updates.set('admin_update', () => this.employeeService.updateAdmin(this.employee));
  }

  onOwnerChanged()
  {
    this.updates.set('owner_update', () => this.employeeService.updateOwner(this.employee));
  }

  onActiveChanged()
  {
    this.updates.set('active', () => this.employeeService.updateActive(this.employee))
  }

  hasUpdates(): boolean
  {
    return !!this.updates.size;
  }

  async onDelete(): Promise<void>
  {
    if (this.original?.owner) return;

    const shouldDelete = await this.confirmDialog.open({
      title: 'Confirm deletion',
      message: 'Are you sure you want to continue?  Deleting an employee is nonreversible.',
    });

    if (! shouldDelete) return;

    this.saving = true;

    try
    {
      await this.employeeService.delete(this.employee);
      this.notifications.success('Employee deleted.')
      this.router.navigate([`/${this.state.company_id}/calendar`]);
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
}
