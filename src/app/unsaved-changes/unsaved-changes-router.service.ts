import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UnsavedChangesDialogService } from './unsaved-changes-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesRouterService {

  private _guard: () => boolean;

  constructor(
    private router: Router,
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

    this.router.navigate([route]);
  }
}
