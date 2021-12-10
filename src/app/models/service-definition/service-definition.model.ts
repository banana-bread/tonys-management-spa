import { BaseModel } from "../base.model";

export class ServiceDefinition extends BaseModel {

    id?: string = '';
    name?: string = '';
    price?: number = 0;
    duration?: number = 0;
    ordinal_position?: number = 0;

    employee_ids?: string[] = [];

    relations = {};
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
