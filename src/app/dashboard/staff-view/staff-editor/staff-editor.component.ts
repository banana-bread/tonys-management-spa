import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
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
export class StaffEditorComponent implements OnInit {

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
    private staffEditorService: StaffEditorService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private unsavedChangesRouter: UnsavedChangesRouterService,
    public authedUser: AuthedUserService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    if (this.employeeId === 'new' && !!this.employeeRegistrationUrl)
    {
      this.urlCompanyId = getUuid(this.employeeRegistrationUrl);
      this.urlExpires = getQueryParam(this.employeeRegistrationUrl, 'expires');
      this.urlSignature = getQueryParam(this.employeeRegistrationUrl, 'signature');
    }
    else
    {
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
    !!this.original ? this.update() : this.create();
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
      message: 'Are you sure you want to continue?  Deleting an employee is unrecoverable.',
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




















   // When creating new emplyee from invite url
   protected async create(): Promise<any>
   {
     const data = {
       first_name: this.employee.first_name,
       last_name: this.employee.last_name,
       email: this.employee.email,
       phone: this.employee.phone,
       password: this.password,
       admin: false,
       owner: false,
       settings: {
         base_schedule: this.base_scheulde,
       }
     }
 
     this.saving = true;
 
     try
     {
       await this.employeeService.create(this.urlCompanyId, this.urlExpires, this.urlSignature, data);
       // TODO: should do a confirm email here???
       this.router.navigate(['login']);
       this.notifications.success('Account created')
     }
     catch
     {
       this.notifications.error('Error creating account')
     }
     finally
     {
       this.saving = false;
     }
     
   }

// TEST PAYLOAD
   base_scheulde = {
    monday: {
      start: 32400,
      end: 61200,
    },
    tuesday: {
      start: 32400,
      end: 61200,
    },
    wednesday: {
      start: 32400,
      end: 61200,
    },
    thursday: {
      start: 32400,
      end: 61200,
    },
    friday: {
      start: 32400,
      end: 61200,
    },
    saturday: {
      start: 32400,
      end: 61200,
    },
    sunday: {
      start: 32400,
      end: 61200,
    },
   }
}
