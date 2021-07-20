import { BaseModel } from "../base.model";
import { Company } from "../company/company.model";
import { Schedulable } from "../contracts/schedulable.interface";
export class Employee extends BaseModel implements Schedulable {

    id?: string = '';
    company_id?: string = '';
    name?: string = '';
    email?: string = '';
    phone?: string = '';
    admin?: boolean = false;
    owner?: boolean = false;
    bookings_enabled?: boolean = false;
    settings?: any = null;
    base_schedule?: any = null;

    company: Company = null;

    relations = {
        company: Company,
    };

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    get active(): boolean
    {
        return this.bookings_enabled;
    }  

    set active(isActive: boolean)
    {
        this.bookings_enabled = isActive;
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

    get short_id(): string
    {
        return this.id.slice(0, 8);
    }
}
