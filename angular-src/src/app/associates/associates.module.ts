import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {BioAssociatePdfComponent} from './components/bio-associate-pdf.component';
import {RouterModule} from "@angular/router";
import {BioListResolverService} from "../bios/services/bio-list-resolver.service";
import {BioListComponent} from "../bios/components/bio-list.component";

import {SkillResolverService} from "../root/services/skill-resolver.service";
import {SectorResolverService} from "../root/services/sector-resolver.service";
import {IconResolverService} from "../root/services/icon-resolver.service";


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'associates',
        resolve: {icon: IconResolverService, skill: SkillResolverService, sector: SectorResolverService},
        children: [
          {
            path: '',
            component: BioListComponent,
            resolve: {bios: BioListResolverService}
          },
          {
            path: 'bio',
            component: BioAssociatePdfComponent
          }
        ]
      }
    ]),
    SharedModule
  ],
  declarations: [BioAssociatePdfComponent]
})
export class AssociatesModule {
}
