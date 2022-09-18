import { BaseModel } from "../base.model";

export class Note extends BaseModel {

    id?: string = null;
    noteable_id?: string = null;
    noteable_type?: string = null;
    body?: string = null;

    relations = {};
    dates = {}

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }
}
