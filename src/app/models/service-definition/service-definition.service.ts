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

  async get(id: string): Promise<ServiceDefinition>
  {
    const response = await this.api.getServiceDefinition(id);

    return new ServiceDefinition(response.data.service_definition);
  }

  async save(service: ServiceDefinition): Promise<ServiceDefinition>
  {
    const response = !!service.id
      ? await this.api.updateServiceDefinition(service, service.id)
      : await this.api.createServiceDefinition(service);
    
    return new ServiceDefinition(response.data.service_definition);
  }

  async delete(service: ServiceDefinition): Promise<void> 
  {
    await this.api.deleteServiceDefinition(service);
  }
}
