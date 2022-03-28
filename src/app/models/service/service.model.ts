import { BaseModel } from "../base.model";

export class Service extends BaseModel {

    id?: string = null;
    booking_id?: string = null;
    name?: string = null;
    description?: string = null;
    service_definition_id?: string = null;
    duration?: number = 0;

    relations = {};
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
