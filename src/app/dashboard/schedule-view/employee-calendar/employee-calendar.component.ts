import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { AppStateService } from 'src/app/services/app-state.service';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { ManualBookingDialogService } from '../manual-booking-dialog/manual-booking-dialog.component';
import { Booking } from 'src/app/models/booking/booking.model';
import * as moment from 'moment';
@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeCalendarComponent implements OnInit {
  
  @Input() employee: Employee = new Employee();
  @Input() clickDisabled: boolean = false;

  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private manualBookingDialog: ManualBookingDialogService,
  ) { }

  ngOnInit(): void 
  {
    this._mapBookingsToCalendarEvents(this.employee.bookings)
  }

  async selectToCreate(segment: WeekViewHourSegment, event: MouseEvent, segmentElement: HTMLElement): Promise<void> 
  {
    if (this.clickDisabled) return;

    const newEvent = this._createEventFromSelection(segment); 
    const bookingEvent = await this._createBooking(newEvent);
    
    if (! bookingEvent) return;

    this.events.push(newEvent)
    // this.events = [...this.events, newEvent];
    this.refresh();
  }

  private refresh() 
  {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  private async _createBooking(event: CalendarEvent<any>): Promise<any>
  {
    return await this.manualBookingDialog.open({
      employee: this.employee,
      event: event
    });
  }

  private _mapBookingsToCalendarEvents(bookings: Booking[])
  {
    this.events = bookings.map(booking => this._createEventFromBooking(booking))
  }

  private _createEventFromBooking(booking: Booking): CalendarEvent
  {
    return {
      id: booking.id,
      title: `${moment(booking.started_at).format('h:mm')} - ${moment(booking.ended_at).format('h:mm')}`,
      start: booking.started_at,
      end: booking.ended_at,
      meta: {
        tmpEvent: true,
      },
    }
  }

  private _createEventFromSelection(segment: WeekViewHourSegment)
  {
    return {
      id: this.events.length,
      title: 'New Booking',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    }
  }

}

// May be used in the future, drag to create bookings

// fromEvent(document, 'mousemove')
// .pipe(
//   finalize(() => {
//     delete dragToSelectEvent.meta.tmpEvent;
//     this.dragToCreateActive = false;
//     this.refresh();
//     this.onNewBooking(this.events[0]);
//   }),
//   takeUntil(fromEvent(document, 'mouseup'))
// )
// .subscribe((mouseMoveEvent: MouseEvent) => {
//   const minutesDiff = ceilToNearest(
//     mouseMoveEvent.clientY - segmentPosition.top,
//     30
//   );

//   const daysDiff =
//     floorToNearest(
//       mouseMoveEvent.clientX - segmentPosition.left,
//       segmentPosition.width
//     ) / segmentPosition.width;

//   const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
//   if (newEnd > segment.date && newEnd < endOfView) {
//     dragToSelectEvent.end = newEnd;
//   }
//   this.refresh();
// });

// function floorToNearest(amount: number, precision: number) {
//   return Math.floor(amount / precision) * precision;
// }

// function ceilToNearest(amount: number, precision: number) {
//   return Math.ceil(amount / precision) * precision;
// }
