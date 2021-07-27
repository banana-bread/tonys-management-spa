import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Employee } from 'src/app/models/employee/employee.model';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import * as moment from 'moment'
import { Moment } from 'src/types';
import { secondsFromStartOfDay } from 'src/app/helpers/moment.helper';

type DialogData = {employee: Employee, event: CalendarEvent<any>};

// TODO: maybe add this to the moment prototype


@Component({
  selector: 'app-manual-booking-dialog',
  templateUrl: './manual-booking-dialog.component.html',
  styleUrls: ['./manual-booking-dialog.component.scss']
})
export class ManualBookingDialogComponent implements OnInit {

  employee: Employee = this.data.employee;
  event: CalendarEvent<any> = this.data.event;
  services: ServiceDefinition[] = [];
  startTime: number = secondsFromStartOfDay(moment(this.event.start));

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: DialogData,
    public dialogRef: MatDialogRef<ManualBookingDialogComponent>,
    private serviceDefService: ServiceDefinitionService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.services = await this.serviceDefService.getAll()
  }

  times(): number[]
  {
    const result: number[] = [];
    const dayStart = this.employee.base_schedule.startOfToday();
    const dayEnd = this.employee.base_schedule.endOfToday()

    // TODO: hardcoded to increase start time by 30 minutes from start - end.
    for (let i = dayStart; i < dayEnd; i += 1800)
    {
      const overlappingBookingExists: boolean = 
        !!this.employee.bookings.find(booking => secondsFromStartOfDay(booking.started_at) == i)

          if (! overlappingBookingExists)
          {
            result.push(i);
          }
    }

    return result;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ManualBookingDialogService {

  constructor(private dialog: MatDialog) {}

  async open(data: DialogData): Promise<any>
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