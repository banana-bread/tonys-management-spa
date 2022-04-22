import { AfterViewInit, Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { NgModel } from "@angular/forms";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatFormField } from "@angular/material/form-field";
import { SnackbarNotificationService } from "@tonys-barbers/shared";
import { ApiService } from "../services/api.service";


@Component({
    selector: 'app-forgot-password-dialog',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

    @ViewChild('emailField') emailField: NgModel;
    @ViewChild(MatFormField) formField: MatFormField;

    email: string;
    sending = false;
    
    constructor(
      public dialogRef: MatDialogRef<ForgotPasswordComponent>,
      private api: ApiService,
      private notification: SnackbarNotificationService,
      
    ) { }
  
    ngOnInit(): void {}

    ngAfterViewInit() 
    {
        // Hack: form field label out of alignment when 
        // inside mat-dialog with a prefix icon, and focused
        // https://github.com/angular/components/issues/15027
        setTimeout(() => this.formField.updateOutlineGap(), 100);
    }

    async onSend(): Promise<void>
    {
        if (this.emailField.invalid) return;

        this.sending = true;

        try
        {
            await this.api.sendForgotPasswordLink({ email: this.email });
            this.notification.success('Password reset link sent!')
        }
        catch (e)
        {
            this.notification.error('Error sending password reset link')
        }
        finally
        {
            this.sending = false;
        }

        this.dialogRef.close();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {

    constructor(protected dialog: MatDialog) {}

    async open(data?: any): Promise<boolean> 
    {
        const dialogConfig: MatDialogConfig = {
            disableClose: true,
            hasBackdrop: true,
            autoFocus: false,
            data
          }

        return this.dialog.open(ForgotPasswordComponent, dialogConfig)
            .afterClosed()
            .toPromise();
    }
}
