import { Moment } from "src/types";
import { BaseModel } from "../base.model";
import { Schedulable } from "../contracts/schedulable.interface";
import { Employee } from "../employee/employee.model";
import * as moment from 'moment';

export class Company extends BaseModel implements Schedulable {

    id?: string = null;
    name?: string = null;
    city?: string = null;
    region? = null;
    postal_code?: string = null;
    address?: string = null;
    country?: string = null;
    phone?: string = null;
    time_slot_duration?: number = null;
    booking_grace_period?: number = null;
    settings?: any = null;
    base_schedule?: any = null;

    employees: Employee[] = [];

    // owner: Employee = null;

    relations = {
        employees: Employee,
        // owner: Employee,
    };

    dates = {};

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    get bookings_enabled(): boolean
    {
        return this.employees.some(
            employee => employee.bookings_enabled
        );
    }

    set bookings_enabled(val: boolean)
    {
        this.employees.forEach(
            employee => employee.bookings_enabled = val
        );
    }

    getEmployeesWorking(date: Moment)
    {
        return this.employees.filter(employee => employee.isWorking(date))
    }

    getEmployeesWorkingToday()
    {
        return this.getEmployeesWorking( moment().startOf('day') );
    }
}
