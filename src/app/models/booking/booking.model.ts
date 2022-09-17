import { NotExpr } from "@angular/compiler";
import { BaseModel } from "../base.model";
import { Client } from "../client/client.model";
import { Note } from "../note/note.model";
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
    manual_client_name?: string = null;
    started_at?: Date = null;
    ended_at?: Date = null;
    cancelled_at?: Date = null;

    // TODO: type = Employee|Client
    cancelled_by? = null;
    services: Service[] = [];
    client: Client = new Client();
    note: Note = null;

    relations = {
        services: Service,
        bookings: Booking,
        client: Client,
        note: Note,
    };
    
    dates = {
        started_at: null,
        ended_at: null,
    }
}
