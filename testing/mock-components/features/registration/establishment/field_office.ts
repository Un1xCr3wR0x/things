import { Component, NgModule } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EstablishmentDetailsFormDCComponent,
  EstablishmentOwnersDcComponent,
  PaymentDetailsDcComponent
} from '@gosi-ui/features/establishment';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BilingualTextPipeMock } from '../../../core/bilingual-text-pipe-mock';
import { ProactiveDetailsDcMockComponent } from './proactive';

@Component({
  selector: 'gosi-progress-wizard-dc',
  template: '',
  providers: [
    {
      provide: ProgressWizardDcComponent,
      useClass: ProgressWizardDcMockComponent
    }
  ]
})
export class ProgressWizardDcMockComponent {
  setNextItem() {}
  setPreviousItem() {}
  setDone(i: number) {}
  setActive(i: number) {}
}

@Component({
  selector: 'est-establishment-owners-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentOwnersDcComponent,
      useClass: OwnerMockComponent
    }
  ]
})
export class OwnerMockComponent {
  //Local Variables
  ownerForms: FormGroup;
  isFormEmpty = false;
  submitted = false;
  employeeComponent;
  searchEmployeeComponent;

  resetOwnerForm(index: number) {}
  addOwnerForm() {}
  createPersonForm() {}
}

@Component({
  selector: 'est-establishment-details-form-dc',
  template: '',
  providers: [
    {
      provide: EstablishmentDetailsFormDCComponent,
      useClass: EStablishmentDetailsFormMOckDcComponent
    }
  ]
})
export class EStablishmentDetailsFormMOckDcComponent {
  establishmentDetailsForm: FormGroup = new FormGroup({});
  resetEstablishmentDetailsForm() {}
}

@Component({
  selector: 'est-payment-details-dc',
  template: '',
  providers: [
    {
      provide: PaymentDetailsDcComponent,
      useClass: PaymentDetailsMockDcComponent
    }
  ]
})
export class PaymentDetailsMockDcComponent {
  paymentDetailsForm: FormGroup = new FormGroup({});
  resetPaymentDetailsForm() {}
  createPaymentDetailsForm() {}
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
  tabs: [{ active: true }, { active: true }, { active: true }, { active: true }];
}

@NgModule({
  declarations: [
    ProgressWizardDcMockComponent,
    TabsMockComponent,
    BilingualTextPipeMock,
    ProactiveDetailsDcMockComponent
  ]
})
export class FieldOfficeTestingModule {}
