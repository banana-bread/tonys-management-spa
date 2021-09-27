import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee.model';

@Component({
  selector: 'app-employee-calendar-list',
  templateUrl: './employee-calendar-list.component.html',
  styleUrls: ['./employee-calendar-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeCalendarListComponent implements OnInit {

  @Input() employees: Employee[];

  constructor() { }

  ngOnInit(): void {
  }
}
