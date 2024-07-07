import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent, ContributorStatus, getPersonArabicName, getPersonEnglishName, Person } from '@gosi-ui/core';

class Contributor {
  person: Person;
  statusType: string;
  socialInsuranceNo: number;
}

@Component({
  selector: 'frm-name-status-dc',
  templateUrl: './name-status-dc.component.html',
  styleUrls: ['./name-status-dc.component.scss']
})
export class NameStatusDcComponent extends BaseComponent implements OnInit {
  _contributor: Contributor;
  arabicName: string;
  englishName: string;
  activeStatus = ContributorStatus.ACTIVE;
  inactiveStatus = ContributorStatus.INACTIVE;
  @Input() set contributor(cnt: Contributor) {
    this._contributor = cnt;
    this.arabicName = getPersonArabicName(cnt?.person?.name?.arabic);
    this.englishName = getPersonEnglishName(cnt?.person?.name?.english);
  }
  get contributor() {
    return this._contributor;
  }
  @Input() isBeneficiary = true;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
