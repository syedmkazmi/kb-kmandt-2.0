import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {SectorResolverService} from "../root/services/sector-resolver.service";
import {SkillResolverService} from "../root/services/skill-resolver.service";
import {IconResolverService} from "../root/services/icon-resolver.service";
import {BioEditComponent} from './components/bio-edit.component';
import {BioEditResolverService} from "./services/bio-edit-resolver.service";
import {MatDatepickerModule, MatNativeDateModule} from "@angular/material";
import {BioAddComponent} from './components/bio-add.component';
import {BioListComponent} from './components/bio-list.component';
import {BioListResolverService} from "./services/bio-list-resolver.service";
import {SharedModule} from "../shared/shared.module";
import {BioPdfComponent} from './components/bio-pdf.component';
import {UserDetailsGuard} from "../authentication/guards/user-details.guard";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'bios',
        canActivate: [AuthGuard, UserDetailsGuard],
        resolve: {icon: IconResolverService, skill: SkillResolverService, sector: SectorResolverService},
        children: [
          {
            path: '',
            component: BioListComponent,
            resolve: {bios: BioListResolverService}
          },
          {
            path: '0/new',
            component: BioAddComponent
          },
          {
            path: ':id',
            component: BioEditComponent,
            resolve: {bio: BioEditResolverService}
          },
          {
            path: ':id/pdf',
            component: BioPdfComponent,
            resolve: {bio: BioEditResolverService}
          }
        ]
      }
    ]),
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule
  ],
  declarations: [BioAddComponent, BioEditComponent, BioListComponent, BioPdfComponent],
  providers: [BioEditResolverService, BioListResolverService]
})
export class BioModule {
}
