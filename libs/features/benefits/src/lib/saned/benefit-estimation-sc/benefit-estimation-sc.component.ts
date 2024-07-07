import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BilingualText, LovList, Lov } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-estimation-sc',
  templateUrl: './benefit-estimation-sc.component.html',
  styleUrls: ['./benefit-estimation-sc.component.scss']
})
export class BenefitEstimationScComponent implements OnInit {
  benefitEstimationForm: FormGroup;
  BenefitTypeList: Lov[] = [
    { sequence: 1, value: { arabic: 'Ar-Retirement Benefit', english: 'Retirement Benefit' } },
    {
      sequence: 2,
      value: { arabic: 'Ar-Non Occupational Disablity Benefit', english: 'Non Occupational Disablity Benefit' }
    },
    { sequence: 3, value: { arabic: 'Ar-Jailed Contributor Benefit', english: 'Jailed Contributor Benefit' } },
    { sequence: 4, value: { arabic: 'Ar-Woman Lumpsum', english: 'Woman Lumpsum' } }
  ];
  // selectedBenefitType: BilingualText;
  selectedBenefitType: String;

  // BenefitTypeList = [
  //   'Retirement Benefit',
  //   'Non Occupational Disablity Benefit',
  //   'Jailed Contributor Benefit',
  //   'Woman Lumpsum'
  // ];
  benefitResp;
  paymentType = 'years';
  heading: string;
  isJailedContributor = false;
  isWomanLumpsum = false;
  isAnnuityEst = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.benefitEstimationForm = this.createForm();
    this.benefitResp = {
      avgWage: '2,500 SAR'
    };
  }
  setHeading(selectedBenefit: String) {
    this.selectedBenefitType = selectedBenefit;
    if (this.selectedBenefitType === this.BenefitTypeList[0].value.english) {
      this.isAnnuityEst = true;
      this.isJailedContributor = false;
      this.heading = 'BENEFITS.RETIREMENT-BENEFIT';
    } else if (this.selectedBenefitType === this.BenefitTypeList[1].value.english) {
      this.heading = 'BENEFITS.NON-OCC-DISABILITY-BENEFIT';
    } else if (this.selectedBenefitType === this.BenefitTypeList[2].value.english) {
      this.isJailedContributor = true;
      this.isAnnuityEst = false;
      this.heading = 'BENEFITS.JAILED-CONTRIBUTOR-BENEFIT';
    } else {
      this.isWomanLumpsum = true;
      this.isJailedContributor = false;
      this.isAnnuityEst = false;
      this.heading = 'BENEFITS.WOMAN-LUMPSUM';
    }
  }
  createForm() {
    return this.fb.group({
      imprisonmentDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      dateOfRelease: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      numberOfDependents: new FormControl(0),
      numberOfContributions: new FormControl(0),
      expectedAnnualWageHike: new FormControl(0),
      benefitType: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  selectBenefitType() {}
}
