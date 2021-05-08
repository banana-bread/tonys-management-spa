import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceViewComponent } from './dashboard/service-view/service-view.component';
import { ShopViewComponent } from './dashboard/shop-view/shop-view.component';
import { StaffViewComponent } from './dashboard/staff-view/staff-view.component';

const routes: Routes = [
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'services', component: ServiceViewComponent },
      { path: 'staff', component: StaffViewComponent },
      { path: 'shop', component: ShopViewComponent },
    ] 
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

