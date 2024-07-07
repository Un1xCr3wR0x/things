import { Component, Input, OnInit } from '@angular/core';
import { IdentityTypeEnum, Person } from '@gosi-ui/core';

@Component({
  selector: 'cim-overview-details-dc',
  templateUrl: './overview-details-dc.component.html',
  styleUrls: ['./overview-details-dc.component.scss']
})
export class OverviewDetailsDcComponent implements OnInit {
  @Input() personDetails: Person;
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  constructor() {}

  ngOnInit(): void {}
}
