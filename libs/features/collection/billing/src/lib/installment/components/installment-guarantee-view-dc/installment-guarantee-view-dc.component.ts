import { Component, OnInit, Input, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { InstallmentGuaranteeTypes } from '../../../shared/enums/installment-guarantee-types';

@Component({
  selector: 'blg-installment-guarantee-view-dc',
  templateUrl: './installment-guarantee-view-dc.component.html',
  styleUrls: ['./installment-guarantee-view-dc.component.scss']
})
export class InstallmentGuaranteeViewDcComponent implements OnInit {
  @Input() installmentDetails;
  @Input() guarantee;

  lang = 'en';
  guarantees = 'Bank Guarantee';
  promissory = 'Promissory Note';
  pension = 'Pension';
  other = 'Other';
  installmentType = InstallmentGuaranteeTypes;
  guaranteeNumber: string;
  startDate: string;
  endDate: string;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.installmentDetails?.guaranteeDetail[0]?.category.english === 'Pension') {
      this.guaranteeNumber = 'BILLING.BENEFICIARY-NATIONAL-ID';
    } else {
      this.guaranteeNumber = 'BILLING.GUARANTEE-NUMBER';
    }

    if (this.installmentDetails?.guaranteeDetail[0]?.category.english === 'Promissory Note') {
      this.startDate = 'BILLING.PROMISORY-START-DATE';
      this.endDate = 'BILLING.PROMISORY-END-DATE';
      this.guaranteeNumber = 'BILLING.BENEFICIARY-NATIONAL-ID';
    } else {
      this.startDate = 'BILLING.GUARANTEE-START-DATE';
      this.endDate = 'BILLING.GUARANTEE-END-DATE';
    }
  }
}
