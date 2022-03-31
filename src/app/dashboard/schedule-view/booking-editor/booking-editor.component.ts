import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Employee } from 'src/app/models/employee/employee.model';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import * as moment from 'moment'
import { secondsSinceStartOfDay } from 'src/app/helpers/moment.helper';
import { NgForm, NgModel } from '@angular/forms';
import { EmployeeBookingService } from 'src/app/models/employee_booking.service';
import { Booking } from 'src/app/models/booking/booking.model';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { SyncErrorStateMatcher } from 'src/app/helpers/sync-error-state.matcher';
import { BookingService } from 'src/app/models/booking/booking.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { formattedTimeStringToSeconds } from 'src/app/helpers/helpers';

type DialogData = {
  services: ServiceDefinition[], 
  employee: Employee, 
  booking?: Booking,
  event: CalendarEvent<any>, 
  onBookingCancel?: (booking: Booking) => void
};

// TODO: maybe add this to the moment prototype


@Component({
  selector: 'app-booking-editor-dialog',
  templateUrl: './booking-editor.component.html',
  styleUrls: ['./booking-editor.component.scss']
})
export class BookingEditorComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @ViewChild('startTimeField') startTimeField: NgModel;

  employee: Employee = this.data.employee;
  event: CalendarEvent<any> = this.data.event;
  onCancel = this.data.onBookingCancel;
  manualClientName: string;
  startTime: number;
  endTime: number;
  services: any = [];
  selectedServices: any = [];
  errorStateMatcher = new SyncErrorStateMatcher();
  booking: Booking;

  loading = false;
  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    public dialogRef: MatDialogRef<BookingEditorComponent>,
    private employeeBookingService: EmployeeBookingService,
    private bookingService: BookingService,
    private notification: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    this.startTime = secondsSinceStartOfDay(moment(this.event.start));
    this.endTime = secondsSinceStartOfDay(moment(this.event.end));


    if (!! this.data.booking)
    {
      this.booking = this.data.booking;
      this.services = this.booking.services;
    }
    else
    {
      this.services = this.data.services.filter(
        service => service.employee_ids.some(id => id === this.employee.id)
      )
    }

    this.loading = false;
  }

  displayServices(): string
  {
    return this.services.map(service => service.name).join(', ');
  }

  formatTime(seconds: number): Date
  {
    return moment(this.event.start).startOf('day').add(seconds, 'seconds').toDate();
  }

  times(): number[]
  {
    const result: number[] = [];
    const dayStart = this.employee.base_schedule.startOf(this.event.start);
    const dayEnd = this.employee.base_schedule.endOf(this.event.start);

    const dayStartInSeconds = formattedTimeStringToSeconds(dayStart);
    const dayEndInSeconds = formattedTimeStringToSeconds(dayEnd);

    // TODO: hardcoded to increase start time by 15 minutes from start - end.
    for (let i = dayStartInSeconds; i < dayEndInSeconds; i += 900)
    {
      // TODO: again... hard coded to 15 minutes
      const overlappingBookingExists: boolean = 
        !!this.employee.bookings.find(
          booking => secondsSinceStartOfDay(booking.started_at) == i || 
          ( secondsSinceStartOfDay(booking.started_at) + 900 == i &&
          secondsSinceStartOfDay(booking.ended_at) > (i + 1) )
        );

      if (! overlappingBookingExists)
      {
        result.push(i);
      }
    }

    return result;
  }

  onServicesChanged()
  {
    const totalDuration = this.selectedServices.reduce((acc, i) => acc + i.duration, 0);
    this.endTime = this.startTime + totalDuration;

    const overlapsBooking: boolean = 
      !!this.employee.bookings.find(
        booking => this.endTime > secondsSinceStartOfDay(booking.started_at) && 
                   this.startTime < secondsSinceStartOfDay(booking.started_at)
      );

    const baseScheduleEnd: string = this.employee.base_schedule.endOf(this.event.start);
    const shiftEndInSeconds = (parseInt(baseScheduleEnd.split(':')[0]) * 3600) + (parseInt(baseScheduleEnd.split(':')[1]) * 60);
    const exceedsEndTime: boolean = this.endTime > shiftEndInSeconds;

    
    if (overlapsBooking || exceedsEndTime)
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

    this.saving = true; 
    this.event.start = moment(this.event.start).startOf('day').add(this.startTime, 'seconds').toDate();
    this.event.end = moment(this.event.start).startOf('day').add(this.endTime, 'seconds').toDate();
    this.event.title = `${moment(this.event.start).format('h:mm')} - ${moment(this.event.end).format('h:mm')} (${this.selectedServices.map(service => service.name).join(', ')})  <br>${this.manualClientName || 'Walk-in'}`
    
    try
    {
      const booking = await this.employeeBookingService.create(this.event, this.selectedServices, this.employee.id, this.manualClientName);

      this.event.id = booking.id;
      this.dialogRef.close({event: this.event, booking: booking});
      this.notification.success('Booking created!');
    }
    catch (e)
    {
      this.dialogRef.close();
      this.notification.error(e.error.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  async onCancelBooking()
  {
    const shouldCancel = await this.confirmDialog.open({
      title: 'Confirm cancellation',
      message: 'Are you sure you want to cancel this booking?',
      okLabel: 'Yes',
      cancelLabel: 'No',
    });

    if (shouldCancel)
    {
      this.saving = true;

      try
      {
        await this.bookingService.cancel(this.booking.id);
        this.notification.success('Booking cancelled')
        this.dialogRef.close()
        this.onCancel(this.booking);
      }
      catch (e)
      {
        this.notification.error('Booking could not be cancelled')
      }
      finally
      {
        this.saving = false;
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class BookingEditorService {

  constructor(private dialog: MatDialog) {}

  async open(data: DialogData): Promise<any>
  {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      width: '100%',
      maxWidth: 400,
      minWidth: 300,
      data
    }

    return this.dialog.open(BookingEditorComponent, dialogConfig)
      .afterClosed()
      .toPromise();
  }
}