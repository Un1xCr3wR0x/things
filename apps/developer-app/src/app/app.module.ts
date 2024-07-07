import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import menu from '../assets/jsons/menu.json';
import {
  ApplicationTypeToken,
  CoreModule,
  CurrencyToken,
  EnvironmentToken,
  GosiHttpInterceptor,
  LanguageToken,
  MenuToken,
  RouterData,
  RouterDataToken,
  SideMenuStateToken,
  RegistrationNoToken,
  RegistrationNumber,
  ContributorTokenDto,
  ContributorToken
} from '@gosi-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { NgxSimpleCalendarModule } from 'ngx-simple-calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

FullCalendarModule.registerPlugins([interactionPlugin, dayGridPlugin]);

// import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatDividerModule, MatNativeDateModule, MatButtonModule } from '@angular/material';

import { GCCCurrencyList } from '@gosi-ui/foundation-theme/lib/components/widgets/currency-dc/gcc-currency';
import { IModuleTranslationOptions, ModuleTranslateLoader } from '@larscom/ngx-translate-module-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgxEventCalendarModule } from 'ngx-event-calendar';
import { ContentDcComponent } from './content-dc.component';
export function createTranslateLoader(http: HttpClient) {
  const baseTranslateUrl = './assets/i18n';
  const options: IModuleTranslationOptions = {
    modules: [
      // final url: ./assets/i18n/en.json
      { baseTranslateUrl },
      // final url: ./assets/i18n/feature1/en.json
      { moduleName: 'theme', baseTranslateUrl },
      { moduleName: 'establishment', baseTranslateUrl },
      { moduleName: 'customer-information', baseTranslateUrl },
      { moduleName: 'dashboard', baseTranslateUrl },
      { moduleName: 'billing', baseTranslateUrl },
      { moduleName: 'form-fragments', baseTranslateUrl },
      { moduleName: 'contributor', baseTranslateUrl },
      { moduleName: 'occupational-hazard', baseTranslateUrl },
      { moduleName: 'inbox', baseTranslateUrl },
      { moduleName: 'core', baseTranslateUrl },
      { moduleName: 'ui', baseTranslateUrl }
    ]
  };
  return new ModuleTranslateLoader(http, options);
}

@NgModule({
  declarations: [AppComponent, ContentDcComponent],
  imports: [
    CoreModule,
    ThemeModule,
    FormsModule,
    IconsModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSimpleCalendarModule,
    FullCalendarModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GosiHttpInterceptor, multi: true },
    { provide: EnvironmentToken, useValue: environment },
    { provide: LanguageToken, useValue: new BehaviorSubject('en') },
    { provide: RouterDataToken, useValue: new RouterData() },
    { provide: ApplicationTypeToken, useValue: 'DEV' },
    { provide: MenuToken, useValue: menu.menuItems },
    { provide: SideMenuStateToken, useValue: new BehaviorSubject(true) },
    { provide: CurrencyToken, useValue: new BehaviorSubject(GCCCurrencyList.SAUDI_CURRENCY_CODE.key) },
    { provide: RegistrationNoToken, useValue: new RegistrationNumber(null) },
    { provide: ContributorToken, useValue: new ContributorTokenDto(null) }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
