import { BaseModel } from "../base.model";

export class Service extends BaseModel {

    id?: string = null;
    booking_id?: string = null;
    service_definition_id?: string = null;
    duration?: number = 0;
    name?: string = null;

    relations = {};
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
