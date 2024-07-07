import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MolRequestComponent, TestSuiteComponent } from './components';
import { MciRequestComponent } from './components/mci-request/mci-request.component';

const routes: Routes = [
  {
    path: '',
    component: TestSuiteComponent,
    children: [
      {
        path: '',
        redirectTo: 'mol',
        pathMatch: 'full'
      },
      {
        path: 'mol',
        component: MolRequestComponent,
        data: {
          breadcrumb: 'MOl'
        }
      },
      {
        path: 'mci',
        component: MciRequestComponent,
        data: {
          breadcrumb: 'MCI'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MolTestingRequestRoutingModule {}
