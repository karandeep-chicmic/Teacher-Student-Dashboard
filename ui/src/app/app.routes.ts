import { ROUTES, Routes } from '@angular/router';
import { ROUTES_UI } from './constants';
import { HomeComponentComponent } from './components/home/home-component/home-component.component';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { canActivate, canActivateAdmin, canActivateLogin } from './services/auth.guard';
import { MarksDashboardComponent } from './components/marks-dashboard/marks-dashboard.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: ROUTES_UI.DEFAULT, redirectTo: ROUTES_UI.LOGIN, pathMatch: 'full' },
  { path: ROUTES_UI.HOME, component: HomeComponentComponent },
  {
    path: ROUTES_UI.LOGIN,
    component: LoginComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.REGISTER,
    component: RegisterComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.MARKS_DASHBOARD,
    component: MarksDashboardComponent,
    canActivate: [canActivate],
  },{
    path: ROUTES_UI.ADMIN_PANEL,
    component: AdminPanelComponent,
    canActivate: [canActivateAdmin],
  }
];
