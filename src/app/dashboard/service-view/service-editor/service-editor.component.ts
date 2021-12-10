import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { UnsavedChangesRouterService } from 'src/app/unsaved-changes/unsaved-changes-router.service';
import { ServiceEditorService } from './service-editor.service';
@Component({
  selector: 'app-service-editor',
  templateUrl: './service-editor.component.html',
  styleUrls: ['./service-editor.component.scss'],
  // animations: [
  //   trigger('slideInOut', [
  //     transition(':enter', [
  //       style({transform: 'translateY(100%)'}),
  //       animate('100ms ease-in', style({transform: 'translateY(0%)'}))
  //     ]),
  //     transition(':leave', [
  //       animate('2000ms ease-in', style({transform: 'translateY(100%)'}))
  //     ])
  //   ])
  // ]
})
export class ServiceEditorComponent implements OnInit {

  @ViewChild('editorForm') editorForm: NgForm;

  loading = false;
  saving = false;
  
  original = new ServiceDefinition();
  service = new ServiceDefinition();
  durationOptions: number[] = this.generateDurationOptions();

  employees: Employee[] = [];
  selectedEmployees: any[] = []; 

  serviceId: string = this.route.snapshot.paramMap.get('id');

  constructor(
    private serviceEditorService: ServiceEditorService,
    private route: ActivatedRoute,
    private router: Router,
    private state: AppStateService,
    private serviceDefinitionService: ServiceDefinitionService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private unsavedChangesRouter: UnsavedChangesRouterService,
    private employeeService: EmployeeService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    this.employees = await this.employeeService.getAll();

    if (this.serviceId === 'new') 
    {
      this.loading = false;
      return;
    }

    this.original = (!! this.serviceEditorService.service)
      ? this.serviceEditorService.service
      : await this.serviceDefinitionService.get(this.serviceId);
    
    this.service = this.original.copy();

    this.selectedEmployees = this.employees.filter(
      e => this.service.employee_ids.some(eid => e.id === eid)
    ) 

    if (this.service.employee_ids.length === this.employees.length)
    {
      this.selectedEmployees.push('all');
    }

    this.loading = false;
  }

  async onSave()
  {
    if (this.editorForm.invalid) return;
    
    this.saving = true;

    this.service.employee_ids = 
      this.selectedEmployees.filter(e => e !== 'all')
        .map(e => e.id);

    try
    {
      await this.serviceDefinitionService.save(this.service);
      this.router.navigate([`/${this.state.company_id}/services`])
      this.notifications.success('Service saved')
    }
    catch
    {
      this.notifications.error('Service could not be saved')
    }
    finally
    {
      this.saving = false;
    }
  }

  async onDelete(): Promise<void>
  {
    this.saving = true;

    const shouldDelete: boolean = await this.confirmDialog.open({
      title: 'Confirm service deletion',
      message: 'Are you sure you want to delete this service?',
      okLabel: 'Yes'
    });

    try
    {
      if (shouldDelete)
      {
        await this.serviceDefinitionService.delete(this.service);
        this.onClose();

        this.notifications.success('Service deleted');
      }
    }
    catch
    {
      this.notifications.error('Error deleting service');
    }
    finally
    {
      this.saving = false;
    }
  }

  onClose()
  {
    this.unsavedChangesRouter.tryNavigate(
      `/${this.state.company_id}/services`, 
      () => this.editorForm.pristine
    );
  }

  private generateDurationOptions(): number[]
  {
    const fiveMins = 300;
    const twoHours = 7200;
    const result: number[] = [];

    for(let i = fiveMins; i < twoHours; i += fiveMins)
    {
      result.push(i);
    }

    return result;
  }

  onSelectedEmployeeChange()
  {
    if ( this.selectedEmployees.length !== (this.employees.length + 1) &&
         this.selectedEmployees.some(e => e === 'all') )
    {
      this.selectedEmployees = this.selectedEmployees.filter(e => e !== 'all');
    }
  }

  displaySelectedEmployees()
  {
    return this.selectedEmployees.some(e => e === 'all')
      ? 'All'
      : this.selectedEmployees.map(e => e.full_name).join(', ')
  }

  toggleSelectAll()
  {
    this.selectedEmployees = this.employees.length === this.selectedEmployees.length
      ? []
      : [...this.employees.map(employee => employee), 'all']   
  }
}
