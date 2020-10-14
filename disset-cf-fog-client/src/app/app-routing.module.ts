import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home/home.component';
import { UserEntranceComponent } from './user-entrance/user-entrance.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: UserEntranceComponent },
  { path: 'register', component: UserEntranceComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'configure', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ConfigurationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
