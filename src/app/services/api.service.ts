import { Injectable } from '@angular/core';
import { HttpAdapter } from '@tonys/shared';
import { ServiceDefinition } from '../models/service-definition/service-definition.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpAdapter) { }

  getEmployees(): Promise<any>
  {
      return this.http
        .path('/employees')
        .get();
  }

  getServiceDefinitions(): Promise<any> 
  {
    return this.http
      .path('/service-definitions')
      .get();
  }

  getServiceDefinition(id: string): Promise<any> 
  {
    return this.http
      .path('/service-definitions/{id}')
      .param('id', id)
      .get();
  }

  createServiceDefinition(service: ServiceDefinition): Promise<any>
  {
    return this.http
      .path('/service-definitions')
      .data(service)
      .post();
  }

  updateServiceDefinition(data: ServiceDefinition, id: string): Promise<any>
  {
    return this.http
      .path('/service-definitions/{id}')
      .data(data)
      .param('id', id)
      .put();
  }
}