import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-lumpsum-return-details-dc',
  templateUrl: './lumpsum-return-details-dc.component.html',
  styleUrls: ['./lumpsum-return-details-dc.component.scss']
})
export class LumpsumReturnDetailsDcComponent implements OnInit {
  @Input() returnBenefitDetails;
  @Input() pageName: string;
  @Input() returnLumpsumDetails;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
