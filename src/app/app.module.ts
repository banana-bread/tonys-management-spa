import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TonysSharedModule } from '@tonys/shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceViewComponent } from './dashboard/service-view/service-view.component';
import { StaffViewComponent } from './dashboard/staff-view/staff-view.component';
import { ShopViewComponent } from './dashboard/shop-view/shop-view.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@tonys/shared';
import { MatDividerModule } from '@angular/material/divider';
import { ServiceEditorComponent } from './dashboard/service-view/service-editor/service-editor.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { CurrencyPipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StaffEditorComponent } from './dashboard/staff-view/staff-editor/staff-editor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StaffInvitationDialogComponent } from './dashboard/staff-view/staff-invitation-dialog/staff-invitation-dialog.component';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppTimeOfDayPipe } from './pipes/time-of-day.pipe';
import { BaseScheduleEditorComponent } from './base-schedule-editor/base-schedule-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ServiceViewComponent,
    StaffViewComponent,
    ShopViewComponent,
    ServiceEditorComponent,
    CurrencyInputDirective,
    LoginComponent,
    ConfirmDialogComponent,
    StaffEditorComponent,
    PageNotFoundComponent,
    StaffInvitationDialogComponent,
    AppTimeOfDayPipe,
    BaseScheduleEditorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,

    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatChipsModule,
    MatSlideToggleModule,

    TonysSharedModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: { separatorKeyCodes: [ENTER, COMMA] } },
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
