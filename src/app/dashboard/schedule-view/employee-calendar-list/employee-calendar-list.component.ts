import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company/company.model';
import { Employee } from 'src/app/models/employee/employee.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { Moment } from 'src/types';

@Component({
  selector: 'app-employee-calendar-list',
  templateUrl: './employee-calendar-list.component.html',
  styleUrls: ['./employee-calendar-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeCalendarListComponent {

  @Input() company: Company;
  @Input() employees: Employee[];
  @Input() date: Moment;

  constructor(
    private router: Router,
    private state: AppStateService,
  ) { }

  onEmployeeSelected(employee: Employee) 
  {
    this.router.navigate([`${this.state.company_id}/staff/${employee.id}`])
  }
}
