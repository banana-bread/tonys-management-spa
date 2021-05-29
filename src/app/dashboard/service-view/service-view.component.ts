import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss']
})
export class ServiceViewComponent implements OnInit {

  loading = false;

  services: ServiceDefinition[];

  constructor(
    private serviceDefinitionService: ServiceDefinitionService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;
    
    try
    {
      this.services = await this.serviceDefinitionService.getAll();   
    }
    finally
    {
      this.loading = false;
    }
    
  }
}
