import { Component, OnInit, Input } from '@angular/core';
import { BenefitTypeDetails } from '../../../../shared/models';

@Component({
  selector: 'bnt-new-benefitdetails-dc',
  templateUrl: './new-benefitdetails-dc.component.html',
  styleUrls: ['./new-benefitdetails-dc.component.scss']
})
export class NewBenefitdetailsDcComponent implements OnInit {
  constructor() {}
  @Input() benefitRecalculationDetails: BenefitTypeDetails;
  ngOnInit(): void {}
}
