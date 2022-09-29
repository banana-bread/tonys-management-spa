import { BaseModel } from "../base.model";
import { Client } from "../client/client.model";
import { Employee } from "../employee/employee.model";
import { Note } from "../note/note.model";
import { Service } from "../service/service.model";

export enum BookingType {
  APPOINTMENT = 'appointment',
  TIME_OFF = 'time-off',
}

export class Booking extends BaseModel {

    constructor(data: any = {}) 
    {
        super();
        this.map(data);
    }

    id?: string = null;
    employee_id?: string = null;
    client_id?: string = null;
    type?: string = null
    manual_client_name?: string = null;
    started_at?: Date = null;
    ended_at?: Date = null;
    cancelled_at?: Date = null;

    // TODO: type = Employee|Client
    cancelled_by? = null;
    services: Service[] = [];
    employee = new Employee()
    client = new Client()
    note = new Note()

    relations = {
        employee: Employee,
        client: Client,
        services: Service,
        note: Note,
    };
    
    dates = {
        started_at: null,
        ended_at: null,
    }

    // TODO: this should accept a date object
    static async findByDate(dateFor: string): Promise<Booking[]>
    {
      const response = await this.api.getEmployeeBookings(dateFor);
        
      return response.data.employee_bookings;
    }

    async save(): Promise<Booking>
    {
      // this.strip()
      const response = await Booking.api.createBooking(this)
      return new Booking(response.data.booking)
    }

    isAppointment()
    {
      return this.type === BookingType.APPOINTMENT
    }

    isTimeOff()
    {
      return this.type === BookingType.TIME_OFF
    }
}
