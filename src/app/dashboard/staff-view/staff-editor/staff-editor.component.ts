import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { getQueryParam, getUuid } from 'src/app/helpers/regex.helper';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { ApiService } from 'src/app/services/api.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthedUserService } from 'src/app/services/authed-user.service';
import { UnsavedChangesRouterService } from 'src/app/unsaved-changes/unsaved-changes-router.service';
import { StaffEditorService } from './staff-editor.service';

/*
 * TODO:
    - [ ] Save Profile route
    - [ ] Save Account route
    - [ ] Figure out what to do for updating admin/owner (true === create new employee admin and vice versa on api.)
    - [ ] Add tooltups to admin, owner, online bookings for more info.
    - [ ] Probably move the new employee stuff to a different component.
 */
@Component({
  selector: 'app-staff-editor',
  templateUrl: './staff-editor.component.html',
  styleUrls: ['./staff-editor.component.scss']
})
export class StaffEditorComponent implements OnInit, OnDestroy {

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

    this.unsavedChangesRouter.tryNavigate(`/${this.state.company_id}/staff`, () => !this.hasUpdates());
  }

  onSave()
  {
    this.submitted = true;
    this.update();
  }

  // When editing employee
  protected async update()
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

      // This is sucky!  Do this better.  When we update our account through
      // this view, then go to account view without refreshing, employee state
      // is out of sync
      if (this.authedUser.id === this.employee.id)
      {
        this.state.employee = this.employee;
      }

      this.router.navigate([`/${this.state.company_id}/staff`]);
      
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
