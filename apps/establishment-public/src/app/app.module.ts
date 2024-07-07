import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
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
  StorageService
} from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { GCCCurrencyList } from '@gosi-ui/foundation-theme/lib/components/widgets/currency-dc/gcc-currency';
import { IModuleTranslationOptions, ModuleTranslateLoader } from '@larscom/ngx-translate-module-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import menu from '../assets/jsons/menu.json';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { APP_BASE_HREF, HashLocationStrategy } from '@angular/common';

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
      { moduleName: 'violations', baseTranslateUrl },
      { moduleName: 'occupational-hazard', baseTranslateUrl },
      { moduleName: 'benefits', baseTranslateUrl },
      { moduleName: 'payment', baseTranslateUrl },
      { moduleName: 'adjustment', baseTranslateUrl },
      { moduleName: 'transaction-tracing', baseTranslateUrl },
      { moduleName: 'medical-board', baseTranslateUrl },
      { moduleName: 'complaints', baseTranslateUrl }
    ]
  };
  return new ModuleTranslateLoader(http, options);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    ThemeModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    LoginModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    //{ provide: APP_BASE_HREF, useValue: 'https://amne2eapppub2.gosi.ins/establishment-public/'},
    { provide: HashLocationStrategy, useValue:true},
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: GosiHttpInterceptor, multi: true },
    { provide: EnvironmentToken, useValue: environment },
    { provide: LanguageToken, useValue: new BehaviorSubject('en') },
    { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
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
