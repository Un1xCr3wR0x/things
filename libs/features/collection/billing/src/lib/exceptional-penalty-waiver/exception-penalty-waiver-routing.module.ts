import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstablishmentPenaltyWaiverScComponent } from './components/establishment-penalty-waiver-sc/establishment-penalty-waiver-sc.component';
import { VicPenaltyWaiverScComponent } from './components';
import { ExceptionalPenaltyWaiverHomepageScComponent } from './components/exception-penalty-waiver-hompage-sc/exception-penalty-waiver-homepage-sc.component';
import { EntityTypePenaltyWaiverScComponent } from './components/entity-type-penalty-waiver-sc/entity-type-penalty-waiver-sc.component';

const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'verify',
        component: ExceptionalPenaltyWaiverHomepageScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'establishment/waiver',
        component: EstablishmentPenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'vic/waiver',
        component: VicPenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'entityType/waiver',
        component: EntityTypePenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'entityType/edit',
        component: EntityTypePenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'establishment/edit',
        component: EstablishmentPenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'vic/edit',
        component: VicPenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'vic/modify',
        component: VicPenaltyWaiverScComponent,
        data: {
          breadcrumb: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionalPenaltyWaiverRoutingModule {}
