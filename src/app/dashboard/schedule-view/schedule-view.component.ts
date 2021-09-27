import { Component,  OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Booking } from 'src/app/models/booking/booking.model';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { EmployeeBookingService } from 'src/app/models/employee_booking.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { Moment } from 'src/types';

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
  selectedDate: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: AppStateService,
    private companyService: CompanyService,
    private employeeBookingService: EmployeeBookingService,
  ) {}

  async ngOnInit(): Promise<void>
  {
    this.loading = true;

    this.company = await this.companyService.get(this.state.company_id);
    this.filteredEmployees = this.working_employees;

    this._setDateParam( this._determineDate() );
    this._setBookings();

    this.loading = false;
  }

  // TODO: This needs to be dealt with.  working employees needs to be changed depending on
  //       the date selected in this component... not by if they are working based on base 
  //       schedule... 
  get working_employees(): Employee[]
  {
    return this.company.employees_working_today;
  }

  onFilterChanged()
  {
    // TODO: set this.filteredEmployees to new filter, load.
  }
  
  formattedDate(): string
  {
    return this._dateToCalendar().format('dddd, MMM D, YYYY')
  }

  async onPrevChosen(): Promise<void>
  {
    this.loading = true;

    this._setDateParam( this._dateToCalendar().subtract(1, 'day').unix() );
    await this._setBookings();

    this.loading = false;
  }

  async onNextChosen(): Promise<void>
  {
    this.loading = true;

    this._setDateParam( this._dateToCalendar().add(1, 'day').unix() );
    await this._setBookings();

    this.loading = false;
  }

  async onTodayChosen(): Promise<void>
  {
    this.loading = true;
    this._setDateParam( moment().startOf('day').unix() );
    await this._setBookings();

    this.loading = false;
  }

  private _determineDate(): number
  {
    const dateParam = this.route.snapshot.queryParamMap.get('date');

    return (typeof dateParam == 'number') 
      ? dateParam 
      : moment().startOf('day').unix();
  }

  private _setDateParam(date: number)
  {
    const queryParams: Params = { date };
    this.selectedDate = date;
    
    this.router.navigate(
      [], 
      { 
        relativeTo: this.route, 
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      } 
    )
  }

  private async _setBookings(): Promise<void>
  {
    const bookings: Booking[] = await this.employeeBookingService.get(
      this.filteredEmployees.map(employee => employee.id), this.selectedDate.toString()
    );

    this.filteredEmployees.forEach(employee => 
      employee.bookings = bookings.filter(booking => 
        booking.employee_id === employee.id
      )
    ); 
  }

  private _dateToCalendar(): Moment
  {
    return moment(new Date(this.selectedDate * 1000));
  }
}
