import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModel } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SnackbarNotificationService } from "@tonys-barbers/shared";
import { ApiService } from "../services/api.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    
    @ViewChild('passwordField') passwordField: NgModel;

    private email: string;
    private signature: string;
    private expires: string;
    password: string;
    isNotMobile: boolean;
    sending = false;
    
    constructor(
        private route: ActivatedRoute,
        public breakpointObserver: BreakpointObserver,
        private notifications: SnackbarNotificationService,
        private api: ApiService,
    ) {}
    ngOnInit(): void 
    {
        this.email = this.route.snapshot.queryParams['email'];
        
        const signedUrl = this.route.snapshot.queryParams['signed-url'].replace();
        this.signature = signedUrl.match(/signature=([^&]*)/)[1];
        this.expires = signedUrl.match(/expires=([^&]*)/)[1];

        this.breakpointObserver
            .observe([Breakpoints.XSmall])
            .subscribe((state: BreakpointState) => {
                this.isNotMobile = !state.matches;
        });
    }

    async onSubmit()
    {
        if (this.passwordField.invalid) return;

        this.sending = true;

        try
        {
            await this.api.resetPassword({email: this.email, password: this.password}, this.signature, this.expires);
            this.notifications.success('Password reset!')
        }
        catch (e)
        {
            this.notifications.error(e.error.message)
        }
        finally
        {
            this.sending = false;
        }
    }
}
