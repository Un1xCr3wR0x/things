import { Component, Input, OnInit } from '@angular/core';
import { BilingualText, DisabilityDetails } from '@gosi-ui/core';

@Component({
  selector: 'mb-disability-details-dc',
  templateUrl: './disability-details-dc.component.html',
  styleUrls: ['./disability-details-dc.component.scss']
})
export class DisabilityDetailsDcComponent implements OnInit {
  vdYesOrNo: BilingualText;
  @Input() lang;
  @Input() disabilityDetails: DisabilityDetails;
  constructor() {}

  ngOnInit(): void {
    this.vdYesOrNo = this.disabilityDetails?.isVdRequired === true ? this.forYes : this.forNo;
  }
  forYes: BilingualText = {
    english: 'Yes',
    arabic: 'نعم'
  };
  forNo: BilingualText = {
    english: 'No',
    arabic: 'لا'
  };
}
