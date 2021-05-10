import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss']
})
export class ServiceViewComponent implements OnInit {

  services: ServiceDefinition[];

  constructor(
    private serviceDefinitionService: ServiceDefinitionService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.services = await this.serviceDefinitionService.getAll();
  }

  onEdit(service: ServiceDefinition)
  {
    // this.router.navigate('')
    this.router.navigate(['/dashboard/services', service.id])
  }

}
