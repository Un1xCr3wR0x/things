import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AddressTypeEnum } from '@gosi-ui/core';
import { ContactDetails, ModifyContactRequest } from '../../../shared';
const ISD_CODE_PREFIX = {
  om: '+968',
  qa: '+974',
  ae: '+971',
  sa: '+966',
  kw: '+965',
  bh: '+973'
};
@Component({
  selector: 'cim-verify-contact-details-dc',
  templateUrl: './verify-contact-details-dc.component.html',
  styleUrls: ['./verify-contact-details-dc.component.scss']
})
export class VerifyContactDetailsDcComponent implements OnInit, OnChanges {
  @Input() contactDetails: ContactDetails;
  @Input() request = new ModifyContactRequest();
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactDetails && changes.contactDetails.currentValue) {
      this.contactDetails = changes.contactDetails.currentValue;
    }
    if (changes.request && changes.request.currentValue) {
      this.request = changes.request.currentValue;
    }
  }

  getISDCode() {
    let prefixes = '';
    Object.keys(ISD_CODE_PREFIX).forEach(key => {
      if (key === this.contactDetails?.mobileNo?.isdCodePrimary) {
        prefixes = ISD_CODE_PREFIX[key];
      }
    });
    return prefixes;
  }
}
