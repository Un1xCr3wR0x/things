// <!--
//   ~ Copyright GOSI. All Rights Reserved.
//   ~  This software is the proprietary information of GOSI.
//   ~  Use is subject to license terms.
//   -->
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'bnt-jailed-contributor-benefit-dc',
  templateUrl: './jailed-contributor-benefit-dc.component.html',
  styleUrls: ['./jailed-contributor-benefit-dc.component.scss']
})
export class JailedContributorBenefitDcComponent implements OnInit {
  @Input() benefitEstimationForm: FormGroup;
  currentDate = new Date();

  constructor() {}

  ngOnInit() {}
}
