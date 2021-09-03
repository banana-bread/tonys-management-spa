import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Employee } from 'src/app/models/employee/employee.model';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import * as moment from 'moment'
import { secondsSinceStartOfDay } from 'src/app/helpers/moment.helper';
import { NgForm, NgModel } from '@angular/forms';
import { EmployeeBookingService } from 'src/app/models/employee_booking.service';
import { Booking } from 'src/app/models/booking/booking.model';
import { SnackbarNotificationService } from '@tonys/shared';
import { SyncErrorStateMatcher } from 'src/app/helpers/sync-error-state.matcher';
import { BookingService } from 'src/app/models/booking/booking.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';

type DialogData = {employee: Employee, event: CalendarEvent<any>, onBookingCancel?: (booking: Booking) => void};

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
  services: ServiceDefinition[] = [];
  startTime: number = secondsSinceStartOfDay(moment(this.event.start));
  endTime: number;
  selectedServices: ServiceDefinition[] = [];
  errorStateMatcher = new SyncErrorStateMatcher();
  booking: Booking;

  loading = false;
  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    public dialogRef: MatDialogRef<BookingEditorComponent>,
    private serviceDefService: ServiceDefinitionService,
    private employeeBookingService: EmployeeBookingService,
    private bookingService: BookingService,
    private notification: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    this.services = await this.serviceDefService.getAll()

    if (this.bookingExists())
    {
      this.booking = await this.bookingService.get(this.event.id as string);
      this._mapServicesToBooking()
    }

    this.loading = false;
  }

  private _mapServicesToBooking()
  {
    this.selectedServices = this.services.filter(
      serviceDef => this.booking.services.find(
        service => service.service_definition_id === serviceDef.id
      )
    )
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

    this.saving = true; 
    
    this.event.start = moment().startOf('day').add(this.startTime, 'seconds').toDate();
    this.event.end = moment().startOf('day').add(this.endTime, 'seconds').toDate();
    this.event.title = `${moment(this.event.start).format('h:mm')} - ${moment(this.event.end).format('h:mm')}`
    
    try
    {
      const booking = await this.employeeBookingService.create(this.event, this.selectedServices, this.employee.id);
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
      this.saving = false;
    }
  }

  async onCancelBooking()
  {
    const shouldCancel = await this.confirmDialog.open({
      title: 'Confirm cancellation',
      message: 'Are you sure you want to cancel this booking?'
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
        console.log(e)
        this.notification.error('Booking could not be cancelled')
      }
      finally
      {
        this.saving = false;
      }
    }
  }

  bookingExists(): boolean
  {
    return !!this.event.id
  }
}

@Injectable({
  providedIn: 'root'
})
export class BookingEditorService {

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

    return this.dialog.open(BookingEditorComponent, dialogConfig)
      .afterClosed()
      .toPromise();
  }
}