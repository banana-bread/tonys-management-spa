import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseScheduleErrorState } from '../helpers/base-schedule-error-state.matcher';
import { BaseSchedule, BaseScheduleDay } from '../helpers/base-schedule.helper';

@Component({
  selector: 'app-base-schedule-editor',
  templateUrl: './base-schedule-editor.component.html',
})
export class BaseScheduleEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('scheduleForm') scheduleForm: NgForm;

  @Input() schedule: BaseSchedule;
  @Input() scheduleParent: BaseSchedule;
  @Output() change = new EventEmitter<void>();
  @Output() errorChange = new EventEmitter<boolean>();

  errorStateMatcher = new BaseScheduleErrorState();

  constructor() { }

  ngOnInit(): void 
  {
    if (! this.scheduleParent)
    {
      this.scheduleParent = this.schedule;
    }    
  }

  ngAfterViewInit()
  {
    this.scheduleForm.statusChanges.subscribe(
      result => this.errorChange.emit(this._hasError(result))
    );
  }

  onChanged()
  {
    this.change.emit();
  }

  isSelectDisabled(day: BaseScheduleDay): boolean
  {
    return !day.active || !this.scheduleParent.get(day.day).active;
  }

  isToggleDisabled(day: BaseScheduleDay): boolean
  {
    return !this.scheduleParent.get(day.day).active;
  }

  private _hasError(status: string): boolean
  { 
    return status === 'INVALID';
  }

}
