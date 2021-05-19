export interface RegisterData {
    name: string,                                  
    address: string,                                 
    phone: string,                                      
    user: {
        name: string,
        email: string,
        password: string,
        phone: string,
    },
    settings: {
        base_schedule: {
            monday: {
                start: number,
                end: number,
            },
            tuesday: {
                start: number,
                end: number,
            },
            wednesday: {
                start: number,
                end: number,
            },
            thursday: {
                start: number,
                end: number,
            },
            friday: {
                start: number,
                end: number,
            },
            saturday: {
                start: number,
                end: number,
            },
            sunday: {
                start: number,
                end: number,
            },
        }
    },
}
