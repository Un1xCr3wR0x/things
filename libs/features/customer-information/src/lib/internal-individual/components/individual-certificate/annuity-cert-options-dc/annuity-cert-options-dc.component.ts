import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputCheckboxDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'cim-annuity-cert-options-dc',
  templateUrl: './annuity-cert-options-dc.component.html',
  styleUrls: ['./annuity-cert-options-dc.component.scss']
})
export class AnnuityCertOptionsDcComponent {
  @Input() parentForm: FormGroup;

  @ViewChild('heir', { static: false })
  heirComponent: InputCheckboxDcComponent;
  @ViewChild('beneficiary', { static: false })
  beneficiaryComponent: InputCheckboxDcComponent;

  toggleBenefitCertOption(event, option) {
    const heir = this.parentForm.get('heir');
    const beneficiary = this.parentForm.get('beneficiary');

    this.parentForm.get(option).setValue(event.target.checked);

    if (heir.value || beneficiary.value) {
      heir.setErrors(null);
      beneficiary.setErrors(null);
      heir.setValidators(null);
      beneficiary.setValidators(null);
    } else if (option == 'heir' || option == 'beneficiary') {
      heir.setErrors({ required: true });
      beneficiary.setErrors({ required: true });
    }
    // I don't like this at all.
    this.heirComponent.onBlur(null);
    this.beneficiaryComponent.onBlur(null);
  }
}
