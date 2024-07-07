/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { WIDGETS_COMPONENTS } from './components/widgets';
import { DIRECTIVES } from './directives';
import { IconsModule } from './icons.module';
import { PIPES } from './pipes';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  NgSelectModule,
  LoadingBarHttpClientModule,
  LoadingBarRouterModule,
  LoadingBarModule,
  IconsModule,
  GoogleMapsModule,
  PerfectScrollbarModule
];

@NgModule({
  declarations: [...WIDGETS_COMPONENTS, ...PIPES, ...DIRECTIVES],

  imports: [
    ...MODULES,
    NgxSliderModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    CollapseModule.forRoot(),
    //TODO: remove it
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule,
    ToastrModule.forRoot()
  ],
  providers: [
    ...PIPES,
    DatePipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    ...MODULES,
    ...WIDGETS_COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
    BsDropdownModule,
    TabsModule,
    TooltipModule,
    AccordionModule,
    AlertModule,
    PaginationModule,
    BsDatepickerModule,
    TranslateModule,
    NgxMaskModule,
    PopoverModule,
    ToastrModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    NgxSliderModule,
    GoogleMapsModule,
    CollapseModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThemeModule {}
