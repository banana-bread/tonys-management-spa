import * as moment from "moment";

const NullRawBaseSchedule: RawBaseSchedule = {monday:{start:null,end:null},tuesday:{start:null,end:null},wednesday:{start:null,end:null},thursday:{start:null,end:null},friday:{start:null,end:null},saturday:{start:null,end:null},sunday:{start:null,end:null},} 
export type RawBaseSchedule = {[key: string]: {start: number|null, end: number|null}};

export class BaseSchedule {

    private _days: BaseScheduleDay[] = [];
    private readonly _weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    constructor(schedule: RawBaseSchedule) 
    {
        this._days = this._weekdays
            .map(day =>  new BaseScheduleDay(schedule[day].start, schedule[day].end, day));
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
                result[day.day] = {start: day.start, end: day.end}
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
    public start: number; 
    public end: number;
    public active: boolean;

    private _times: any[] = [];

    constructor(start: number, end: number, day: string)
    {
        this.day = day;
        this.start = start;
        this.end = end;
        this.active = !!this.start && !!this.end;

        if (! this.active) return

        // TODO: hardcoded to increase start time by 30 minutes from start - end.
        for(let i = this.start; i <= this.end; i +=  1800)
        {
            this._times.push(i)
        }
    }

    get times()
    {
        return this._times;
    }
}
