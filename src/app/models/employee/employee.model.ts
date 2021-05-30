import { BaseModel } from "../base.model";

export class Employee extends BaseModel {

    id?: string = '';
    company_id?: string = '';
    name?: string = '';
    email?: string = '';
    admin?: boolean = false;
    owner?: boolean = false;
    settings?: any = null;

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
    
    get initials(): string
    {
        return this.name[0].toUpperCase();
    }

    get type(): string
    {
        if (this.owner) return 'Owner'
        if (this.admin) return 'Admin'

        return 'Employee'
    }
}
