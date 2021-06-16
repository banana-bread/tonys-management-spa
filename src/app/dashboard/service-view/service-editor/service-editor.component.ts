import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SnackbarNotificationService } from '@tonys/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { ServiceDefinition } from 'src/app/models/service-definition/service-definition.model';
import { ServiceDefinitionService } from 'src/app/models/service-definition/service-definition.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { ServiceEditorService } from './service-editor.service';
@Component({
  selector: 'app-service-editor',
  templateUrl: './service-editor.component.html',
  styleUrls: ['./service-editor.component.scss'],
  // animations: [
  //   trigger('slideInOut', [
  //     transition(':enter', [
  //       style({transform: 'translateY(100%)'}),
  //       animate('100ms ease-in', style({transform: 'translateY(0%)'}))
  //     ]),
  //     transition(':leave', [
  //       animate('2000ms ease-in', style({transform: 'translateY(100%)'}))
  //     ])
  //   ])
  // ]
})
export class ServiceEditorComponent implements OnInit {

  @ViewChild('editorForm') editorForm: NgForm;

  loading = false;
  saving = false;
  
  original = new ServiceDefinition();
  service = new ServiceDefinition();
  durationOptions: number[] = this.generateDurationOptions();
  serviceId: string = this.route.snapshot.paramMap.get('id');

  constructor(
    private serviceEditorService: ServiceEditorService,
    private route: ActivatedRoute,
    private router: Router,
    private state: AppStateService,
    private serviceDefinitionService: ServiceDefinitionService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    if (this.serviceId === 'new') return;

    if (!! this.serviceEditorService.service)
    {
      this.original = this.serviceEditorService.service;
      this.service = this.original.copy();
    } 
    else
    {
      this.loading = true;

      try
      {  
        this.original = await this.serviceDefinitionService.get(this.serviceId);
        this.service = this.original.copy();
      }
      catch
      { 
        this.onClose();
        this.notifications.error('Error loading service')
      }
      finally
      {
        this.loading = false;
      }
    }
  }

  async onSave()
  {
    if (this.editorForm.invalid) return;
    
    this.saving = true;

    try
    {
      await this.serviceDefinitionService.save(this.service);
      this.notifications.success('Service saved')
    }
    catch
    {
      this.notifications.error('Service could not be saved')
    }
    finally
    {
      this.onClose();
      this.saving = false;
    }
  }

  async onDelete(): Promise<void>
  {
    this.saving = true;

    const shouldDelete: boolean = await this.confirmDialog.open({
      title: 'Confirm service deletion',
      message: 'Are you sure you want to delete this service?',
      okLabel: 'Yes'
    });

    try
    {
      if (shouldDelete)
      {
        await this.serviceDefinitionService.delete(this.service);
        this.onClose();

        this.notifications.success('Service deleted');
      }
    }
    catch
    {
      this.notifications.error('Error deleting service');
    }
    finally
    {
      this.saving = false;
    }
  }

  onClose()
  {
    this.router.navigate([`/${this.state.company_id}/services`]);
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
