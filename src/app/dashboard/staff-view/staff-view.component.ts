import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { StaffEditorService } from './staff-editor/staff-editor.service';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.scss']
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
      this.router.navigate(['dashboard/services']);
      this.notifications.error('Error loading services')
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
    // TODO: Add modal editor to send email or emails to new employees.
  }
}
