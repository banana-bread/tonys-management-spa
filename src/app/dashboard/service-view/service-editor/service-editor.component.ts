import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SnackbarNotificationService } from '@tonys/shared';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
@Component({
  selector: 'app-service-editor',
  templateUrl: './service-editor.component.html',
  styleUrls: ['./service-editor.component.scss']
})
export class ServiceEditorComponent implements OnInit {

  loading = false;
  saving = false;
  
  original = new ServiceDefinition();
  service = new ServiceDefinition();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceDefinitionService: ServiceDefinitionService,
    private notifications: SnackbarNotificationService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loadService();
  }

  private async loadService()
  {
    this.loading = true;

    const id = this.route.snapshot.paramMap.get('id')

    if (id !== 'new')
    {
      try
      {  
        this.original = await this.serviceDefinitionService.get(id);
  
        this.service = this.original.copy();
      }
      catch
      { 
        this.router.navigate(['dashboard/services']);
        this.notifications.error('Trouble loading service.')
      }
      finally
      {
        this.loading = false;
      }
    }

    this.loading = false;
  }
}
