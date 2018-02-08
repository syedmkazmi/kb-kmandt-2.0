import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserEditComponent} from "./components/user-edit.component";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {UserEditResolverService} from "./services/user-edit-resolver.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {SectorResolverService} from "../root/services/sector-resolver.service";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'users/:id',
        component: UserEditComponent,
        canActivate: [AuthGuard],
        resolve: {user: UserEditResolverService, sector: SectorResolverService}
      }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule
  ],
  declarations: [UserEditComponent],
  providers: [UserEditResolverService]
})
export class UsersModule {
}
