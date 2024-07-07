import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-bnt-annuities-estimation-dc',
  templateUrl: './bnt-annuities-estimation-dc.component.html',
  styleUrls: ['./bnt-annuities-estimation-dc.component.scss']
})
export class BntAnnuitiesEstimationDcComponent implements OnInit {
  benefitEstimationForm: FormGroup;
  avgWage = '2500 SAR';
  paymentType = 'years';
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.benefitEstimationForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      imprisonmentDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      contributionStopDate: this.fb.group({
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

  paymentTypeChange(paymentType) {
    if (paymentType === 'years') {
      this.paymentType = 'years';
    } else if (paymentType === 'months') {
      this.paymentType = 'months';
    }
  }
}
