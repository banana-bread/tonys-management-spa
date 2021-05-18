import { BaseModel } from "../base.model";

export class Company extends BaseModel {

    id? = '';
    name? = '';
    address? = '';
    phone? = '';
    time_slot_duration?: number = null;
    booking_grace_period?: number = null;
    settings?: any = null;

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
