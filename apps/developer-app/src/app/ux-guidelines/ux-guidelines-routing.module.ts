import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsDcComponent } from './components/alerts-dc/alerts-dc.component';
import { ButtonsDcComponent } from './components/buttons-dc/buttons-dc.component';
import { CheckboxDcComponent } from './components/checkbox-dc/checkbox-dc.component';
import { DateGregorianDcComponent } from './components/date-gregorian-dc/date-gregorian-dc.component';
import { DropdownDcComponent } from './components/dropdown-dc/dropdown-dc.component';
import { RadioDcComponent } from './components/radio-dc/radio-dc.component';
import { TextDcComponent } from './components/text-dc/text-dc.component';
import { ToggleDcComponent } from './components/toggle-dc/toggle-dc.component';
import { GuidelineDcComponent } from './guideline-dc.component';
import { TimeDcComponent } from './components/time-dc/time-dc.component';
import { FilterDcComponent } from './components/filter-dc/filter-dc.component';
import { RangeSliderDcComponent } from './components/range-slider-dc/range-slider-dc.component';
import { MobileDcComponent } from './components/mobile-dc/mobile-dc.component';
import { SearchBarDcComponent } from './components/search-bar-dc/search-bar-dc.component';
import { DocumentDcComponent } from './components/document-dc/document-dc.component';
import { DaterangeDcComponent } from './components/daterange-dc/daterange-dc.component';
import { MonthrangeDcComponent } from './components/monthrange-dc/monthrange-dc.component';

const routes: Routes = [
  {
    path: '',
    component: GuidelineDcComponent,
    children: [
      {
        path: 'text',
        component: TextDcComponent,
        data: {
          breadcrumb: 'Input Text'
        }
      },
      {
        path: 'date-gregorian',
        component: DateGregorianDcComponent,
        data: {
          breadcrumb: 'Input Date - Gregorian'
        }
      },
      {
        path: 'dropdown',
        component: DropdownDcComponent,
        data: {
          breadcrumb: 'Dropdown'
        }
      },
      {
        path: 'button',
        component: ButtonsDcComponent,
        data: {
          breadcrumb: 'Button'
        }
      },
      {
        path: 'alert',
        component: AlertsDcComponent,
        data: {
          breadcrumb: 'Alert'
        }
      },
      {
        path: 'checkbox',
        component: CheckboxDcComponent,
        data: {
          breadcrumb: 'Checkbox'
        }
      },
      {
        path: 'radio',
        component: RadioDcComponent,
        data: {
          breadcrumb: 'Radio'
        }
      },
      {
        path: 'toggle',
        component: ToggleDcComponent,
        data: {
          breadcrumb: 'Toggle'
        }
      },
      {
        path: 'time',
        component: TimeDcComponent,
        data: {
          breadcrumb: 'Time'
        }
      },
      {
        path: 'filter',
        component: FilterDcComponent,
        data: {
          breadcrumb: 'Filter'
        }
      },
      {
        path: 'slider',
        component: RangeSliderDcComponent,
        data: {
          breadcrumb: 'Slider'
        }
      },
      {
        path: 'mobile',
        component: MobileDcComponent,
        data: {
          breadcrumb: 'Mobile'
        }
      },
      {
        path: 'search',
        component: SearchBarDcComponent,
        data: {
          breadcrumb: 'Search'
        }
      },
      {
        path: 'document',
        component: DocumentDcComponent,
        data: {
          breadcrumb: 'Document'
        }
      },
      {
        path: 'daterange',
        component: DaterangeDcComponent,
        data: {
          breadcrumb: 'Input DateRange'
        }
      },
      {
        path: 'monthrange',
        component: MonthrangeDcComponent,
        data: {
          breadcrumb: 'Input MonthRange'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UxGuidelinesRoutingModule {}
