import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentConstants } from '@gosi-ui/features/payment/lib/shared/constants';
import { Router } from '@angular/router';
import { AlertService } from '@gosi-ui/core';

@Component({
  selector: 'pmt-heir-search-profile-sc',
  templateUrl: './contributor-search-sc.component.html',
  styleUrls: ['./contributor-search-sc.component.scss']
})
export class ContributorSearchScComponent implements OnInit {
  //Local Variables
  verifyBeneficiaryForm: FormGroup;
  identifier: number;

  constructor(readonly router: Router, readonly fb: FormBuilder, readonly alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.verifyBeneficiaryForm = this.createSearchForm();
  }

  createSearchForm() {
    return this.fb.group({
      identifier: [null, { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  // this function is called when user click the  search button
  searchBeneficiary() {
    this.identifier = this.verifyBeneficiaryForm.get('identifier').value;
    this.router.navigate([PaymentConstants.ROUTE_PAY_ONLINE], {
      queryParams: {
        identifier: this.identifier
      }
    });
  }
}
