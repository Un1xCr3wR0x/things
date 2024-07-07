// <!--
//   ~ Copyright GOSI. All Rights Reserved.
//   ~  This software is the proprietary information of GOSI.
//   ~  Use is subject to license terms.
//   -->
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-woman-lumpsum-benefit-dc',
  templateUrl: './woman-lumpsum-benefit-dc.component.html',
  styleUrls: ['./woman-lumpsum-benefit-dc.component.scss']
})
export class WomanLumpsumBenefitDcComponent implements OnInit {
  @Input() benefitEstimationForm: FormGroup;
  currentDate = new Date();

  constructor() {}

  ngOnInit(): void {}
}
