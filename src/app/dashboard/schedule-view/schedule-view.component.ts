import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { Booking } from 'src/app/models/booking/booking.model';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { Moment } from 'src/types';
import { EmployeeCalendarComponent } from './employee-calendar/employee-calendar.component';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleViewComponent implements OnInit, OnDestroy {

  @ViewChild(EmployeeCalendarComponent) calendarComponent: EmployeeCalendarComponent;

  loading = false;
  company: Company = new Company();
  filteredEmployees: Employee[] = [];
  selectedDate: number = moment().unix();
  selectedPickerDate: Date;
  private _refreshBookingsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: AppStateService,
    private companyService: CompanyService,
  ) {}

  async ngOnInit(): Promise<void>
  {
    this.loading = true;

    this.company = await this.companyService.get(this.state.company_id);

    this._setDateParam( this._determineDate() );

    await this._setBookings();

    setTimeout(() => this._startRefreshBookingsSubscription(), 20000)

    this.loading = false;
  }

  ngOnDestroy(): void 
  {
    this._refreshBookingsSubscription?.unsubscribe();
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
    // const response: any = await this.employeeBookingService.get(this.selectedDate.toString());
    const response: any = await Booking.findByDate(this.selectedDate.toString())

    // Filter companies employees by if they are scheduled to work, or have bookings
    const employees = this.company.employees
      .filter(employee => !!response[employee.id] || employee.isWorking( this.dateToMoment() ))
      .sort((a, b) => a.ordinal_position - b.ordinal_position)

    // Apply bookings to employees that have them
    employees.forEach(employee => {
        employee.bookings = response[employee.id]
          ? response[employee.id].map((data: any) => new Booking(data))
          : [];
      });

    this.filteredEmployees = employees;
  }

  private async _startRefreshBookingsSubscription()
  {
    // Every minute
    this._refreshBookingsSubscription = interval(60000).subscribe(() => {
      this._setBookings();
    });
  }
}