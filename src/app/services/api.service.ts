import { Injectable } from '@angular/core';
import { HttpAdapter } from '@tonys/shared';

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
}