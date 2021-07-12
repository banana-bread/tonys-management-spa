import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseSchedule, BaseScheduleDay } from '../helpers/base-schedule.helper';

@Component({
  selector: 'app-base-schedule-editor',
  templateUrl: './base-schedule-editor.component.html',
})
export class BaseScheduleEditorComponent implements OnInit {

  @Input() schedule: BaseSchedule;
  @Input() scheduleParent: BaseSchedule;
  @Output() change = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void 
  {
    if (! this.scheduleParent)
    {
      this.scheduleParent = this.schedule;
    }    
  }

  onChanged()
  {
    console.log(this.schedule)
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

}
