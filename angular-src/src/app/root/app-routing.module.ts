import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {WelcomeComponent} from "../welcome/welcome.component";
import {DashboardComponent} from "../dashboard/components/dashboard.component";
import {PageNotFoundComponent} from "./components/page-not-found.component";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {PromptUserDetailsComponent} from "./prompt-user-details.component";
import {ErrorComponent} from "./components/error.component";
import {RoadmapComponent} from "./components/roadmap.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      //{path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
      {path: 'welcome', component: PromptUserDetailsComponent, canActivate: [AuthGuard]},
      {path: 'error', component: ErrorComponent, canActivate: [AuthGuard]},
      {path: 'roadmap', component: RoadmapComponent},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', component: PageNotFoundComponent}
    ], {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
