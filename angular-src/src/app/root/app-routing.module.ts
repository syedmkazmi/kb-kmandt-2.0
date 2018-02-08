import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {WelcomeComponent} from "../welcome/welcome.component";
import {DashboardComponent} from "../dashboard/components/dashboard.component";
import {PageNotFoundComponent} from "./components/page-not-found.component";
import {AuthGuard} from "../authentication/guards/auth.guard";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', component: PageNotFoundComponent}
    ], {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
