import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UnsavedChangesDialogService } from './unsaved-changes-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {

  private _guard: () => boolean;

  constructor(
    private router: Router,
    private unsavedChangesDialog: UnsavedChangesDialogService
  ) 
  {
    this._listen();
  }

  setGuard(callback: () => boolean)
  {
    this._guard = callback;
  }
  
  private _listen()
  {
      this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe(async (event: NavigationStart) => {

            if (!! this._guard && this._guard() === true)
            {
              console.log(this.router.events)
              // this.router.
              // console.log(event.url)
              // console.log(event.)
              await this.unsavedChangesDialog.open()
            }
      });
  }
}
