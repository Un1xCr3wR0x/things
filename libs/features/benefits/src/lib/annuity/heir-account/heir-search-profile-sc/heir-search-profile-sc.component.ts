/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { SearchPersonComponent } from '../../../shared/component/base/search-person-base.component';
import { FormGroup, Validators } from '@angular/forms';
import { BenefitConstants } from '../../../shared/constants';

@Component({
  selector: 'bnt-heir-search-profile-sc',
  templateUrl: './heir-search-profile-sc.component.html',
  styleUrls: ['./heir-search-profile-sc.component.scss']
})
export class HeirSearchProfileScComponent extends SearchPersonComponent implements OnInit {
  //Local Variables
  verifyHeirForm: FormGroup;

  ngOnInit(): void {
    this.verifyHeirForm = this.fb.group({
      heirIdentificationNo: [null, { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  // this function is called when user click the  search button
  searchHeir() {
    this.heirId = this.verifyHeirForm.get('heirIdentificationNo').value;
    this.router.navigate([BenefitConstants.ROUTE_LINKED_CONTRIBUTORS], {
      queryParams: {
        heirId: this.heirId
      }
    });
  }
}
