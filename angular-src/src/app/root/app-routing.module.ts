import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { WelcomeComponent } from "../welcome/welcome.component";
import {PageNotFoundComponent} from "./components/page-not-found.component";
import { AuthGuard } from "../authentication/guards/auth.guard";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
      { path: '', redirectTo: 'welcome', pathMatch: 'full'},
      { path: '**', component: PageNotFoundComponent}
    ],{useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
