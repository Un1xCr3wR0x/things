import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualBenefitsScComponent } from './individual-benefits-sc/individual-benefits-sc.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualBenefitsScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualBenefitsRoutingModule {}
