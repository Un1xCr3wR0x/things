import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { COMPS } from './components';
import { GuidelineDcComponent } from './guideline-dc.component';
import { UxGuidelinesRoutingModule } from './ux-guidelines-routing.module';

@NgModule({
  declarations: [GuidelineDcComponent, ...COMPS],
  imports: [CommonModule, UxGuidelinesRoutingModule, ThemeModule]
})
export class UxGuidelinesModule {}
