import { BaseModel } from "../base.model";

export class Employee extends BaseModel {

    id?: string = '';
    company_id?: string = '';
    name?: string = '';
    email?: string = '';

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
    
    get initials(): string
    {
        return this.name[0].toUpperCase();
    }
}
