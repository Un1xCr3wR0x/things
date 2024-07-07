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
  MenuToken,
  SideMenuStateToken,
  CurrencyToken,
  ApplicationTypeEnum,
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
import { AngularFireModule } from '@angular/fire';
import { GCCCurrencyList } from '@gosi-ui/foundation-theme/lib/components/widgets/currency-dc/gcc-currency';
export function createTranslateLoader(http: HttpClient) {
  const baseTranslateUrl = './assets/i18n';
  const options: IModuleTranslationOptions = {
    modules: [
      // final url: ./assets/i18n/en.json
      { baseTranslateUrl },
      // final url: ./assets/i18n/feature1/en.json
      { moduleName: 'theme', baseTranslateUrl },
      { moduleName: 'core', baseTranslateUrl },
      { moduleName: 'billing', baseTranslateUrl },
      { moduleName: 'dashboard', baseTranslateUrl },
      { moduleName: 'form-fragments', baseTranslateUrl },
      { moduleName: 'inbox', baseTranslateUrl },
      { moduleName: 'customer-information', baseTranslateUrl },
      { moduleName: 'contributor', baseTranslateUrl },
      { moduleName: 'establishment', baseTranslateUrl },
      { moduleName: 'occupational-hazard', baseTranslateUrl },
      { moduleName: 'benefits', baseTranslateUrl },
      { moduleName: 'payment', baseTranslateUrl },
      { moduleName: 'adjustment', baseTranslateUrl },
      { moduleName: 'transaction-tracing', baseTranslateUrl },
      { moduleName: 'violations', baseTranslateUrl },
      { moduleName: 'transaction-tracing', baseTranslateUrl },
      { moduleName: 'complaints', baseTranslateUrl },
      { moduleName: 'team-management', baseTranslateUrl },
      { moduleName: 'medical-board', baseTranslateUrl },
      { moduleName: 'feature360', baseTranslateUrl },
      { moduleName: 'appeals', baseTranslateUrl }
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
    { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
    { provide: RouterDataToken, useValue: new RouterData() },
    { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
    { provide: MenuToken, useValue: menu.menuItems },
    { provide: SideMenuStateToken, useValue: new BehaviorSubject(false) },
    { provide: CurrencyToken, useValue: new BehaviorSubject(GCCCurrencyList.SAUDI_CURRENCY_CODE.key) },
    { provide: RegistrationNoToken, useValue: new RegistrationNumber(null) },
    { provide: ContributorToken, useValue: new ContributorTokenDto(null) }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
