import { Moment } from "src/types";
import { BaseModel } from "../base.model";
import { Employee } from "../employee/employee.model";
import { Service } from "../service/service.model";

export class Booking extends BaseModel {

    id?: string = null;
    employee_id?: string = null;
    client_id?: string = null;
    started_at?: Date = null;
    ended_at?: Date = null;
    cancelled_at?: Date = null;

    // TODO: type = Employee|Client
    cancelled_by? = null;
    services: Service[] = [];

    relations = {
        services: Service,
        bookings: Booking,
    };
    
    dates = {
        started_at: null,
        ended_at: null,
    }

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
