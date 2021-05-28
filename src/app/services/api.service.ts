import { Injectable } from '@angular/core';
import { HttpAdapter } from '@tonys/shared';
import { Subscription } from 'rxjs';
import { ServiceDefinition } from '../models/service-definition/service-definition.model';
import { AppStateService } from './app-state.service';
import { LoginData } from './interfaces/login-data.interface';
import { RegisterData } from './interfaces/register-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // TODO: this is not working properly.
  //  It does send company id on path after login, but if refreshed does not
  // private company_id: string = this.state.company?.id;
  // subscription: Subscription = this.state.company.subscribe(c => this.company_id = c.id);
  // company_id: string;

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

  getEmployees(): Promise<any>
  {
    return this.http
      .path('/employees')
      .withCompany(this.state.company.id)
      .get();
  }

  getAuthedEmployee(): Promise<any>
  {
    return this.http
      .path('/employee/authed')
      .get();
  }

  getServiceDefinitions(): Promise<any> 
  {
    return this.http
      .path('/service-definitions')
      .withCompany(this.state.company.id)
      .get();
  }

  getServiceDefinition(id: string): Promise<any> 
  {
    return this.http
      .path('/service-definitions/{id}')
      .param('id', id)
      .withCompany(this.state.company.id)
      .get();
  }

  createServiceDefinition(service: ServiceDefinition): Promise<any>
  {
    return this.http
      .path('/service-definitions')
      .data(service)
      .withCompany(this.state.company.id)
      .post();
  }

  updateServiceDefinition(data: ServiceDefinition, id: string): Promise<any>
  {
    return this.http
      .path('/service-definitions/{id}')
      .data(data)
      .param('id', id)
      .withCompany(this.state.company.id)
      .put();
  }

  login(data: LoginData): Promise<any>
  {
    return this.http
      .path('/login')
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
}