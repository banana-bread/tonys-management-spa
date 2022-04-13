import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UnsavedChangesDialogService } from './unsaved-changes-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesRouterService {

  constructor(
    private router: Router,
    private location: Location,
    private unsavedChangesDialog: UnsavedChangesDialogService
  ) {}

  /**
   * 
   * @param route The absolute path in which to conditionally route to.
   * @param function Navigate to provided route if returns true.
   */
  async tryNavigate(route: string, callback: () => boolean): Promise<void>
  {
    if (callback() == false && !await this.unsavedChangesDialog.open()) return;

    if (route === 'back') 
    {
      this.location.back();
    }

    this.router.navigate([route]);
  }
}
