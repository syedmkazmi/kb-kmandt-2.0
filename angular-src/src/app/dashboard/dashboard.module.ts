import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './components/dashboard.component';
import {ProposalModule} from "../proposals/proposal.module";

@NgModule({
  imports: [
    CommonModule,
    ProposalModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
