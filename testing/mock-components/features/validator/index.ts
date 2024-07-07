import { Component, NgModule } from '@angular/core';

//Dummy export

@Component({
  selector: 'vtr-dummy-dc',
  template: ''
})
export class DummyValidatorComponent {}

@Component({
  selector: 'vtr-dummy-dc',
  template: ''
})
export class DummyContributorComponent {}

@NgModule({
  declarations: [DummyContributorComponent, DummyValidatorComponent]
})
export class ValidatorTestingModule {}
