import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @ViewChild('editorForm') editorForm: NgForm;

  loading = false;
  saving = false;
  
  original = new ServiceDefinition();
  service = new ServiceDefinition();
  durationOptions: number[] = this.generateDurationOptions();

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

  async onSave()
  {
    if (this.editorForm.invalid) return;
    
    try
    {
      this.saving = true;
      await this.serviceDefinitionService.save(this.service);
      this.notifications.success('Service saved')
    }
    catch
    {
      this.notifications.error('Service could not be saved')
    }
    finally
    {
      this.router.navigate(['dashboard/services']);
      this.saving = false;
    }
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

  private generateDurationOptions(): number[]
  {
    const fiveMins = 300;
    const twoHours = 7200;
    const result: number[] = [];

    for(let i = fiveMins; i < twoHours; i += fiveMins)
    {
      result.push(i);
    }

    return result;
  }
}
