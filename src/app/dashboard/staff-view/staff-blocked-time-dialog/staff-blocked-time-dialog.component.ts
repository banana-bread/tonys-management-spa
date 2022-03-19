import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as moment from 'moment';

@Component({
  selector: 'app-staff-blocked-time',
  templateUrl: './staff-blocked-time-dialog.component.html',
})
export class StaffBlockedTimeDialogComponent implements OnInit {
    startDate;
    endDate;
    startTime;
    endTime;
    isAllDay = false;
    doesRepeat = false;

  constructor(public dialogRef: MatDialogRef<StaffBlockedTimeDialogComponent>) { }

  ngOnInit(): void {}

  get times()
  {
    const times = [];

    for (let i = 0; i < 48; i++)
    {
      times.push( moment().startOf('day').add(30 * i, 'minutes').format('HH:mm') )
    }

    return times;
  }

  getFormattedTime(time: string): string
  {
    const hourMinuteArray = time.split(':');
    const hours = hourMinuteArray[0];
    const minutes = hourMinuteArray[1];

    return moment().startOf('day').add(hours, 'hours').add(minutes, 'minutes').format('LT')
  }
}

@Injectable({
    providedIn: 'root'
})
export class StaffBlockedTimeDialogService {

    constructor(protected dialog: MatDialog) {}

    async open(): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: true,
          }

        return this.dialog.open(StaffBlockedTimeDialogComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}
