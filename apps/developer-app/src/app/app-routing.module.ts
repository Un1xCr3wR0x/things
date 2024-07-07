/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentDcComponent } from './content-dc.component';
import { CalendarSchedulerScComponent } from './development/calendar-scheduler-sc/calendar-scheduler-sc.component';
import { CalendarViewDcComponent } from './development/calendar-view-dc/calendar-view-dc.component';
import { AlertsComponent } from './pocs/alerts/alerts.component';
import { CardsComponent } from './pocs/cards/cards.component';
import { FilterComponent } from './pocs/filter/filter.component';
import { HijiriPickerComponent } from './pocs/hijiri-picker/hijiri-picker.component';
import { MultiDropdownComponent } from './pocs/multi-dropdown/multi-dropdown.component';
import { ToggleSwitchComponent } from './pocs/toggle-switch/toggle-switch.component';
import { WidgetComponent } from './pocs/widget/widget.component';
import { TranslationsScComponent } from './translations/translations-sc/translations-sc.component';
import { HijiriMonthPickerComponent } from './pocs/hijiri-month-picker/hijiri-month-picker.component';
import { InputMobileIntlComponent } from './pocs/input-mobile-intl/input-mobile-intl.component';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'proactive-establishment-v2',
    pathMatch: 'full'
  },
  {
    path: 'guideline',
    loadChildren: () => import('./ux-guidelines').then(mod => mod.UxGuidelinesModule),
    data: {
      breadcrumb: 'Guidelines'
    }
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms').then(mod => mod.FormsModule),
    data: {
      breadcrumb: 'Forms'
    }
  },
  {
    path: 'proactive-establishment-v2',
    loadChildren: () => import('./mol-testing').then(mod => mod.MolTestingModule),
    data: {
      breadcrumb: 'Forms'
    }
  },
  {
    path: 'content',
    component: ContentDcComponent,
    children: [
      {
        path: 'translations',
        component: TranslationsScComponent
      },
      {
        path: 'developments',
        component: CalendarSchedulerScComponent
      },
      {
        path: 'training',
        loadChildren: () => import('./training').then(mod => mod.TrainingModule)
      },
      {
        path: 'pocs/filter',
        component: FilterComponent
      },
      {
        path: 'pocs/hijiri-picker',
        component: HijiriPickerComponent
      },
      {
        path: 'pocs/hijiri-month-picker',
        component: HijiriMonthPickerComponent
      },
      {
        path: 'pocs/mobile-intl',
        component: InputMobileIntlComponent
      },
      {
        path: 'pocs/alerts',
        component: AlertsComponent
      },
      {
        path: 'pocs/cards',
        component: CardsComponent
      },
      {
        path: 'pocs/dropdown',
        component: MultiDropdownComponent
      },
      {
        path: 'pocs/toggle',
        component: ToggleSwitchComponent
      },
      {
        path: 'pocs/components',
        component: WidgetComponent
      },
      {
        path: 'pocs/calendar',
        component: CalendarViewDcComponent
      }
    ]
  }
];

/**
 * Routing module for Home feature
 *
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true })],
  declarations: []
})
export class AppRoutingModule {}
