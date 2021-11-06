import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'appTimeOfDay',
})
export class AppTimeOfDayPipe implements PipeTransform {

    constructor() {}

    transform(value: number, date: Date = new Date()): string 
    {
        return moment(date).startOf('day').add(value, 'seconds').format('h:mma');
    }
}