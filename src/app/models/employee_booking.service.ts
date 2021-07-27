import { Injectable } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Booking } from "./booking/booking.model";

@Injectable({
    providedIn: 'root'
})
export class EmployeeBookingService {

    constructor(private api: ApiService) {}

    async get(employee_ids: string[], dateFor: string): Promise<any>
    {
        const response = await this.api.getEmployeeBookings(employee_ids, dateFor);

        return response.data.bookings.map((booking: any) => new Booking(booking));
    }
}
