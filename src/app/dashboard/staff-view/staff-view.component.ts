import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { StaffEditorService } from './staff-editor/staff-editor.service';
import { StaffInvitationDialogService } from './staff-invitation-dialog/staff-invitation-dialog-service';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.scss'],
})
export class StaffViewComponent implements OnInit {

  loading = false;
  saving = false;

  employees: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private notification: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private route: ActivatedRoute,
    private staffEditorService: StaffEditorService,
    private staffInvitationDialog: StaffInvitationDialogService,
    private state: AppStateService,
    private companyService: CompanyService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    try
    {
      this.employees = await this.employeeService.getAll();
    }
    catch
    {
      this.router.navigate([`${this.state.company_id}/staff`]);
      this.notification.error('Error loading staff')
    }
    finally
    {
      this.loading = false
    }
  }

  onEdit(employee = new Employee())
  {
    this.staffEditorService.staff = employee; 
    this.router.navigate([employee.id || 'new'], {relativeTo: this.route});
  }

  onNew()
  {
    this.staffInvitationDialog.open()
  }

  async onItemDropped(event): Promise<void>
  {
    moveItemInArray(this.employees, event.previousIndex, event.currentIndex);

    // Reset ordinal_position
    this.employees.forEach(
      (employee, index) => employee.ordinal_position = index
    );

    // Create paylod for PATCH update
    const payload = this.employees.map(
      employee => ({
        id: employee.id,
        ordinal_position: employee.ordinal_position,
      })
    )

    // Save
    this.saving = true;
    await this.companyService.updateEmployees(payload);
    this.saving = false;


    this.notification.success('Employee order updated')
  }

  onStaffTouched()
  {
    setTimeout(() => navigator.vibrate(50), 100)
  }

  async onToggleActive(employee: Employee): Promise<void>
  {
   try
   {
      await this.employeeService.updateActive(employee);
      this.notification.success(`Employee bookings ${employee.active ? 'enabled' : 'disabled'}`)
   }
   catch
   {
      this.notification.error('Error updating employee')
   }
  }
}
