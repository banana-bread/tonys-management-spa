import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as moment from 'moment';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { Employee } from 'src/app/models/employee/employee.model';
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
    employee = this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Employee,
    public dialogRef: MatDialogRef<StaffBlockedTimeDialogComponent>,
    private employeeService: EmployeeService,
  ) { }

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

  async onSubmit(): Promise<any>
  {
    const blockedTimeData = {
      start_date: this.startDate,
      end_date: this.endDate,
      start_time: this.startTime, 
      end_time: this.endTime,
      is_all_day: this.isAllDay, 
    }

    this.employeeService.createBlockedTime(this.employee, blockedTimeData)
  }
}

@Injectable({
    providedIn: 'root'
})
export class StaffBlockedTimeDialogService {

    constructor(protected dialog: MatDialog) {}

    async open(data: Employee): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: true,
            data
          }

        return this.dialog.open(StaffBlockedTimeDialogComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}
