import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { StaffInvitationDialogComponent } from "./staff-invitation-dialog.component";
// import { ConfirmDialogData } from "./confirm-dialog-data.interface";
// import { ConfirmDialogComponent } from "./confirm-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class StaffInvitationDialogService {

    constructor(protected dialog: MatDialog) {}

    async open(): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: true,
            panelClass: 'staff-invitation-dialog',
          }

        return this.dialog.open(StaffInvitationDialogComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}
