import { Injectable } from '@angular/core';
import { HttpAdapter } from '@tonys/shared';
import { ServiceDefinition } from '../models/service-definition/service-definition.model';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

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

  // TODO: figure out a cleaner better way.
  private get company_id()
  {
    return '7662f5f0-81a2-442d-9e67-facc712e95ff';
  }
}