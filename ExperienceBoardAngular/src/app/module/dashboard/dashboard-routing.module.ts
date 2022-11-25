import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from 'src/app/components/main-dashboard/main-dashboard.component';
import { RedirectPageComponent } from 'src/app/components/redirect-page/redirect-page.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: MainDashboardComponent,
  // },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: MainDashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'dashboard/widgets',
        component: RedirectPageComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
