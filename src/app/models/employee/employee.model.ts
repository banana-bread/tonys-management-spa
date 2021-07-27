import * as moment from "moment";
import { BaseScheduleDay } from "src/app/helpers/base-schedule.helper";
import { BaseModel } from "../base.model";
import { Booking } from "../booking/booking.model";
import { Company } from "../company/company.model";
import { Schedulable } from "../contracts/schedulable.interface";
export class Employee extends BaseModel implements Schedulable {

    id?: string = '';
    company_id?: string = '';
    name?: string = '';
    email?: string = '';
    phone?: string = '';
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
        return this.name[0].toUpperCase();
    }

    get type(): string
    {
        if (this.owner) return 'Owner'
        if (this.admin) return 'Admin'

        return 'Employee'
    }

    get short_id(): string
    {
        return this.id.slice(0, 8);
    }

    isWorkingNow(): boolean
    {
        const today: BaseScheduleDay = this.base_schedule.today();
        // now in seconds
        const now: number = moment().diff(moment().startOf('day'), 'seconds');

        return now >= today.start && now <= today.end;
    }

    isWorkingToday(): boolean
    {
        return this.base_schedule.today().active; 
    }
}
