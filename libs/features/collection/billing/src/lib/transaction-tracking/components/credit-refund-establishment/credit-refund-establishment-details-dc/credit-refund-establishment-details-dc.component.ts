import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { BilingualText, getArabicName, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentDetails, VicContributorDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-credit-refund-establishment-details-dc',
  templateUrl: './credit-refund-establishment-details-dc.component.html',
  styleUrls: ['./credit-refund-establishment-details-dc.component.scss']
})
export class CreditRefundEstablishmentDetailsDcComponent implements OnInit, OnChanges {
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() contributorDetails: VicContributorDetails;
  vicAccountNo: string;
  vicBankName: BilingualText;
  arabicName = '';
  lang = 'en';
  contributorStatus: string;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.establishmentDetails?.currentValue) {
      this.establishmentDetails = changes?.establishmentDetails?.currentValue;
    }
    if (changes?.contributorDetails?.currentValue) {
      this.contributorDetails = changes?.contributorDetails?.currentValue;
      this.contributorStatus = this.contributorDetails.statusType ? 'BILLING.ACTIVE' : 'BILLING.INACTIVE';
      this.arabicName = getArabicName(changes.contributorDetails?.currentValue?.person?.name.arabic);
    }
  }
}
