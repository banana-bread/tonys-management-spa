import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogData } from "./confirm-dialog-data.interface";
import { ConfirmDialogComponent } from "./confirm-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {

    constructor(protected dialog: MatDialog) {}

    async open(data?: ConfirmDialogData): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: true,
            data
          }

        return this.dialog.open(ConfirmDialogComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}
