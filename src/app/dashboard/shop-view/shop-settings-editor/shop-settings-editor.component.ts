import { P } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
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
      this.company = await this.companyService.get(this.state.short_company_id);
    }
    catch
    {
      this.notifications.error('Error loading shop settings');
      this.router.navigate([`/${this.state.short_company_id}`]);
    }
    finally
    {
      this.loading = false;
    }
  }

  async onSave(): Promise<void>
  {
    // if (this.baseScheduleInvalid)
    // {
    //   this.notifications.error('Please resolve existing errors')
    //   return;
    // }

    this.saving = true;

    try
    {

    }
    catch
    {

    }
    finally
    {

    }
  }

  onClose()
  {
    this.unsavedChangesRouter.tryNavigate(`/${this.state.short_company_id}`, () => true);
  }

}
