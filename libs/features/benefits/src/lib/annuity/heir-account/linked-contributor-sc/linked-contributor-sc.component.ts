/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SearchPersonComponent } from '../../../shared/component/base/search-person-base.component';
import { HeirAccountProfile } from '../../../shared/models/heir-account-profile';
import { BenefitType } from '../../../shared/enum/benefit-type';
import { EligibleAnnuityBenefit } from '../../../shared/models/eligible-annuity-benefit';
import { EligibilityRule } from '../../../shared/models/eligibility-rule';
import { ContributorDetails } from '../../../shared/models/contributor-details';
import { BenefitConstants } from '../../../shared/constants/benefit-constants';
import { LookupService } from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { ManageBenefitService, HeirBenefitService, BenefitPropertyService } from '../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { Benefits } from '../../../shared';

@Component({
  selector: 'bnt-linked-contributor-sc',
  templateUrl: './linked-contributor-sc.component.html',
  styleUrls: ['./linked-contributor-sc.component.scss']
})
export class LinkedContributorScComponent extends SearchPersonComponent implements OnInit {
  heirAccountProfile: HeirAccountProfile;
  benefitInfo: Benefits;
  typeHeirPension = BenefitType.heirPension;
  typeHeirLumpsum = BenefitType.heirLumpsum;

  benefit: EligibleAnnuityBenefit;
  eligibilityArray: EligibilityRule[];
  linkedContributorDetails: ContributorDetails[];

  modalRef: BsModalRef;
  commonModalRef: BsModalRef<Object>;

  constructor(
    readonly fb: FormBuilder,
    readonly manageBenefitService: ManageBenefitService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly location: Location,
    public route: ActivatedRoute,
    readonly heirBenefitService: HeirBenefitService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {
    super(fb, manageBenefitService, lookUpService, router);
  }

  ngOnInit(): void {
    // accessing the query params
    this.route.queryParams.subscribe(params => {
      this.heirId = params.heirId;
    });
    this.getHeirLinkedContributors(this.heirId);
  }

  /** Method to fetch heir account details*/
  getHeirLinkedContributors(id: number) {
    this.heirBenefitService.getHeirLinkedContributors(id).subscribe(res => {
      this.heirAccountProfile = res;
      if (this.heirAccountProfile && this.heirAccountProfile.linkedContributorDetails?.length > 0) {
        this.linkedContributorDetails = this.heirAccountProfile.linkedContributorDetails;
        this.linkedContributorDetails.forEach(contributor => {
          this.eligibilityArray = contributor.eligibility.eligibilityRules;
        });
      }
    });
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  hideModal() {
    this.modalRef.hide();
  }

  navigateToHeirBenefit(contributor: ContributorDetails) {
    if (contributor.eligibility.benefitType.english === BenefitType.heirPension) {
      this.benefitPropertyService.setAnnuityStatus(BenefitConstants.NEW_BENEFIT);
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          heir: true,
          sin: contributor.sin
        }
      });
    } else if (contributor.eligibility.benefitType.english === BenefitType.heirLumpsum) {
      this.benefitPropertyService.setAnnuityStatus(BenefitConstants.NEW_BENEFIT);
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
        queryParams: {
          heir: true,
          sin: contributor.sin
        }
      });
    }
  }
  navigateToLinkContributor() {
    this.router.navigate([BenefitConstants.ROUTE_REGISTER_HEIR], {
      queryParams: {
        heirId: this.heirId
      }
    });
  }
  ShowEligibilityPopup(templateRef: TemplateRef<HTMLElement>, annuitybenefits: Benefits) {
    this.benefitInfo = annuitybenefits;
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
}
