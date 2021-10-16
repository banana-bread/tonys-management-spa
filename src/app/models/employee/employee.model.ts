import * as moment from "moment";
import { BaseScheduleDay } from "src/app/helpers/base-schedule.helper";
import { Moment } from "src/types";
import { BaseModel } from "../base.model";
import { Booking } from "../booking/booking.model";
import { Company } from "../company/company.model";
import { Schedulable } from "../contracts/schedulable.interface";
export class Employee extends BaseModel implements Schedulable {

    id?: string = null;
    company_id?: string = null;
    first_name?: string = null;
    last_name?: string = null;
    email?: string = null;
    phone?: string = null;
    admin?: boolean = false;
    owner?: boolean = false;
    bookings_enabled?: boolean = false;
    settings?: any = null;
    base_schedule?: any = null;

    company: Company = null;
    bookings: Booking[] = [];

    relations = {
        company: Company,
        bookings: Booking,
    };
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    get full_name(): string
    {
        return `${this.first_name} ${this.last_name}`;
    }

    get active(): boolean
    {
        return this.bookings_enabled;
    }  

    set active(isActive: boolean)
    {
        this.bookings_enabled = isActive;
    }   

    get initials(): string
    {
        return `${this.first_name[0]?.toUpperCase()}${this.last_name[0]?.toUpperCase()}`;
    }

    get type(): string
    {
        if (this.owner) return 'Owner'
        if (this.admin) return 'Admin'

        return 'Employee'
    }

    // isWorkingNow(): boolean
    // {
    //     const today: BaseScheduleDay = this.base_schedule.today();
    //     // now in seconds
    //     const now: number = moment().diff(moment().startOf('day'), 'seconds');

    //     return (now >= today.start && now <= today.end) && this.bookings_enabled;
    // }

    // isWorkingToday(): boolean
    // {
    //     return this.base_schedule.today().active && this.bookings_enabled; 
    // }

    isWorking(date: Moment)
    {
        return this.base_schedule.get( date.format('dddd').toLowerCase() ).active && this.bookings_enabled;
    }

    isWorkingToday()
    {
        return this.isWorking( moment().startOf('day') );
    }

    isAdmin(): boolean
    {
        return this.admin;
    }

    isOwner(): boolean
    {
        return this.owner;
    }
}
