import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RouteGuardService } from './services/route-guard.service';

const routes: Routes = [
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    canActivate:[RouteGuardService],
    path:'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
const config: ExtraOptions = {
  useHash: false,
  initialNavigation: 'disabled'
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
