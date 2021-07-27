import { Moment } from "src/types";
import { BaseModel } from "../base.model";
import { Employee } from "../employee/employee.model";

export class Booking extends BaseModel {

    id?: string = null;
    employee_id?: string = null;
    client_id?: string = null;
    started_at?: Moment = null;
    ended_at?: Moment = null;
    cancelled_at?: number = null;

    // TODO: type = Employee|Client
    cancelled_by? = null;

    relations = {};
    
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
