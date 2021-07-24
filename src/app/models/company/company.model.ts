import { BaseModel } from "../base.model";
import { Schedulable } from "../contracts/schedulable.interface";
import { Employee } from "../employee/employee.model";

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

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    get short_id(): string
    {
        return this.id.slice(0, 7);
    }

    get employees_working_now(): Employee[]
    {
        return this.employees.filter(employee => employee.isWorkingNow());
    }

    get employees_working_today(): Employee[]
    {
        return this.employees.filter(employee => employee.isWorkingToday());
    }
}
