import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ServiceDefinition } from './service-definition.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceDefinitionService {

  constructor(private api: ApiService) { }

  async getAll(): Promise<ServiceDefinition[]> 
  {
    const response = await this.api.getServiceDefinitions();
    
    return response.data.service_definitions
      .map((service: any) => new ServiceDefinition(service));
  }
}
