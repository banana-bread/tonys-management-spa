import { Moment } from "src/types";
import { BaseModel } from "../base.model";
import { Schedulable } from "../contracts/schedulable.interface";
import { Employee } from "../employee/employee.model";
import * as moment from 'moment';

export class Company extends BaseModel implements Schedulable {

    id? = '';
    name? = '';
    address? = '';
    phone? = '';
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

    // get employees_working_now(): Employee[]
    // {
    //     return this.employees.filter(employee => employee.isWorkingNow());
    // }

    // get employees_working_today(): Employee[]
    // {
    //     return this.employees.filter(employee => employee.isWorkingToday());
    // }

    getEmployeesWorking(date: Moment)
    {
        return this.employees.filter(employee => employee.isWorking(date))
    }

    getEmployeesWorkingToday()
    {
        return this.getEmployeesWorking( moment().startOf('day') );
    }
}
