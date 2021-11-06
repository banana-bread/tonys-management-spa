import { animate, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { CompanyService } from 'src/app/models/company/company.service';
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
  saving = false;

  services: ServiceDefinition[];

  constructor(
    private serviceDefinitionService: ServiceDefinitionService,
    private serviceEditorService: ServiceEditorService,
    private companyService: CompanyService,
    private notification: SnackbarNotificationService,
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

  async onItemDropped(event): Promise<void>
  {
    moveItemInArray(this.services, event.previousIndex, event.currentIndex);

    // Reset ordinal_position
    this.services.forEach(
      (service, index) => service.ordinal_position = index
    );

    // Create paylod for PATCH update
    const payload = this.services.map(
      service => ({
        id: service.id,
        ordinal_position: service.ordinal_position,
      })
    )

    // Save
    this.saving = true;
    await this.companyService.updateServiceDefinitions(payload);
    this.saving = false;

    this.notification.success('Services order updated')
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
