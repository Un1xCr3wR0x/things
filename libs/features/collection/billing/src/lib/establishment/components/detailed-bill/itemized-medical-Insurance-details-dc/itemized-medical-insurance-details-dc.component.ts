import { Component, Input, OnInit } from '@angular/core';
import { BilingualText} from '@gosi-ui/core';

import { MedicalInsuranceBeneficiaryDetailsWrapper } from '../../../../shared/models/medical-insurance-beneficiary-details-wrapper';

@Component({
  selector: 'blg-itemized-medical-insurance-details-dc',
  templateUrl: './itemized-medical-insurance-details-dc.component.html',
  styleUrls: ['./itemized-medical-insurance-details-dc.component.scss']
})
export class ItrmizedMedicalInsuranceDetailsDcComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {

  }

  /**
   * Input variables
   */
  @Input() medicalInsuranceBeneficiaryDetails: MedicalInsuranceBeneficiaryDetailsWrapper ;
  @Input() HeadingName: string;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;

}
