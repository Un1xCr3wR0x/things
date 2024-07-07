import { Component, OnInit, Input } from '@angular/core';
import { checkIqamaOrBorderOrPassport, CommonIdentity, Name, formatDate } from '@gosi-ui/core';
import { AddressTypeEnum } from '@gosi-ui/features/contributor/lib/shared/enums/address-type';
import { BeneficiaryBenefitDetails } from '../../../shared';

@Component({
  selector: 'bnt-funeral-grant-details-dc',
  templateUrl: './funeral-grant-details-dc.component.html',
  styleUrls: ['./funeral-grant-details-dc.component.scss']
})
export class FuneralGrantDetailsDcComponent implements OnInit {
  @Input() funeralGrantDetails: BeneficiaryBenefitDetails;
  @Input() benefitAmount: number;
  @Input() identity: CommonIdentity;
  @Input() heirArabicName: string;
  @Input() lang = 'en';
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  hasPOAddress = false;
  hasNationalAddress = false;
  hasOverseasAddress = false;
  constructor() {}

  ngOnInit() {
    this.checkForAddresstype();
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }
  checkForAddresstype() {
    if (this.funeralGrantDetails.beneficiaryDetails.contactDetail.currentMailingAddress === AddressTypeEnum.POBOX) {
      this.hasPOAddress = true;
    }
    if (this.funeralGrantDetails.beneficiaryDetails.contactDetail.currentMailingAddress === AddressTypeEnum.NATIONAL) {
      this.hasNationalAddress = true;
    }
    if (this.funeralGrantDetails.beneficiaryDetails.contactDetail.currentMailingAddress === AddressTypeEnum.OVERSEAS) {
      this.hasOverseasAddress = true;
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
