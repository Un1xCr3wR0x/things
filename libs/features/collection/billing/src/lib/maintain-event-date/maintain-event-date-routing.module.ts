import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDateScComponent } from './components';

const routes: Routes = [{ path: '', component: EventDateScComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintainEventDateRoutingModule {}
