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
import { StaffEditorService } from './staff-editor.service';

@Component({
  selector: 'app-staff-editor',
  templateUrl: './staff-editor.component.html',
  styleUrls: ['./staff-editor.component.scss']
})
export class StaffEditorComponent implements OnInit {

  @ViewChild('editorForm') editorForm: NgForm;

  loading = false;
  saving = false;

  original: Employee;
  employee: Employee = new Employee();
  employeeName: string;
  employeeId: string = this.route.snapshot.paramMap.get('id');
  employeeRegistrationUrl = this.route.snapshot.queryParams['signed-url'];
  password: string;

  urlCompanyId: string;
  urlExpires: string;
  urlSignature: string;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private state: AppStateService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private staffEditorService: StaffEditorService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
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

    this.router.navigate([`/${this.state.company_id}/staff`]);
  }

  onSave()
  {
    if (this.editorForm.invalid) return;

    !!this.original ? this.update() : this.create();
  }

  // When editing employee
  protected update()
  {
    console.log('updating.....')
  }

  // When creating new emplyee from invite url
  protected async create(): Promise<any>
  {
    const data = {
      name: this.employee.name,
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

  onBaseScheduleChanged()
  {
    console.log('observing base schedule change...')
  }


  onDelete(){}

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
