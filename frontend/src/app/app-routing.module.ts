import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './core/configuration/configuration.component';
import { HomeComponent } from './core/home/home/home.component';
import { UserConfigurationsComponent } from './core/user-configurations/user-configurations/user-configurations.component';
import { UserEntranceComponent } from './core/user-entrance/user-entrance.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: UserEntranceComponent },
  { path: 'register', component: UserEntranceComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'configure', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'user-configurations', component: UserConfigurationsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
