import { BaseModel } from "../base.model";
import { Client } from "../client/client.model";
import { Service } from "../service/service.model";

export class Booking extends BaseModel {

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    id?: string = null;
    employee_id?: string = null;
    client_id?: string = null;
    started_at?: Date = null;
    ended_at?: Date = null;
    cancelled_at?: Date = null;

    // TODO: type = Employee|Client
    cancelled_by? = null;
    services: Service[] = [];
    client: Client = new Client();

    relations = {
        services: Service,
        bookings: Booking,
        client: Client,
    };
    
    dates = {
        started_at: null,
        ended_at: null,
    }
}
