import { Injectable, ModuleWithComponentFactories } from '@angular/core';
import { HttpAdapter } from '@tonys/shared';
import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { Employee } from '../models/employee/employee.model';
import { ServiceDefinition } from '../models/service-definition/service-definition.model';
import { AppStateService } from './app-state.service';
import { LoginData } from './interfaces/login-data.interface';
import { RegisterData } from './interfaces/register-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpAdapter,
    private state: AppStateService,
  ) { }

  getCompany(id: string): Promise<any>
  {
    return this.http  
      .path('/locations/{id}')
      .param('id', id)
      .get();
  }

  updateCompany(data): Promise<any>
  {
    return this.http
      .path('/company')
      .data(data)
      .withCompany(this.state.company_id)
      .put();
  }

  updateCompanyEmployees(data): Promise<any>
  {
    return this.http
      .path('/company/employees')
      .data(data)
      .withCompany(this.state.company_id)
      .patch();
  }

  updateCompanyServiceDefinitions(data): Promise<any>
  {
    return this.http
      .path('/company/service-definitions')
      .data(data)
      .withCompany(this.state.company_id)
      .patch();
  }

  getEmployee(id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}')
      .param('id', id)
      .withCompany(this.state.company_id)
      .get();
  }

  getEmployees(): Promise<any>
  {
    return this.http
      .path('/company/employees')
      .withCompany(this.state.company_id)
      .get();
  }

  getAuthedEmployee(): Promise<any>
  {
    return this.http
      .path('/employee/authed')
      .get();
  }

  getEmployeeBookings(dateFor: string): Promise<any>
  {
    return this.http
      .path('/bookings')
      .query('is_working', 'true')
      .query('has_bookings', 'true')
      .query('date_for', dateFor)
      // .query('employee_ids', employee_ids)
      .withCompany(this.state.company_id)
      .get();
  }

  createEmployeeBooking(data: {event: CalendarEvent<any>, services: ServiceDefinition[]}, employee_id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/bookings/')
      .param('id', employee_id) 
      .data(data)
      .withCompany(this.state.company_id)
      .post();
  }

  createEmployee(companyId: string, expires: string, signature: string, data: any): Promise<any>
  {
    return this.http
      .path('/locations/{companyId}/employees')
      .param('companyId', companyId)
      .query('expires', expires)
      .query('signature', signature)
      .data(data)
      .post();
  }

  inviteEmployees(data: any): Promise<any>
  {
    return this.http  
      .path('/employees/invitation')
      .data(data)
      .withCompany(this.state.company_id)
      .post();
  }

  updateEmployeeProfile(data: Employee, id: string)
  {
    return this.http
      .path('/employees/{id}')
      .param('id', id)
      .data(data)
      .withCompany(this.state.company_id)
      .put();
  }

  updateEmployeeActive(id: string, data: {bookings_enabled: boolean}): Promise<any>
  {
    return this.http
      .path('/employees/{id}/active')
      .param('id', id)
      .data(data)
      .withCompany(this.state.company_id)
      .put();
  }

  deleteEmployee(id: string)
  {
    return this.http
      .path('/employees/{id}')
      .param('id', id)
      .withCompany(this.state.company_id)
      .delete();
  }

  getBooking(id: string)
  {
    return this.http  
      .path('/bookings/{id}')
      .param('id', id)
      .withCompany(this.state.company_id)
      .get();
  }

  cancelBooking(id: string)
  {
    return this.http
      .path('/bookings/{id}')
      .param('id', id)
      .withCompany(this.state.company_id)
      .delete();
  }

  getServiceDefinitions(): Promise<any> 
  {
    return this.http
      .path('/service-definitions')
      .withCompany(this.state.company_id)
      .get();
  }

  getServiceDefinition(id: string): Promise<any> 
  {
    return this.http
      .path('/service-definitions/{id}')
      .param('id', id)
      .withCompany(this.state.company_id)
      .get();
  }

  createServiceDefinition(service: ServiceDefinition): Promise<any>
  {
    return this.http
      .path('/service-definitions')
      .data(service)
      .withCompany(this.state.company_id)
      .post();
  }

  updateServiceDefinition(data: ServiceDefinition, id: string): Promise<any>
  {
    return this.http
      .path('/service-definitions/{id}')
      .data(data)
      .param('id', id)
      .withCompany(this.state.company_id)
      .put();
  }

  deleteServiceDefinition(data: ServiceDefinition): Promise<any>
  {
    return this.http  
      .path('/service-definitions/{id}')
      .param('id', data.id)
      .withCompany(this.state.company_id)
      .delete();
  }

  updateEmployeeBaseSchedule(data: any, id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/base-schedule')
      .data(data)
      .param('id', id)
      .withCompany(this.state.company_id)
      .put();
  }

  createEmployeeAdmin(id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/admin')
      .param('id', id)
      .withCompany(this.state.company_id)
      .post();
  }

  deleteEmployeeAdmin(id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/admin')
      .param('id', id)
      .withCompany(this.state.company_id)
      .delete();
  }

  createEmployeeOwner(id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/owner')
      .param('id', id)
      .withCompany(this.state.company_id)
      .post();
  }

  deleteEmployeeOwner(id: string): Promise<any>
  {
    return this.http
      .path('/employees/{id}/owner')
      .param('id', id)
      .withCompany(this.state.company_id)
      .delete();
  }

  login(data: LoginData): Promise<any>
  {
    return this.http
      .path('/employee/login')
      .data(data)
      .post();
  }

  register(data: RegisterData): Promise<any>
  {
    return this.http
      .path('/locations')
      .data(data)
      .post();
  }

  logout(): Promise<any>
  {
    return this.http
      .path('/logout')
      .delete();
  }

  refreshToken(data: { refresh_token: string }): Promise<any>
  {
    return this.http
      .path('/refresh-token')
      .data(data)
      .post();
  }
}