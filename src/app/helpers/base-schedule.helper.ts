export type RawBaseSchedule = {[key: string]: {start: number, end: number}};

export class BaseSchedule {

    private _days: BaseScheduleDay[];
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

    /**
     * parses current base schedule into api payload format
     * 
     */
    parse(): RawBaseSchedule
    {       
        const result = {};

        this._days.forEach((day: BaseScheduleDay) => {
            result[day.day] = {start: day.start, end: day.end}
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
