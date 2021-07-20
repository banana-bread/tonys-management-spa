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

    employees: Employee[] = null;

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
}
