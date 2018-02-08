import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ProposalListComponent} from './components/proposal-list.component';
import {ProposalDetailComponent} from './components/proposal-detail.component';
import {ProposalEditComponent} from './components/proposal-edit.component';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {ProposalEditResolverService} from "./services/proposal-edit-resolver.service";
import {SectorResolverService} from "../root/services/sector-resolver.service";
import {ProposalAddComponent} from './components/proposal-add.component';
import {AuthGuard} from "../authentication/guards/auth.guard";
import {MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {FileDropModule} from "ngx-file-drop";
import {ProposalListResolverService} from "./services/proposal-list-resolver.service";
import {UserListResolverService} from "../users/services/user-list-resolver.service";
import {FilterPipe} from "../root/pipes/search-filter.pipe";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'proposals',
        component: ProposalListComponent,
        canActivate: [AuthGuard],
        resolve: {proposals: ProposalListResolverService}
      },
      {
        path: 'proposals/:id',
        component: ProposalEditComponent,
        canActivate: [AuthGuard],
        resolve: {proposal: ProposalEditResolverService, sector: SectorResolverService, users: UserListResolverService}
      },
      {
        path: 'proposals/0/new',
        component: ProposalAddComponent,
        canActivate: [AuthGuard],
        resolve: {sector: SectorResolverService,  users: UserListResolverService}
      }
    ]),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileDropModule
  ],
  declarations: [ProposalListComponent, ProposalDetailComponent, ProposalEditComponent, ProposalAddComponent, FilterPipe],
  providers: [ProposalEditResolverService, ProposalListResolverService, UserListResolverService],
  exports: [ProposalListComponent]
})
export class ProposalModule {
}
