import { Injectable } from "@angular/core";
import { CalendarEvent } from "calendar-utils";
import { ApiService } from "../services/api.service";
import { Booking } from "./booking/booking.model";
import { ServiceDefinition } from "./service-definition/service-definition.model";

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

    async create(event: CalendarEvent<any>, services: ServiceDefinition[], employee_id: string): Promise<Booking>
    {
        const response = await this.api.createEmployeeBooking({event, services}, employee_id);

        return new Booking(response.data.booking);
    }
}
