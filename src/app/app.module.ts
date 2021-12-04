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
import { TonysSharedModule } from '@tonys-barbers/shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceViewComponent } from './dashboard/service-view/service-view.component';
import { StaffViewComponent } from './dashboard/staff-view/staff-view.component';
import { ShopViewComponent } from './dashboard/shop-view/shop-view.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@tonys-barbers/shared';
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
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes-dialog.component';
import { StaffEditorComponent } from './dashboard/staff-view/staff-editor/staff-editor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StaffInvitationDialogComponent } from './dashboard/staff-view/staff-invitation-dialog/staff-invitation-dialog.component';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppTimeOfDayPipe } from './pipes/time-of-day.pipe';
import { BaseScheduleEditorComponent } from './base-schedule-editor/base-schedule-editor.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ShopSettingsEditorComponent } from './dashboard/shop-view/shop-settings-editor/shop-settings-editor.component';
import { ScheduleViewComponent } from './dashboard/schedule-view/schedule-view.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { EmployeeCalendarComponent } from './dashboard/schedule-view/employee-calendar/employee-calendar.component';
import { EmployeeCalendarListComponent } from './dashboard/schedule-view/employee-calendar-list/employee-calendar-list.component';
import { BookingEditorComponent } from './dashboard/schedule-view/booking-editor/booking-editor.component';
import { MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { AccountEditorComponent } from './dashboard/account-view/account-editor/account-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';



export function momentAdapterFactory() {
  return adapterFactory(moment);
};
// import { MatNativeDateModule, MAT_NATIVE_DATE_FORMATS, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core'


// const GRI_DATE_FORMATS: MatDateFormats = {
//   ...MAT_NATIVE_DATE_FORMATS,
//   display: {
//     ...MAT_NATIVE_DATE_FORMATS.display,
//     dateInput: {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     } as Intl.DateTimeFormatOptions,
//   }
// };

const APP_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  }
}

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
    UnsavedChangesComponent,
    StaffEditorComponent,
    PageNotFoundComponent,
    StaffInvitationDialogComponent,
    AppTimeOfDayPipe,
    BaseScheduleEditorComponent,
    ShopSettingsEditorComponent,
    ScheduleViewComponent,
    EmployeeCalendarComponent,
    EmployeeCalendarListComponent,
    BookingEditorComponent,
    AccountEditorComponent,
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
    DragDropModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatRippleModule,

    TonysSharedModule.forRoot('http://137.184.144.102'),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: { separatorKeyCodes: [ENTER, COMMA] } },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
