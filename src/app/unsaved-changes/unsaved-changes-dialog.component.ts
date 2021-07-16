import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './unsaved-changes-dialog.component.html',
})
export class UnsavedChangesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UnsavedChangesComponent>,
  ) { }

  ngOnInit(): void {}
}

@Injectable({
    providedIn: 'root'
})
export class UnsavedChangesDialogService {

    constructor(protected dialog: MatDialog) {}

    async open(): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: true,
          }

        return this.dialog.open(UnsavedChangesComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}

