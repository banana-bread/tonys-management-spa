import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ServiceEditorComponent } from '../dashboard/service-view/service-editor/service-editor.component';
import { ServiceViewComponent } from '../dashboard/service-view/service-view.component';
import { ShopViewComponent } from '../dashboard/shop-view/shop-view.component';
import { StaffViewComponent } from '../dashboard/staff-view/staff-view.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginPageGuard } from './login-page-guard.service';

// TODO: create 
const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginPageGuard] },
  { 
    path: ':companyId', component: DashboardComponent, canActivate: [AuthGuard], 
    children: [
      { path: 'services', component: ServiceViewComponent },
      { path: 'staff', component: StaffViewComponent },
      { path: 'shop', component: ShopViewComponent },
    ] 
  },
  { path: ':companyId/services/:id', component: ServiceEditorComponent },
  // TODO: implement a 404
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

