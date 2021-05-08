export abstract class BaseModel {
    
    map(data: any) 
    {
        Object.keys(this).forEach(key => {
            this[key] = data[key];
        });
    }
}
