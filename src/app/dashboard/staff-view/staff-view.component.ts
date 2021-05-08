import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeService } from 'src/app/models/employee/employee.service';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.scss']
})
export class StaffViewComponent implements OnInit {

  employees: Employee[];

  constructor(private employeeService: EmployeeService) { }

  async ngOnInit(): Promise<void> 
  {
    this.employees = await this.employeeService.getAll();
  }

}
