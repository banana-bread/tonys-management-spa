import { ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm, NgModel } from '@angular/forms';
import { SyncErrorStateMatcher } from '../helpers/sync-error-state.matcher';
import { BaseSchedule, BaseScheduleDay } from '../helpers/base-schedule.helper';
import * as moment from 'moment';

// TODO: Make sure end time is greater than start time
@Component({
  selector: 'app-base-schedule-editor',
  templateUrl: './base-schedule-editor.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BaseScheduleEditorComponent), multi: true }
  ]
})
export class BaseScheduleEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChildren('startTimes') startTimes: QueryList<NgModel>;
  @ViewChildren('endTimes') endTimes: QueryList<NgModel>;

  @Output() errorChange = new EventEmitter<boolean>();

  errorStateMatcher = new SyncErrorStateMatcher();
  value: BaseSchedule;
  onChange: (schedule: BaseSchedule) => void;
  onTouched: () => void;

  times: string[] = [];

  constructor(private changeDetection: ChangeDetectorRef) { }

  writeValue(obj: BaseSchedule): void 
  {
    // Phantom null val being passed in on init. Messing up error watcher.
    // https://github.com/angular/angular/issues/14988
    this.value = obj;
  }

  registerOnChange(fn: any): void 
  {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void 
  {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void 
  {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void 
  {
    for (let i = 0; i < 48; i++)
    {
      this.times.push( moment().startOf('day').add(30 * i, 'minutes').format('HH:mm') )
    }  
  }

  getFormattedTime(time: string): string
  {
    const hourMinuteArray = time.split(':');
    const hours = hourMinuteArray[0];
    const minutes = hourMinuteArray[1];

    return moment().startOf('day').add(hours, 'hours').add(minutes, 'minutes').format('LT')
  }

  ngAfterViewInit()
  {
    // Phantom null val being passed in on init. Messing up error watcher.
    // https://github.com/angular/angular/issues/14988
    setTimeout(() => {
      this._registerErrorHandling(this.startTimes)
      this._registerErrorHandling(this.endTimes)
    })
  }

  onChanged()
  {
    this.onChange(this.value);
  }

  isSelectDisabled(day: BaseScheduleDay): boolean
  {
    return !day.active
  }

  private _registerErrorHandling(list: QueryList<NgModel>): void
  {
    list.forEach(model => 
      model.statusChanges.subscribe(
        result => this.errorChange.emit(this._hasError(result))));
  }

  private _hasError(status: string): boolean
  { 
    return status === 'INVALID';
  }
}


  // isStartTimeDisabled(time: number = 0, endTime: number = 0): boolean
  // {
  //   return (time === 0 && endTime === 0)
  //     ? false
  //     : time <= endTime;
  // }

  // isEndTimeDisabled(time: number, day: BaseScheduleDay): boolean
  // {
  //   return !!day.start ? time <= day.start : false;
  // }

