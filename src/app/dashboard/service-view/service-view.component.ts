import { Component, OnInit } from '@angular/core';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss']
})
export class ServiceViewComponent implements OnInit {

  services: ServiceDefinition[];

  constructor(private serviceDefinitionService: ServiceDefinitionService) { }

  async ngOnInit(): Promise<void> 
  {
    this.services = await this.serviceDefinitionService.getAll();
  }

}
