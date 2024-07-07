import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import menu from '../assets/jsons/menu.json';
import {
  ApplicationTypeToken,
  CoreModule,
  EnvironmentToken,
  EstablishmentRouterData,
  EstablishmentToken,
  GosiHttpInterceptor,
  LanguageToken,
  RouterData,
  RouterDataToken,
  SideMenuStateToken,
  CurrencyToken,
  MenuToken,
  RegistrationNoToken,
  RegistrationNumber,
  ContributorToken,
  ContributorTokenDto
} from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { IModuleTranslationOptions, ModuleTranslateLoader } from '@larscom/ngx-translate-module-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { AngularFireModule } from '@angular/fire';
import { GCCCurrencyList } from '@gosi-ui/foundation-theme/lib/components/widgets/currency-dc/gcc-currency';
import { AngularFireModule } from '@angular/fire';
export function createTranslateLoader(http: HttpClient) {
  const baseTranslateUrl = './assets/i18n';
  const options: IModuleTranslationOptions = {
    modules: [
      { baseTranslateUrl },
      { moduleName: 'theme', baseTranslateUrl },
      { moduleName: 'core', baseTranslateUrl },
      { moduleName: 'form-fragments', baseTranslateUrl },
      { moduleName: 'inbox', baseTranslateUrl },
      { moduleName: 'transaction-tracing', baseTranslateUrl },
      { moduleName: 'complaints', baseTranslateUrl },
      { moduleName: 'team-management', baseTranslateUrl },
      { moduleName: 'dashboard', baseTranslateUrl },
      { moduleName: 'feature360', baseTranslateUrl }
    ]
  };
  return new ModuleTranslateLoader(http, options);
}

/**
 * Method creates translate loader.
 *
 * @export
 * @param {HttpClient} http
 * @returns
 *
 */

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    AppRoutingModule,
    ThemeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GosiHttpInterceptor, multi: true },
    { provide: EnvironmentToken, useValue: environment },
    { provide: LanguageToken, useValue: new BehaviorSubject('en') },
    { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
    { provide: RouterDataToken, useValue: new RouterData() },
    { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
    { provide: SideMenuStateToken, useValue: new BehaviorSubject(true) },
    { provide: MenuToken, useValue: menu.menuItems },
    { provide: CurrencyToken, useValue: new BehaviorSubject(GCCCurrencyList.SAUDI_CURRENCY_CODE.key) },
    { provide: RegistrationNoToken, useValue: new RegistrationNumber(null) },
    { provide: ContributorToken, useValue: new ContributorTokenDto(null) }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
