import { BaseModel } from "../base.model";

export class ServiceDefinition extends BaseModel {

    id?: string = '';
    name?: string = '';
    price?: number = 0;
    duration?: number = 0;
    selected?: boolean = false;

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
