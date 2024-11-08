import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarDayViewBeforeRenderEvent, CalendarEvent } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { Employee } from 'src/app/models/employee/employee.model';
import { BookingEditorService } from '../booking-editor/booking-editor.component';
import { Booking, BookingType } from 'src/app/models/booking/booking.model';
import * as moment from 'moment';
import { Moment } from 'src/types';
import { toEnglishDay } from 'src/app/helpers/moment.helper';
import { AuthedUserService } from 'src/app/services/authed-user.service';
import { interval, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company/company.model';
@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeCalendarComponent implements OnInit, OnDestroy {

  @Input() company: Company;
  @Input() employee: Employee = new Employee();
  @Input() date: Moment;
  @Input() isFirst: boolean = false;

  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  refreshPage: Subscription;
  // refreshSubject: Subject<any> = new Subject();

  constructor(
    private cdr: ChangeDetectorRef,
    private bookingEditor: BookingEditorService,
    public authedUser: AuthedUserService,
  ) { }

  ngOnInit(): void 
  {
    this.viewDate = this.date.toDate();

    this._mapBookingsToCalendarEvents(this.employee.bookings)

    this.refreshPage = interval(60000).subscribe(() => {
      this._mapBookingsToCalendarEvents(this.employee.bookings)

      this.events.forEach(event => {
        event.cssClass = this._determineEventClass(event);
      })

      this.refresh();
    });
  }

  ngOnDestroy(): void 
  {
    this.refreshPage.unsubscribe();
  }

  async onEventClicked(event: any): Promise<any>
  {
    if (! this.authedUser.canAlterEmployeeBooking(this.employee)) return;

    const onBookingCancel = (booking: Booking) => 
    {
      this.employee.removeBooking(booking);
      const index = this.events.findIndex(event => event.id === booking.id)
      this.events.splice(index, 1);
      this.refresh();
    }

    return await this.bookingEditor.open({
      services: this.company.service_definitions,
      employee: this.employee,
      booking: this.employee.bookings.find(booking => booking.id === event.id),
      event,
      onBookingCancel,
    });
  }

  async selectToCreate(segment: WeekViewHourSegment, event: MouseEvent, segmentElement: HTMLElement): Promise<void> 
  {
    if ( ! this._isWithinEmployeeWorkingHours(segment) || 
         this.isFirst || 
         ! this.authedUser.canAlterEmployeeBooking(this.employee) ) 
    {
      return;
    }
  
    const newEvent = this._createEventFromSelection(segment)
    const bookingEvent = await this._createBooking(newEvent)
    
    if (! bookingEvent) return;

    this.events.push(newEvent)
    this.refresh();
  }

  hourSegmentModifier(renderEvent: CalendarDayViewBeforeRenderEvent)
  {
    renderEvent.hourColumns.forEach((hourColumn) => {
      hourColumn.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          if (! this._isWithinEmployeeWorkingHours(segment) && !this.isFirst)
          {
            segment.cssClass = 'hour-segment--out-of-bounds'
          }
        });
      });
    });
  }

  public refresh() 
  {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  private _determineEventClass(bookingEvent)
  {
    if (!bookingEvent) return ''

    const modifier = moment(bookingEvent.end).isAfter(moment()) 
      ? '' 
      : '--passed'

    const cssClass = bookingEvent.meta.type === BookingType.APPOINTMENT
      ? 'calendar-appointment-event'
      : 'calendar-time-off-event'

    return cssClass + modifier
  }

  private async _createBooking(event: CalendarEvent<any>): Promise<any>
  {
    const result: any = await this.bookingEditor.open({
      services: this.company.service_definitions,
      employee: this.employee,
      event: event
    });

    if (!result?.event || !result?.booking) return null

    if (!! result.booking)
    {
      this.employee.bookings.push(result.booking)
    } 

    result.event.cssClass = this._determineEventClass(result.event)
    result.event.title = this._createEventTitleFromBooking(result.booking)

    return result.event;
  }

  private _mapBookingsToCalendarEvents(bookings: Booking[])
  {
    this.events = bookings.map(booking => this._createEventFromBooking(booking))
  }

  private _createEventFromBooking(booking: Booking): CalendarEvent
  {
    const event = {
      id: booking.id,
      title: this._createEventTitleFromBooking(booking),
      start: booking.started_at,
      end: booking.ended_at,
      cssClass: null,
      meta: {
        tmpEvent: true,
        type: booking.type,
      },
    }

    event.cssClass = this._determineEventClass(event)

    return event
  }

  private _createEventTitleFromBooking(booking: Booking): string
  {
    const space = '&nbsp;&nbsp;'
    const lineBreak = '<br>'
    const scheduledFor = `${moment(booking.started_at).format('h:mm')} - ${moment(booking.ended_at).format('h:mm')}`
    let details: string
    let client: string
    let bookingNote: string

    if (booking.isAppointment())
    {
      details = `(${booking.services.map(service => service.name).join(', ')})`
      client = booking.client.first_name || booking.manual_client_name
      bookingNote = booking.note.exists() ? '&nbsp;&nbsp;&#9998;' : ''
    }
    else
    {
      details = '(Time Off)'
      client = ''
      bookingNote = booking.note.exists() ? booking.note.body : ''
    }

    return scheduledFor + space + details + lineBreak + client + bookingNote
  }

  private _createEventFromSelection(segment: WeekViewHourSegment): any
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
    // segment start time in seconds since start of day
    const segmentStartTime = (segment.displayDate.getHours() * 3600) + (segment.displayDate.getMinutes() * 60);
    // employee start time in seconds since start of day
    const employeeStartTime = this.employee.base_schedule?.get( toEnglishDay(segment.date) ).startInSeconds();
    // employee end time in seconds since start of day
    const employeeEndTime = this.employee.base_schedule?.get( toEnglishDay(segment.date) ).endInSeconds();

    return (segmentStartTime >= employeeStartTime) && (segmentStartTime < employeeEndTime);
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
