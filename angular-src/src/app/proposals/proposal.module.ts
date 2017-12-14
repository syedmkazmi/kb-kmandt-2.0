import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import { ProposalListComponent } from './components/proposal-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'proposals', component: ProposalListComponent}
    ])
  ],
  declarations: [ProposalListComponent]
})
export class ProposalModule { }
