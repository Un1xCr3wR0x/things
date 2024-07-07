import { Component, Input, OnInit } from '@angular/core';
import { AppConstants, checkBilingualTextNull, Contributor, ContributorStatus } from '@gosi-ui/core';

@Component({
  selector: 'cnt-contributor-personal-details-dc',
  templateUrl: './contributor-personal-details-dc.component.html',
  styleUrls: ['./contributor-personal-details-dc.component.scss']
})
export class ContributorPersonalDetailsDcComponent implements OnInit {
  statusType = ContributorStatus.ACTIVE;

  constructor() {}
  @Input() contributor = new Contributor();
  @Input() canEdit;
  @Input() age: number;

  ngOnInit(): void {}

  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.contributor.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
