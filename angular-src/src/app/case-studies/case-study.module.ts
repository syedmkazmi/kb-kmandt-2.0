import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CaseStudyListComponent} from './components/case-study-list.component';
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {FilterPipe} from "../root/pipes/casestudy-filter.pipe";
import {CaseStudyAddComponent} from './components/case-study-add.component';
import {SectorResolverService} from "../root/services/sector-resolver.service";
import {CaseStudyUserResolverService} from "./services/case-study-user-resolver.service";
import {CaseStudyListResolverService} from "./services/case-study-list-resolver.service";
import { CaseStudyEditComponent } from './case-study-edit.component';
import {CaseStudyEditResolverService} from "./services/case-study-edit-resolver.service";
import {SkillResolverService} from "../root/services/skill-resolver.service";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: 'casestudies',
      canActivate: [AuthGuard],
      resolve: {sector: SectorResolverService, user: CaseStudyUserResolverService, skill: SkillResolverService},
      children: [
        {
          path: '',
          component: CaseStudyListComponent,
          resolve: {casestudies: CaseStudyListResolverService},
        },
        {
          path: '0/new',
          component: CaseStudyAddComponent
        },
        {
          path: ':id',
          component: CaseStudyEditComponent,
          resolve: {caseStudy: CaseStudyEditResolverService}
        }]
    }]),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CaseStudyListComponent, CaseStudyAddComponent, FilterPipe, CaseStudyEditComponent],
  exports: [FilterPipe],
  providers: [CaseStudyListResolverService, CaseStudyEditResolverService]
})
export class CaseStudyModule {
}
