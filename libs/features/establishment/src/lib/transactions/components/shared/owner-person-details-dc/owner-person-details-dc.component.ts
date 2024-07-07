import { Component, Input, OnInit } from '@angular/core';
import { checkBilingualTextNull, getArabicName, NationalityTypeEnum, Person } from '@gosi-ui/core';
import { EstablishmentConstants } from '@gosi-ui/features/establishment';

@Component({
  selector: 'est-owner-person-details-dc',
  templateUrl: './owner-person-details-dc.component.html',
  styleUrls: ['./owner-person-details-dc.component.scss']
})
export class OwnerPersonDetailsDcComponent implements OnInit {
  /* Input Variables*/
  @Input() owner: Person = new Person();
  @Input() index: number;
  @Input() isGcc = false;
  @Input() showAddress = true;
  name: string;
  saudiNationality: boolean;
  gccNationality: boolean;
  others: boolean;
  constructor() {}

  ngOnInit(): void {}

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  ngAfterContentInit() {
    this.getIdentifierType();
  }

  // this method is used to match the identifier corresponding to nationality
  getIdentifierType() {
    if (this.owner && this.owner?.nationality) {
      if (this.owner?.nationality?.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.saudiNationality = true;
      } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(this.owner?.nationality?.english) !== -1) {
        this.gccNationality = true;
      } else {
        this.others = true;
      }
    }
  }

  getOwnerName(owner) {
    let ownerName = null;
    if (owner && owner.name.arabic.firstName) {
      ownerName = getArabicName(owner.name.arabic);
    }
    return ownerName;
  }

  /**
   * This method is used to return entity value if not null else empty value
   */
  orEmpty = function (entity) {
    return entity || '';
  };

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.owner?.contactDetail?.mobileNo?.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
