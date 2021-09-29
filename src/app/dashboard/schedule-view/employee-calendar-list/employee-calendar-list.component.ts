import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee.model';
import { Moment } from 'src/types';

@Component({
  selector: 'app-employee-calendar-list',
  templateUrl: './employee-calendar-list.component.html',
  styleUrls: ['./employee-calendar-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeCalendarListComponent implements OnInit {

  @Input() employees: Employee[];
  @Input() date: Moment;

  constructor() { }

  ngOnInit(): void {
  }
}
