import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, Establishment, NationalityTypeEnum, checkBilingualTextNull } from '@gosi-ui/core';
import { EstablishmentConstants } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-re-open-establishment-dc',
  templateUrl: './re-open-establishment-dc.component.html',
  styleUrls: ['./re-open-establishment-dc.component.scss']
})
export class ReOpenEstablishmentDcComponent implements OnInit {
  gccNationality = false;
  others = false;
  saudiNationality = false;
  @Input() establishment: Establishment;
  @Input() establishmentToValidate: Establishment;
  @Input() canEdit = true;

  constructor() {}

  ngOnInit(): void {}
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.establishment?.contactDetails?.mobileNo?.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // this method is used to match the identifier corresponding to nationality
  getIdentifierType(establishmentToValidate: Establishment) {
    if (
      establishmentToValidate?.reopenEstablishment?.person &&
      establishmentToValidate?.reopenEstablishment?.person?.identity
    ) {
      if (
        establishmentToValidate?.reopenEstablishment?.person?.nationality?.english ===
        NationalityTypeEnum.SAUDI_NATIONAL
      ) {
        return (this.saudiNationality = true);
      } else if (
        EstablishmentConstants.GCC_NATIONAL.indexOf(
          establishmentToValidate?.reopenEstablishment?.person?.nationality?.english
        ) !== -1
      ) {
        return (this.gccNationality = true);
      } else {
        return (this.others = true);
      }
    }
  }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
