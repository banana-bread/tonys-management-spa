import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Employee } from 'src/app/models/employee/employee.model';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import * as moment from 'moment'
import { Moment } from 'src/types';
import { secondsSinceStartOfDay } from 'src/app/helpers/moment.helper';
import { NgForm, NgModel } from '@angular/forms';
import { EmployeeBookingService } from 'src/app/models/employee_booking.service';
import { Booking } from 'src/app/models/booking/booking.model';
import { SnackbarNotificationService } from '@tonys/shared';

type DialogData = {employee: Employee, event: CalendarEvent<any>};

// TODO: maybe add this to the moment prototype


@Component({
  selector: 'app-manual-booking-dialog',
  templateUrl: './manual-booking-dialog.component.html',
  styleUrls: ['./manual-booking-dialog.component.scss']
})
export class ManualBookingDialogComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @ViewChild('startTimeField') startTimeField: NgModel;

  employee: Employee = this.data.employee;
  event: CalendarEvent<any> = this.data.event;
  services: ServiceDefinition[] = [];
  startTime: number = secondsSinceStartOfDay(moment(this.event.start));
  endTime: number;
  selectedServices: ServiceDefinition[] = [];

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    public dialogRef: MatDialogRef<ManualBookingDialogComponent>,
    private serviceDefService: ServiceDefinitionService,
    private bookingService: EmployeeBookingService,
    private notification: SnackbarNotificationService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.services = await this.serviceDefService.getAll()
  }

  formatTime(seconds: number): Date
  {
    return moment().startOf('day').add(seconds, 'seconds').toDate();
  }

  times(): number[]
  {
    const result: number[] = [];
    const dayStart = this.employee.base_schedule.startOfToday();
    const dayEnd = this.employee.base_schedule.endOfToday();

    // TODO: hardcoded to increase start time by 15 minutes from start - end.
    for (let i = dayStart; i < dayEnd; i += 900)
    {
      const overlappingBookingExists: boolean = 
        !!this.employee.bookings.find(booking => secondsSinceStartOfDay(booking.started_at) == i)

          if (! overlappingBookingExists)
          {
            result.push(i);
          }
    }

    return result;
  }

  onServicesChanged()
  {
    const totalDuration: number = this.selectedServices.reduce((acc, i) => acc + i.duration, 0);
    this.endTime = this.startTime + totalDuration;

    const overlapsBooking: boolean = 
      !!this.employee.bookings.find(
        booking => this.endTime > secondsSinceStartOfDay(booking.started_at) && 
                   this.startTime < secondsSinceStartOfDay(booking.started_at)
      );

    if (overlapsBooking)
    {
      this.startTimeField.control.setErrors({ overlap: true });
    }
    else
    {
      this.startTimeField.control.setErrors(null);
    }
  }

  async onSave(): Promise<any>
  {
    if (this.form.invalid) return;

    this.loading = true; 
    
    this.event.start = moment().startOf('day').add(this.startTime, 'seconds').toDate();
    this.event.end = moment().startOf('day').add(this.endTime, 'seconds').toDate();
    this.event.title = `${moment(this.event.start).format('h:mm')} - ${moment(this.event.end).format('h:mm')}`
    
    try
    {
      const booking = await this.bookingService.create(this.event, this.selectedServices, this.employee.id);
      this.event.id = booking.id;
      this.dialogRef.close(this.event);
      this.notification.success('Booking created!');
    }
    catch
    {
      this.dialogRef.close();
      this.notification.error('Error creating booking');
    }
    finally
    {
      this.loading = false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ManualBookingDialogService {

  constructor(private dialog: MatDialog) {}

  async open(data: DialogData): Promise<CalendarEvent<any>>
  {
    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: '100%',
      maxWidth: 400,
      minWidth: 300,
      data
    }

    return this.dialog.open(ManualBookingDialogComponent, dialogConfig)
      .afterClosed()
      .toPromise();
  }
}