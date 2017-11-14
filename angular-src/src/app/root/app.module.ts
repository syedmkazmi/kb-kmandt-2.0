import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";
import {AuthGuard} from "../authentication/guards/auth.guard";
import {AppComponent} from './components/app.component';
import {WelcomeComponent} from '../welcome/welcome.component';
import {AuthenticationModule} from "../authentication/authentication.module";
import {UserService} from "../authentication/services/user.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "../authentication/services/authentication.service";
import {LoginGuard} from "../authentication/guards/login.guard";
import {AuthInterceptorService} from "../authentication/services/auth-interceptor.service";
import {RootNavComponent} from '../root-navigation/root-nav.component';
import {ErrorInterceptorService} from "../authentication/services/error-interceptor.service";
import {NotificationsComponent} from './components/notifications.component';
import {NotificationsService} from "./services/notifications.service";
import {PageNotFoundComponent} from './components/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RootNavComponent,
    NotificationsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AuthenticationModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [
    UserService,
    AuthenticationService,
    NotificationsService,
    AuthGuard,
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
