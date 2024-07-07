import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getPersonArabicName, getPersonEnglishName, NationalityTypeEnum } from '@gosi-ui/core';
import { Admin, EstablishmentConstants } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-transaction-super-admin-details-dc',
  templateUrl: './transaction-super-admin-details-dc.component.html',
  styleUrls: ['./transaction-super-admin-details-dc.component.scss']
})
export class TransactionSuperAdminDetailsDcComponent implements OnInit, OnChanges {
  @Input() admin: Admin;
  arabicName: string;
  englishName: string;
  saudiNationality: boolean;
  gccNationality: boolean;
  others: boolean;
  prefix: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.admin?.currentValue) {
      this.arabicName = getPersonArabicName(this.admin?.person?.name?.arabic);
      this.englishName = getPersonEnglishName(this.admin?.person?.name?.english);
      this.getIdentifierType(this.admin);
      this.getISDCodePrefix();
    }
  }

  ngOnInit(): void {}

  // this method is used to match the identifier corresponding to nationality
  getIdentifierType(admin: Admin) {
    if (admin.person && admin.person.nationality) {
      if (admin.person.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.saudiNationality = true;
      } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(admin.person.nationality.english) !== -1) {
        this.gccNationality = true;
      } else {
        this.others = true;
      }
    }
  }

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    this.prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.admin.person.contactDetail.mobileNo.isdCodePrimary) {
        this.prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
  }
}
