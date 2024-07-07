import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { FormsModule } from '../forms';
import { MolRequestComponent, TestSuiteComponent } from './components';
import { MciRequestComponent } from './components/mci-request/mci-request.component';
import { MolTestingRequestRoutingModule } from './mol-testing-routing.module';

@NgModule({
  declarations: [TestSuiteComponent, MolRequestComponent, MciRequestComponent],
  imports: [CommonModule, ThemeModule, MolTestingRequestRoutingModule, FormsModule]
})
export class MolTestingModule {}
