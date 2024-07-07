import { Component, NgModule, Pipe, PipeTransform } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'gosi-progress-wizard-dc',
  template: ''
})
export class reportOHWizardMock {
  setNextItem() {}
  setPreviuosItem() {}
}

/* --------------------Mock Component for Tabs ----------- */
@Component({
  selector: 'tabset',
  template: '',
  providers: [
    {
      provide: TabsetComponent,
      useClass: TabsMockComponent
    }
  ]
})
export class TabsMockComponent {
  tabs: TabDirective[];
}

/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class BilingualTextPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'bilingualText',
  pure: false
})
export class BilingualTextPipeMock extends BaseComponent implements PipeTransform {
  lang = 'en';

  transform(object: any): any {
    return object;
  }
}

@NgModule({
  declarations: [reportOHWizardMock, TabsMockComponent, BilingualTextPipeMock]
})
export class FieldOfficeTestingModule {}
