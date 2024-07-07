import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, Establishment } from '@gosi-ui/core';
import { EstablishmentTypeEnum } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-establishment-registration-details-dc',
  templateUrl: './establishment-registration-details-dc.component.html',
  styleUrls: ['./establishment-registration-details-dc.component.scss']
})
export class EstablishmentRegistrationDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment;
  @Input() isBranch = false;
  @Input() showCrn = false;
  @Input() isGCC = false;
  @Input() isPpa = false;
  main = EstablishmentTypeEnum.MAIN;
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
}
