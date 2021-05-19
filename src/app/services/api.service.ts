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

  // TODO: don't love this.
  subscription: Subscription = this.appState.company.subscribe(c => this.company_id = c.id);
  company_id: string;

  constructor(
    private http: HttpAdapter,
    private appState: AppStateService,
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
      .withCompany(this.company_id)
      .get();
  }

  getServiceDefinitions(): Promise<any> 
  {
    return this.http
      .path('/service-definitions')
      .withCompany(this.company_id)
      .get();
  }

  getServiceDefinition(id: string): Promise<any> 
  {
    return this.http
      .path('/service-definitions/{id}')
      .param('id', id)
      .withCompany(this.company_id)
      .get();
  }

  createServiceDefinition(service: ServiceDefinition): Promise<any>
  {
    return this.http
      .path('/service-definitions')
      .data(service)
      .withCompany(this.company_id)
      .post();
  }

  updateServiceDefinition(data: ServiceDefinition, id: string): Promise<any>
  {
    return this.http
      .path('/service-definitions/{id}')
      .data(data)
      .param('id', id)
      .withCompany(this.company_id)
      .put();
  }

  login(data: LoginData): Promise<any>
  {
    return this.http
      .path('/login')
      .data(data)
      .post();
  }

  register(data: RegisterData)
  {
    return this.http
      .path('/locations')
      .data(data)
      .post();
  }
}