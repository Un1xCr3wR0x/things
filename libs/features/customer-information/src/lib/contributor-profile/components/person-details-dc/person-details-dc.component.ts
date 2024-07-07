import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import {
  AddressTypeEnum,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BorderNumber,
  GosiCalendar,
  IdentityTypeEnum,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { ContactDetails, EducationDetails, PersonDetails } from '../../../shared';
const ISD_CODE_PREFIX = {
  sa: '+966',
  kw: '+965',
  bh: '+973',
  om: '+968',
  qa: '+974',
  ae: '+971'
};
@Component({
  selector: 'cim-person-details-dc',
  templateUrl: './person-details-dc.component.html',
  styleUrls: ['./person-details-dc.component.scss']
})
export class PersonDetailsDcComponent implements OnInit, OnChanges {
  @Input() contributor;
  @Input() educationDetails: EducationDetails;
  @Input() contactDetails: ContactDetails;
  @Input() personDetails: PersonDetails;
  @Input() lang: string;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeNin = IdentityTypeEnum.NIN;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  typeBorder = IdentityTypeEnum.BORDER;
  rotatedeg = 90;
  gccNo: number;
  iqamaNo: number;
  expiryDate: GosiCalendar = new GosiCalendar();
  passportNo: string;
  passportExpiryDate: GosiCalendar = new GosiCalendar();
  issueDate: GosiCalendar = new GosiCalendar();
  isIndividualApp: boolean;
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.educationDetails && changes.educationDetails.currentValue) {
      this.educationDetails = changes.educationDetails.currentValue;
    }
    if (changes.contactDetails && changes.contactDetails.currentValue) {
      this.contactDetails = changes.contactDetails.currentValue;
    }
    if (changes.personDetails && changes.personDetails.currentValue) {
      this.personDetails = changes.personDetails.currentValue;
      this.personDetails?.personIdentities?.forEach((item: NIN | Iqama | NationalId | Passport | BorderNumber) => {
        if (item.idType === this.typeGcc) {
          this.gccNo = (<NationalId>item).id;
        }
        if (item.idType === this.typeIqama) {
          this.iqamaNo = (<Iqama>item).iqamaNo;
          this.expiryDate = (<Iqama>item).expiryDate;
        }
        if (item.idType === this.typePassport) {
          this.passportNo = (<Passport>item).passportNo;
          this.passportExpiryDate = (<Passport>item).expiryDate;
          this.issueDate = (<Passport>item).issueDate;
        }
      });
    }
  }
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(ISD_CODE_PREFIX).forEach(key => {
      if (key === this.contactDetails?.mobileNo?.isdCodePrimary) {
        prefix = ISD_CODE_PREFIX[key];
      }
    });
    return prefix;
  }
  navigateTo() {
    this.navigate.emit();
  }
}
