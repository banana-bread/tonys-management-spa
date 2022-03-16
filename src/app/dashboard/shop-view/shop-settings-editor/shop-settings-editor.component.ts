import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys-barbers/shared';
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
  @ViewChild('settingsForm') settingsForm: NgForm;

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

  async onSaveProfile(): Promise<void> 
  {
    if (this.profileForm.invalid)
    {
      this.notifications.error('Please resolve existing errors')
      return;
    }

    this.saving = true;
    try
    {
      await this.companyService.updateProfile(this.company);
      this.notifications.success('Shop profile updated');
      this.profileForm.form.markAsPristine();
    }
    catch(e)
    {
      this.notifications.error(e.error.message)
    }
    finally
    {
      this.saving = false;
    }
  }

  async onSaveSettings(): Promise<void>
  {
    const payload = this.company.employees.map(
      employee => ({
        id: employee.id,
        bookings_enabled: this.company.bookings_enabled
      })
    )

    this.saving = true;
    try 
    {
      await this.companyService.updateEmployees(payload)
      this.notifications.success('Shop settings updated');
      this.settingsForm.form.markAsPristine();
    }
    catch (e)
    {
      this.notifications.error(e.error.message)
    }
    finally
    {
      this.saving = false;
    }
  }

  hasSettingsUpdates(): boolean
  {
    return !this.settingsForm?.pristine;
  }

  hasProfileUpdates(): boolean
  {
    return !this.profileForm?.pristine;
  }

  hasUpdates(): boolean
  {
    return this.hasSettingsUpdates() || this.hasProfileUpdates();
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
