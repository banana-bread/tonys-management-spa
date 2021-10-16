import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ScheduleViewComponent } from '../dashboard/schedule-view/schedule-view.component';
import { ServiceEditorComponent } from '../dashboard/service-view/service-editor/service-editor.component';
import { ServiceViewComponent } from '../dashboard/service-view/service-view.component';
import { ShopSettingsEditorComponent } from '../dashboard/shop-view/shop-settings-editor/shop-settings-editor.component';
import { StaffEditorComponent } from '../dashboard/staff-view/staff-editor/staff-editor.component';
import { StaffViewComponent } from '../dashboard/staff-view/staff-view.component';
import { LoginComponent } from '../login/login.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AdminGuardService as AdminGuard } from './admin-guard.service';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginPageGuard } from './login-page-guard.service';

// TODO: create 
const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginPageGuard] },
  { 
    path: ':companyId', component: DashboardComponent, canActivate: [AuthGuard], 
    children: [
      { path: 'calendar', component: ScheduleViewComponent },
      { path: 'staff', component: StaffViewComponent, canActivate: [AdminGuard] },
      { path: 'services', component: ServiceViewComponent, canActivate: [AdminGuard] },
    ] 
  },
  { path: ':companyId/services/:id', component: ServiceEditorComponent, canActivate: [AuthGuard]},
  { path: ':companyId/staff/:id', component: StaffEditorComponent, canActivate: [AuthGuard] },
  { path: ':companyId/shop', component: ShopSettingsEditorComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: ':companyId/account', component: StaffEditorComponent, canActivate: [AuthGuard] },

  // TODO: implement a 404
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

