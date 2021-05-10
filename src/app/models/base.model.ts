import { cloneDeep } from 'lodash';
export abstract class BaseModel {
    
    map(data: any) 
    {
        Object.keys(this).forEach(key => {
            this[key] = data[key];
        });
    }

    copy(): this
    {
        return cloneDeep(this);
    }
}
