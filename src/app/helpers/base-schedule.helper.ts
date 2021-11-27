import * as moment from "moment";
import { toEnglishDay } from "./moment.helper";

export type RawBaseSchedule = {[key: string]: {start: string|null, end: string|null}};

export class BaseSchedule {

    private _days: BaseScheduleDay[] = [];
    private readonly _weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    constructor(schedule: RawBaseSchedule) 
    {
        this._days = this._weekdays.map(
            day =>  new BaseScheduleDay(schedule[day].start, schedule[day].end, day)
        );
    }

    get days(): BaseScheduleDay[]
    {
        return this._days;
    }

    get(day: string): BaseScheduleDay
    {
        return this.days.find(scheduleDay => scheduleDay.day === day);
    }

    today(): BaseScheduleDay
    {
        return this._days.find(day => day.day === moment().format('dddd').toLocaleLowerCase())
    }

    startOf(day: Date): string
    {
        return this.get( toEnglishDay(day) ).start;
    }

    endOf(day: Date): string
    {
        return this.get( toEnglishDay(day) ).end;
    }

    /**
     * parses current base schedule into api payload format
     * 
     */
    parse(): RawBaseSchedule
    {       
        const result = {};

        this._days.forEach((day: BaseScheduleDay) => {
            if (day.active)
            {
                result[day.day] = {start: day.start , end: day.end }
            }
            else
            {
                result[day.day] = {start: null, end: null}
            }
        }) ;

        return result;
    }
}

export class BaseScheduleDay {
    
    public day: string;
    public start: string; 
    public end: string;
    public active: boolean;

    // private _times: any[] = [];

    constructor(start: string, end: string, day: string)
    {
        this.day = day;
        this.start = start;
        this.end = end;
        this.active = !!start && !!end;

        if (! this.active) return

        // TODO: hardcoded to increase start time by 30 minutes from start - end.
        // for(let i = this.start; i <= this.end; i +=  1800)
        // {
        //     this._times.push(i)
        // }
    }

    // startInHours(): number
    // {
    //     return parseInt( this.start.split(':')[0] );
    // }

    startInSeconds(): number|null
    {
        return this.timeInSeconds('start');
    }

    // endInHours(): number
    // {
    //     return parseInt( this.end.split(':')[0] );
    // }

    endInSeconds(): number|null
    {
        return this.timeInSeconds('end');
    }

    private timeInSeconds(time: 'start'|'end'): number|null
    {
        if (! this[time])
        {
            return null;
        }

        // 09:00
        const timeSplit: string[] = this[time].split(':');
        const hourInSeconds = parseInt(timeSplit[0]) * 3600;
        const minuteInSeconds = parseInt(timeSplit[1]) * 60;

        return hourInSeconds + minuteInSeconds;
    }
}
