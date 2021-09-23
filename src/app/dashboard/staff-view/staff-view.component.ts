import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
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

  employees: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
    private route: ActivatedRoute,
    private staffEditorService: StaffEditorService,
    private staffInvitationDialog: StaffInvitationDialogService,
    private state: AppStateService,
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
      this.router.navigate([`${this.state.short_company_id}/staff`]);
      this.notifications.error('Error loading staff')
    }
    finally
    {
      this.loading = false
    }
  }

  onEdit(employee: Employee)
  {
    this.staffEditorService.staff = employee; 
    this.router.navigate([employee.id], {relativeTo: this.route});
  }

  onNew()
  {
    this.staffInvitationDialog.open()
  }

  async onToggleActive(employee: Employee): Promise<void>
  {
    /*
     - [ ] Create route for updating employee bookings enabled (EmployeeBookingsEnabledController)
     - [ ] 
    */

   try
   {
      await this.employeeService.updateActive(employee);
      this.notifications.success(`Employee bookings ${employee.active ? 'enabled' : 'disabled'}`)
   }
   catch
   {
      this.notifications.error('Error updating employee')
   }
  }
}
