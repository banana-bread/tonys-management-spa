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
  selectedPickerDate: Date;

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
    this._setDateParam( this._determineDate() );
    this._setFilteredEmployees();

    await this._setBookings();

    this.loading = false;
  }
  
  formattedDate(): string
  {
    return this.dateToMoment().format('dddd, MMM D, YYYY')
  }

  dateToMoment(): Moment
  {
    return moment(new Date(this.selectedDate * 1000));
  }

  async onPrevChosen(): Promise<void>
  {
    await this._onDateChosen( this.dateToMoment().subtract(1, 'day') );
  }

  async onNextChosen(): Promise<void>
  {
    await this._onDateChosen( this.dateToMoment().add(1, 'day') );
  }

  async onTodayChosen(): Promise<void>
  {
    await this._onDateChosen( moment().startOf('day') );
  }

  async onSelectedPickerDateChanged(): Promise<void>
  {
    await this._onDateChosen( moment(this.selectedPickerDate) );
  }

  async _onDateChosen(date: Moment): Promise<void>
  {
    this.loading = true;

    this._setDateParam( date.unix() );
    this._setFilteredEmployees();
    await this._setBookings();

    this.loading = false;
  }

  private _determineDate(): number
  {
    const dateParam = parseInt(this.route.snapshot.queryParamMap.get('date'));

    return (! isNaN(dateParam)) 
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

  private _setFilteredEmployees(): void
  {
    this.filteredEmployees = this.company.getEmployeesWorking( this.dateToMoment() );
  }
}
