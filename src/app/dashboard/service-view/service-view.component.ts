import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { ServiceEditorService } from './service-editor/service-editor.service';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss'],
})
export class ServiceViewComponent implements OnInit {

  loading = false;

  services: ServiceDefinition[];

  constructor(
    private serviceDefinitionService: ServiceDefinitionService,
    private serviceEditorService: ServiceEditorService,
    private router: Router,
    private route: ActivatedRoute,
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

  onEdit(service: ServiceDefinition)
  {
    this.serviceEditorService.service = service;
    this.router.navigate([service.id], {relativeTo: this.route});
  }

  onNew()
  {
    this.serviceEditorService.service = null;
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
