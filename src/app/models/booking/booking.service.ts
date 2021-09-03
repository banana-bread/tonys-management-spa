import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  constructor(private api: ApiService) {}

  async get(id: string): Promise<Booking>
  {
    const response = await this.api.getBooking(id);
    return new Booking(response.data.booking);
  }

  async cancel(id: string): Promise<void>
  {
    await this.api.cancelBooking(id);
  }

//   async create(companyId: string, expires: string, signature: string, data: any): Promise<Employee>
//   {
//     const response = await this.api.createEmployee(companyId, expires, signature, data);

//     return new Booking(response.data.employee);
//   }
}
