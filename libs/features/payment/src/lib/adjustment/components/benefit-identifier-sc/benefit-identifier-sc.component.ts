import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdjustmentService } from '../../../shared';
import { CoreAdjustmentService } from '@gosi-ui/core';

@Component({
  selector: 'pmt-benefit-identifier-sc',
  templateUrl: './benefit-identifier-sc.component.html',
  styleUrls: ['./benefit-identifier-sc.component.scss']
})
export class BenefitIdentifierScComponent implements OnInit {
  identifierForm: FormGroup;

  constructor(
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly adjustmentService: AdjustmentService,
    readonly coreAdjustmentService: CoreAdjustmentService
  ) {}

  ngOnInit(): void {
    this.identifierForm = this.createSearchForm();
  }
  createSearchForm() {
    return this.fb.group({
      identifier: [null, { validators: [Validators.required], updateOn: 'blur' }]
    });
  }
  SearchAdjustment() {
    this.coreAdjustmentService.identifier = this.identifierForm.get('identifier').value;
    this.router.navigate(['/home/adjustment/benefit-list']);
  }
}
