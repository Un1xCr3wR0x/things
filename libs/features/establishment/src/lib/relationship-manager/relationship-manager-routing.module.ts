import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRelationshipManagerScComponent } from './components/manage-relationship-manager-sc/manage-relationship-manager-sc.component';

const routes: Routes = [
  {
    path: ':registrationNo/add',
    component: ManageRelationshipManagerScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.ADD-RELATIONSHIP-MANAGER'
    }
  },
  {
    path: ':registrationNo/modify',
    component: ManageRelationshipManagerScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.MODIFY-RELATIONSHIP-MANAGER'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelationshipManagerRoutingModule {}
