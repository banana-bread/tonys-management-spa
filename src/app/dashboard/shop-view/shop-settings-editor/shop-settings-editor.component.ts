import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { Company } from 'src/app/models/company/company.model';
import { CompanyService } from 'src/app/models/company/company.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { UnsavedChangesRouterService } from 'src/app/unsaved-changes/unsaved-changes-router.service';

@Component({
  selector: 'app-shop-settings-editor',
  templateUrl: './shop-settings-editor.component.html',
  styleUrls: ['./shop-settings-editor.component.scss']
})
export class ShopSettingsEditorComponent implements OnInit {

  @ViewChild('profileForm') profileForm: NgForm;

  loading = false;
  saving = false;

  company: Company;
  updates = new Map();

  constructor(
    private unsavedChangesRouter: UnsavedChangesRouterService,
    private router: Router,
    private state: AppStateService,
    private companyService: CompanyService,
    private notifications: SnackbarNotificationService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    this.loading = true;

    try
    {
      this.company = await this.companyService.get(this.state.company_id);
    }
    catch
    {
      this.notifications.error('Error loading shop settings');
      this.router.navigate([`/${this.state.company_id}`]);
    }
    finally
    {
      this.loading = false;
    }
  }

  onProfileChanged()
  {
    this.updates.set('profile_update', () => this.companyService.updateProfile(this.company))
  }

  onActiveChanged()
  {
    this.updates.set('settings_update', () => this.companyService.updateEmployees(this.company))
  }

  hasUpdates(): boolean
  {
    return !!this.updates.size;
  }

  async onSave(): Promise<void>
  {
    if (this.profileForm.invalid)
    {
      this.notifications.error('Please resolve existing errors')
      return;
    }

    this.saving = true;

    try
    {
      await Promise.all([...this.updates.values()].map(callback => callback()))

      this.router.navigate([`/${this.state.company_id}/calendar`]);

      this.notifications.success('Shop settings updated');
    }
    catch
    {
      this.notifications.error('Error updating shop settings');
    }
    finally
    {
      this.saving = false;
    }
  }

  onClose()
  {
    this.unsavedChangesRouter.tryNavigate(`/${this.state.company_id}/calendar`, () => !this.hasUpdates());
  }

}
