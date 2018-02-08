import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './components/dashboard.component';
import {ProposalDashboardComponent} from './proposal-dashboard.component';
import {ProposalModule} from "../proposals/proposal.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProposalModule
  ],
  declarations: [DashboardComponent, ProposalDashboardComponent]
})
export class DashboardModule {
}
