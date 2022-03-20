import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { ApiService } from 'src/app/services/api.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthedUserService } from 'src/app/services/authed-user.service';
import { UnsavedChangesRouterService } from 'src/app/unsaved-changes/unsaved-changes-router.service';
import { StaffBlockedTimeDialogService } from '../staff-blocked-time-dialog/staff-blocked-time-dialog.component';
import { StaffEditorService } from './staff-editor.service';

@Component({
  selector: 'app-staff-editor',
  templateUrl: './staff-editor.component.html',
})
export class StaffEditorComponent implements OnInit, OnDestroy {

  @ViewChild('profileForm') profileForm: NgForm;
  @ViewChild('accountForm') accountForm: NgForm;

  loading = false;
  saving = false;

  hasBaseScheduleUpdates = false;
  hasProfileUpdates = false;

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

  accountUpdates = new Map();
  baseScheduleInvalid = false;

  authedUserSubscription: Subscription;
  authedUser: Employee;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    public state: AppStateService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private staffEditorService: StaffEditorService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private unsavedChangesRouter: UnsavedChangesRouterService,
    public authedUserService: AuthedUserService,
    private blockedTimeEditor: StaffBlockedTimeDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  { 
    this.authedUserSubscription = this.authedUserService.user$.subscribe(res => {
      if (! res.id) return;

      this.authedUser = res;
    });

    if (!! this.staffEditorService.staff)
    {
      this.original = this.staffEditorService.staff;
      this.employee = this.original.copy();
    }
    else
    {
      this.loading = true;

      try
      {
        this.original = await this.employeeService.get(this.employeeId)
        this.employee = this.original.copy();
      }
      catch
      {
        this.onClose();
        this.notifications.error('Error loading staff')
      }
      finally
      {
        this.loading = false;
      }
    }
  }

  ngOnDestroy(): void 
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

    const hasUpdates = !!this.accountUpdates.size || this.hasBaseScheduleUpdates || this.hasProfileUpdates;

    this.unsavedChangesRouter.tryNavigate(`/${this.state.company_id}/staff`, () => !hasUpdates);
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
      this.notifications.success('Employee schedule updated');
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
      this.notifications.success('Emplyee Profile updated');
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
      this.notifications.success('Employee Account updated');
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

  async onBookTimeOff(): Promise<void>
  {
    this.blockedTimeEditor.open(this.employee)
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
      this.router.navigate([`/${this.state.company_id}/staff`]);
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
