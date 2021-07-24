import { Component, Input, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee.model';

@Component({
  selector: 'app-employee-calendar-list',
  templateUrl: './employee-calendar-list.component.html',
  styleUrls: ['./employee-calendar-list.component.scss']
})
export class EmployeeCalendarListComponent implements OnInit {

  @Input() employees: Employee[];
  constructor() { }

  ngOnInit(): void {
  }

}
