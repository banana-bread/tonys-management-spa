import { BaseModel } from "../base.model";

export class ServiceDefinition extends BaseModel {

    id?: string = '';
    name?: string = '';
    price?: number = 0;
    duration?: number = 0;

    relations = {};
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    get short_id(): string
    {
        return this.id.slice(0, 8);
    }
}
