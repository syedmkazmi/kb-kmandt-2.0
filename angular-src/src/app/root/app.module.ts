import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {AppComponent} from './components/app.component';
import {WelcomeComponent} from '../welcome/welcome.component';
import {AuthenticationModule} from "../authentication/authentication.module";
import {UserService} from "../users/services/user.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "../authentication/services/authentication.service";
import {LoginGuard} from "../authentication/guards/login.guard";
import {AuthInterceptorService} from "../authentication/services/auth-interceptor.service";
import {RootNavComponent} from '../root-navigation/root-nav.component';
import {ErrorInterceptorService} from "../authentication/services/error-interceptor.service";
import {NotificationsComponent} from './components/notifications.component';
import {NotificationsService} from "./services/notifications.service";
import {PageNotFoundComponent} from './components/page-not-found.component';
import {ProposalModule} from "../proposals/proposal.module";
import {CaseStudyModule} from "../case-studies/case-study.module";
import {ProposalService} from "../proposals/services/proposal.service";
import {SharedService} from "./services/shared.service";
import {SectorResolverService} from "./services/sector-resolver.service";
import {SpinnerService} from "./spinner.service";
import {BioModule} from "../bios/bio.module";
import {SkillResolverService} from "./services/skill-resolver.service";
import {IconResolverService} from "./services/icon-resolver.service";
import {BioService} from "../bios/services/bio.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UsersModule} from "../users/users.module";
import {SharedModule} from "../shared/shared.module";
import {DashboardModule} from "../dashboard/dashboard.module";
import {DashboardService} from "../dashboard/services/dashboard.service";
import {AssociatesModule} from "../associates/associates.module";
import {UserDetailsGuard} from "../authentication/guards/user-details.guard";
import { PromptUserDetailsComponent } from './prompt-user-details.component';
import {BioUserResolverService} from "../bios/services/bio-user-resolver.service";
import { ErrorComponent } from './components/error.component';
import { RoadmapComponent } from './components/roadmap.component';
import { UnderDevelopmentComponent } from './components/under-development.component';
import { BrowserCheckComponent } from './components/browser-check.component';
import {CaseStudyUserResolverService} from "../case-studies/services/case-study-user-resolver.service";
import {CaseStudyService} from "../case-studies/services/case-study.service";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RootNavComponent,
    //NotificationsComponent,
    PageNotFoundComponent,
    PromptUserDetailsComponent,
    ErrorComponent,
    RoadmapComponent,
    UnderDevelopmentComponent,
    BrowserCheckComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthenticationModule,
    HttpClientModule,
    DashboardModule,
    ProposalModule,
    CaseStudyModule,
    BioModule,
    UsersModule,
    AssociatesModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    AuthenticationService,
    NotificationsService,
    DashboardService,
    ProposalService,
    BioService,
    SharedService,
    SpinnerService,
    SectorResolverService,
    SkillResolverService,
    IconResolverService,
    BioUserResolverService,
    CaseStudyService,
    CaseStudyUserResolverService,
    AuthGuard,
    UserDetailsGuard,
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
