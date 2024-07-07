import { Component, Input, OnInit } from '@angular/core';
import { BeneficiaryInfo } from '../../../models/individual/beneficiary-info';

@Component({
  selector: 'fea-individual-beneficiary-dc',
  templateUrl: './individual-beneficiary-dc.component.html',
  styleUrls: ['./individual-beneficiary-dc.component.scss']
})
export class IndividualBeneficiaryDcComponent implements OnInit {
  @Input() beneficiaryInfo: BeneficiaryInfo;

  constructor() {}

  ngOnInit(): void {}
}
