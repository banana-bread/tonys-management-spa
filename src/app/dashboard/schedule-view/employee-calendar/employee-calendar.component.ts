import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarDayViewBeforeRenderEvent, CalendarEvent } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { Employee } from 'src/app/models/employee/employee.model';
import { BookingEditorService } from '../booking-editor/booking-editor.component';
import { Booking } from 'src/app/models/booking/booking.model';
import * as moment from 'moment';
import { BookingService } from 'src/app/models/booking/booking.service';
import { Moment } from 'src/types';
@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeCalendarComponent implements OnInit {
  
  @Input() employee: Employee = new Employee();
  @Input() date: Moment;
  @Input() isFirst: boolean = false;

  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private bookingEditor: BookingEditorService,
    private bookingService: BookingService,
  ) { }

  ngOnInit(): void 
  {
    this.viewDate = this.date.toDate();

    this._mapBookingsToCalendarEvents(this.employee.bookings)
  }

  async onEventClicked(event: any): Promise<any>
  {
    const onBookingCancel = (booking: Booking) => 
    {
      const index = this.events.findIndex(event => event.id === booking.id)
      this.events.splice(index, 1);
      this._refresh();
    }

    return await this.bookingEditor.open({
      employee: this.employee,
      event,
      onBookingCancel,
    });
  }

  async selectToCreate(segment: WeekViewHourSegment, event: MouseEvent, segmentElement: HTMLElement): Promise<void> 
  {
    if (this._isWithinEmployeeWorkingHours(segment) || this.isFirst) return;

    const newEvent = this._createEventFromSelection(segment); 
    const bookingEvent = await this._createBooking(newEvent);
    
    if (! bookingEvent) return;

    this.events.push(newEvent)
    this._refresh();
  }

  private _refresh() 
  {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  private async _createBooking(event: CalendarEvent<any>): Promise<any>
  {
    return await this.bookingEditor.open({
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
      id: null,
      title: 'New Booking',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    }
  }

  private _isWithinEmployeeWorkingHours(segment: WeekViewHourSegment): boolean
  {
    return (segment.displayDate.getHours() < this.employee.base_schedule?.today().startInHours() || 
    segment.displayDate.getHours() >= this.employee.base_schedule?.today().endInHours());
  }

  hourSegmentModifier(renderEvent: CalendarDayViewBeforeRenderEvent)
  {
    renderEvent.hourColumns.forEach((hourColumn) => {
      hourColumn.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          if (this._isWithinEmployeeWorkingHours(segment) && !this.isFirst)
          {
            segment.cssClass = 'hour-segment--disabled'
          }
        });
      });
    });
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
