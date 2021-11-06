import { BaseModel } from "../base.model";

export class Client extends BaseModel {
    
    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    relations = {};
    dates = {}

    id?: string = null;
    first_name?: string = null;
    last_name?: string = null;
    email?: string = null;

    get full_name(): string
    {
        return `${this.first_name} ${this.last_name}`;
    }
}