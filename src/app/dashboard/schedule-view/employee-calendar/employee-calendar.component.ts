import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { AppStateService } from 'src/app/services/app-state.service';
import { CompanyService } from 'src/app/models/company/company.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { ManualBookingDialogService } from '../manual-booking-dialog/manual-booking-dialog.component';
import { Booking } from 'src/app/models/booking/booking.model';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeCalendarComponent implements OnInit {
  
  @Input() employee: Employee = new Employee();

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

  private _mapBookingsToCalendarEvents(bookings: Booking[])
  {
    this.events = bookings.map(booking => this.createNewEvent(booking.started_at.toDate()))
  }

  createNewEvent(start: Date): CalendarEvent
  {
    return {
      id: this.events.length,
      title: 'New appointment',
      start: start,
      meta: {
        tmpEvent: true,
      },
    }
  }

  async selectToCreate(segment: WeekViewHourSegment, event: MouseEvent, segmentElement: HTMLElement): Promise<void> 
  {
    const newEvent = this.createNewEvent(segment.date); 
    await this.onNewBooking(newEvent);

    this.events = [...this.events, newEvent];
    this.refresh();
  }

  private refresh() 
  {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  async onNewBooking(event: CalendarEvent<any>): Promise<any>
  {
    await this.manualBookingDialog.open({
      employee: this.employee,
      event
    });
    /*
    - [ ] Open dialog, choose start, end, service etc. 
    - [ ] should be able to pass current employee into dialog.
    */
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
