import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Employee } from 'src/app/models/employee/employee.model';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import * as moment from 'moment'
import { secondsSinceStartOfDay } from 'src/app/helpers/moment.helper';
import { NgForm, NgModel } from '@angular/forms';
import { Booking, BookingType } from 'src/app/models/booking/booking.model';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
import { SyncErrorStateMatcher } from 'src/app/helpers/sync-error-state.matcher';
import { BookingService } from 'src/app/models/booking/booking.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { formattedTimeStringToSeconds } from 'src/app/helpers/helpers';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

type DialogData = {
  services: ServiceDefinition[], 
  employee: Employee, 
  booking?: Booking,
  event: CalendarEvent<any>, 
  onBookingCancel?: (booking: Booking) => void
};

@Component({
  selector: 'app-booking-editor-dialog',
  templateUrl: './booking-editor.component.html',
  styleUrls: ['./booking-editor.component.scss']
})
export class BookingEditorComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @ViewChild('startTimeField') startTimeField: NgModel;

  event: CalendarEvent<any> = this.data.event
  onCancel = this.data.onBookingCancel
  manualClientName: string
  startTime: number
  endTime: number
  serviceDefinitions: ServiceDefinition[] = []
  errorStateMatcher = new SyncErrorStateMatcher()
  booking = new Booking({ type: BookingType.APPOINTMENT})
  isAllDay = false

  loading = false;
  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    public dialogRef: MatDialogRef<BookingEditorComponent>,
    private bookingService: BookingService,
    private notification: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;
    this.booking.employee = this.data.employee
    this.booking.employee_id = this.booking.employee.id


    this.startTime = secondsSinceStartOfDay(moment(this.event.start))

    if (!! this.data.booking)
    {
      this.booking = this.data.booking
      this.endTime = secondsSinceStartOfDay(moment(this.booking.ended_at))
    }
    else
    {
      this.serviceDefinitions = this.data.services
      // this.serviceDefinitions = this.data.services.filter(
        // service => service.employee_ids.some(id => id === this.booking.employee.id)
      // )
    }

    this.loading = false;
  }

  isAppointmentType(): boolean
  {
    return this.booking.type === BookingType.APPOINTMENT
  }

  hasBookingsForDay(): boolean
  {
    return !!this.booking.employee.bookings.length
  }

  getTitle()
  {
    let title = !this.booking.exists()
      ? 'New '
      : ''

    title += this.booking.isAppointment()
      ? 'Booking'
      : 'Time Off'

    return title
  }

  displayServices(): string
  {
    return this.booking.services.map(service => service.name).join(', ');
  }

  formatTime(seconds: number): Date
  {
    return moment(this.event.start).startOf('day').add(seconds, 'seconds').toDate();
  }

  startTimes(): number[]
  {
    const result: number[] = [];
    const dayStart = this.booking.employee.base_schedule.startOf(this.event.start);
    const dayEnd = this.booking.employee.base_schedule.endOf(this.event.start);

    const dayStartInSeconds = formattedTimeStringToSeconds(dayStart);
    const dayEndInSeconds = formattedTimeStringToSeconds(dayEnd);

    // TODO: hardcoded to increase start time by 15 minutes from start - end.
    for (let i = dayStartInSeconds; i < dayEndInSeconds; i += 900)
    {
      // TODO: again... hard coded to 15 minutes
      const overlappingBookingExists: boolean = 
        !!this.booking.employee.bookings.find(
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

  endTimes(): number[]
  {
    const nextBookingAfterCurrent = this.booking.employee.bookings.find(
      booking => secondsSinceStartOfDay(booking.started_at) > this.startTime
    )

    const rangeStart = this.startTime + 900
    let rangeEnd = !!nextBookingAfterCurrent 
      ? secondsSinceStartOfDay(nextBookingAfterCurrent.started_at)
      : formattedTimeStringToSeconds(this.booking.employee.base_schedule.endOf(this.event.start))
    rangeEnd += 900

    const result: number[] = []

    for (let i = rangeStart; i < rangeEnd; i += 900)
    {
      result.push(i)
    }

    return result
  }

  calculateEndTime()
  {
    return (this.booking.type === BookingType.TIME_OFF)
      ? this.endTime
      : this.startTime + this.getAllServicesDuration()
  }

  getAllServicesDuration(): number
  {
   return this.booking.services.reduce((acc, i) => acc + i.duration, 0)
  }

  onServicesChanged()
  {
    this.endTime = this.calculateEndTime()

    const overlapsBooking: boolean = 
      !!this.booking.employee.bookings.find(
        booking => this.endTime > secondsSinceStartOfDay(booking.started_at) && 
                   this.startTime < secondsSinceStartOfDay(booking.started_at)
      );

    const baseScheduleEnd: string = this.booking.employee.base_schedule.endOf(this.event.start);
    const shiftEndInSeconds = (parseInt(baseScheduleEnd.split(':')[0]) * 3600) + (parseInt(baseScheduleEnd.split(':')[1]) * 60);
    const exceedsEndTime: boolean = this.endTime > shiftEndInSeconds;

    
    if (overlapsBooking || exceedsEndTime && !!this.endTime)
    {
      this.startTimeField.control.setErrors({ overlap: true });
    }
    else
    {
      this.startTimeField.control.setErrors(null);
    }
  }

  onBookingTypeChanged()
  {
    this.booking.services = []
    this.booking.note.body = null
  }

  async onSave(): Promise<any>
  {
    if (this.form.invalid) return

    this.saving = true; 

    this.event.start = moment(this.event.start).startOf('day').add(this.startTime, 'seconds').toDate();
    this.event.end = moment(this.event.start).startOf('day').add(this.endTime, 'seconds').toDate();
    this.event.title = `${moment(this.event.start).format('h:mm')} - ${moment(this.event.end).format('h:mm')} (${this.booking.services.map(service => service.name).join(', ')})  <br>${ this.booking.manual_client_name || 'Walk-in'}`

    this.booking.started_at = this.event.start
    this.booking.ended_at = this.event.end

    try
    {
      const booking = await this.booking.save()
      
      this.event.id = booking.id
      this.event.meta.type = booking.type
      this.dialogRef.close({event: this.event, booking: booking})
      this.notification.success(`${booking.isAppointment() ? 'Booking' : 'Time off'} created!`)
    }
    catch (e)
    {
      this.dialogRef.close();
      this.notification.error(e?.error?.message);
    }
    finally
    {
      this.saving = false;
    }
  }

  async onCancelBooking()
  {
    const bookingTypeLabel = this.booking.isAppointment() 
      ? 'booking' 
      : 'time off'
    const bookingTypeLabelCapitalized = bookingTypeLabel.charAt(0).toUpperCase() + bookingTypeLabel.slice(1)

    const shouldCancel = await this.confirmDialog.open({
      title: 'Confirm cancellation',
      message: `Are you sure you want to cancel this ${bookingTypeLabel}?`,
      okLabel: 'Yes',
      cancelLabel: 'No',
    });

    if (shouldCancel)
    {
      this.saving = true;

      try
      {
        await this.bookingService.cancel(this.booking.id);
        this.notification.success(`${bookingTypeLabelCapitalized} cancelled`)
        this.dialogRef.close()
        this.onCancel(this.booking);
      }
      catch (e)
      {
        this.notification.error(`${bookingTypeLabelCapitalized} could not be cancelled`)
      }
      finally
      {
        this.saving = false;
      }
    }
  }

  onStartTimeChanged()
  {
    const overlapsBooking: boolean = 
    !!this.booking.employee.bookings.find(
      booking => this.endTime > secondsSinceStartOfDay(booking.started_at) && 
                 this.startTime < secondsSinceStartOfDay(booking.started_at)
    );

    const baseScheduleEnd: string = this.booking.employee.base_schedule.endOf(this.event.start);
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

  onIsAllDayChanged()
  {
    if (!this.isAllDay) return

    this.startTime = formattedTimeStringToSeconds(this.booking.employee.base_schedule.startOf(this.event.start))
    this.endTime = formattedTimeStringToSeconds(this.booking.employee.base_schedule.endOf(this.event.start))  
  }

  onReservableTypeChanged()
  {
    this.isAllDay = false
  }
}

@Injectable({
  providedIn: 'root'
})
export class BookingEditorService {

  isOnMobile: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.XSmall
  );

  constructor(
    private dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  async open(data: DialogData): Promise<any>
  {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      width: '100%',
      maxWidth: '100vw',
      data
    }

    const dialog = this.dialog.open(BookingEditorComponent, dialogConfig)
    const smallDialogSubscription = this.isOnMobile.subscribe(size => {
      if (size.matches) {
        dialog.updateSize('100vw', '100vh');
      } else {
        dialog.updateSize('550px', '');
      }
    });

    dialog.afterClosed().subscribe(() => {
      smallDialogSubscription.unsubscribe()
    })

    return dialog.afterClosed().toPromise()
  }
}
