import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EPersonNicScComponent, ERegisterEngagementScComponent } from './components';
const routes: Routes = [
  {
    path: '',
    component: EPersonNicScComponent
   
  },
  { path: 'registered',
  component: ERegisterEngagementScComponent
  },
  { path: 'registered/edit',
  component: ERegisterEngagementScComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule],
  exports: [RouterModule]
})
export class ERegistrationRoutingModule { }
 