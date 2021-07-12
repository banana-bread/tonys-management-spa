import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'appTimeOfDay',
})
export class AppTimeOfDayPipe implements PipeTransform {

    constructor() {}

    transform(value: number): string 
    {
        return moment().startOf('day').add(value, 'seconds').format('h:mma');
    }
}