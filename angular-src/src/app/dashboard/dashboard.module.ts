import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './components/dashboard.component';
import {ProposalDashboardComponent} from './components/proposal-dashboard.component';
import {ProposalModule} from "../proposals/proposal.module";
import {SharedModule} from "../shared/shared.module";
import { BioDashboardComponent } from './bio-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProposalModule
  ],
  declarations: [DashboardComponent, ProposalDashboardComponent, BioDashboardComponent]
})
export class DashboardModule {
}
