import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, CoreAdjustmentService } from '@gosi-ui/core';
import { AdjustmentService } from '../../../shared';

@Component({
  selector: 'pmt-identifier-search-sc',
  templateUrl: './identifier-search-sc.component.html',
  styleUrls: ['./identifier-search-sc.component.scss']
})
export class IdentifierSearchScComponent implements OnInit {
  identifierForm: FormGroup;

  constructor(
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly adjustmentService: AdjustmentService,
    private alertService: AlertService,
    readonly coreAdjustmentService: CoreAdjustmentService
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.identifierForm = this.createSearchForm();
  }
  createSearchForm() {
    return this.fb.group({
      identifier: [null, { validators: [Validators.required], updateOn: 'blur' }]
    });
  }
  SearchAdjustment() {
    this.coreAdjustmentService.identifier = this.identifierForm.get('identifier').value;
    this.router.navigate(['/home/adjustment/adjustment-details']);
  }
}
