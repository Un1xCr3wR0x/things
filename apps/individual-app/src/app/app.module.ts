import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreModule,
  CurrencyToken,
  EnvironmentToken,
  EstablishmentRouterData,
  EstablishmentToken,
  GosiHttpInterceptor,
  LanguageToken,
  MenuToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  SideMenuStateToken,
  StorageService,
  ContributorTokenDto,
  ContributorToken
} from '@gosi-ui/core';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { GCCCurrencyList } from '@gosi-ui/foundation-theme/lib/components/widgets/currency-dc/gcc-currency';
import { IModuleTranslationOptions, ModuleTranslateLoader } from '@larscom/ngx-translate-module-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import menu from '../assets/jsons/menu.json';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  const baseTranslateUrl = './assets/i18n';
  const options: IModuleTranslationOptions = {
    modules: [
      { baseTranslateUrl },
      { moduleName: 'theme', baseTranslateUrl },
      { moduleName: 'core', baseTranslateUrl },
      { moduleName: 'dashboard', baseTranslateUrl },
      { moduleName: 'inbox', baseTranslateUrl },
      { moduleName: 'occupational-hazard', baseTranslateUrl },
      { moduleName: 'contributor', baseTranslateUrl },
      { moduleName: 'transaction-tracing', baseTranslateUrl },
      { moduleName: 'customer-information', baseTranslateUrl },
      { moduleName: 'form-fragments', baseTranslateUrl },
      { moduleName: 'complaints', baseTranslateUrl },
      { moduleName: 'billing', baseTranslateUrl },
      { moduleName: 'benefits', baseTranslateUrl },
      { moduleName: 'establishment', baseTranslateUrl },
      { moduleName: 'payment', baseTranslateUrl },
      { moduleName: 'adjustment', baseTranslateUrl },
      { moduleName: 'violations', baseTranslateUrl },
      { moduleName: 'team-management', baseTranslateUrl },
      { moduleName: 'medical-board', baseTranslateUrl },
      { moduleName: 'feature360', baseTranslateUrl }
    ]
  };
  return new ModuleTranslateLoader(http, options);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    ThemeModule,
    IconsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: GosiHttpInterceptor, multi: true },
    { provide: EnvironmentToken, useValue: environment },
    { provide: LanguageToken, useValue: new BehaviorSubject('en') },
    { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.INDIVIDUAL_APP },
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
