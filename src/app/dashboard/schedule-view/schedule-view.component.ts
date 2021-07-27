import { Component,  OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { Booking } from 'src/app/models/booking/booking.model';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeBookingService } from 'src/app/models/employee_booking.service';
import { AppStateService } from 'src/app/services/app-state.service';




/*
  TODO:
  - [ ] Should refresh calendar every ~5 minutes
*/



@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleViewComponent implements OnInit {

  loading = false;
  company: Company = new Company();
  filteredEmployees: Employee[] = [];

  constructor(
    private state: AppStateService,
    private companyService: CompanyService,
    private employeeBookingService: EmployeeBookingService,
  ) {}

  async ngOnInit(): Promise<void>
  {
    this.loading = true;

    this.company = await this.companyService.get(this.state.company_id);
    this.filteredEmployees = this.working_employees;
    
    const bookings: Booking[] = await this.employeeBookingService.get(
      this.filteredEmployees.map(employee => employee.id), 
      // TODO: swicth to selected date
      moment().unix().toString()
    );

    this.filteredEmployees.forEach(employee => 
      employee.bookings = bookings.filter(booking => 
        booking.employee_id === employee.id
      )
    ); 

    this.loading = false;
  }

  get working_employees(): Employee[]
  {
    return this.company.employees_working_today;
  }

  onFilterChanged()
  {
    // TODO: set this.filteredEmployees to new filter, load.
  }
}

