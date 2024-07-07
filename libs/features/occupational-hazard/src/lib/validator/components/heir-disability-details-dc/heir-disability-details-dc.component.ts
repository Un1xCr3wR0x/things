/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BenefitConstants, ContributorSearchResult } from '@gosi-ui/features/benefits/lib/shared';
import { AssessmentConstants, AssessmentDetails } from '@gosi-ui/features/medical-board';
import { AnnuityResponseDto } from '@gosi-ui/features/payment/lib/shared/models/annuity-responsedto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DisabilityDetails } from '../../../shared';
import { RouterConstants } from '@gosi-ui/core/lib/constants/router-constants';
import { PersonalInformation } from '@gosi-ui/features/contributor';
import { getIdentityByType, getPersonNameAsBilingual } from '@gosi-ui/core';

@Component({
  selector: 'oh-heir-disability-details-dc',
  templateUrl: './heir-disability-details-dc.component.html',
  styleUrls: ['./heir-disability-details-dc.component.scss']
})
export class HeirDisabilityDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Input() heirDisabilityAssessment: boolean;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() contributor: ContributorSearchResult;
  @Input() dependentDisabilityAssessment: boolean;
  @Input() dependentDisability: boolean;
  @Input() PersonalInformation: PersonalInformation;
  @Input() isBenefitNonOcc= false;
  /**
   * output  variables
   */
  @Output() previousOhDetails: EventEmitter<null> = new EventEmitter();
  @Output() onAssessmentIdClicked: EventEmitter<AssessmentDetails> = new EventEmitter();

  /**
   * local variables
   */
  socialInsuranceNo: number;
  modalRef: BsModalRef;
  personNameEnglish: string;
  personNameArabic: string;

  constructor(readonly router: Router, readonly modalService: BsModalService) {}

  ngOnInit(): void {
    if (this.contributor) {
      this.socialInsuranceNo = this.contributor.socialInsuranceNo;
    }
    if (this.PersonalInformation) {
      const nameObj = getPersonNameAsBilingual(this.PersonalInformation.name);
      this.personNameEnglish = nameObj.english;
      this.personNameArabic = nameObj.arabic;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.PersonalInformation) {
      const nameObj = getPersonNameAsBilingual(this.PersonalInformation.name);
      this.personNameEnglish = nameObj.english;
      this.personNameArabic = nameObj.arabic;
    }
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }
  hideModal() {
    this.modalRef.hide();
  }
  viewAssessmentById(eachperson: AssessmentDetails) {
    if (eachperson.assessmentId) {
      this.hideModal();
      this.onAssessmentIdClicked.emit(eachperson);
    }
    // const disabilityUrl =
    //   RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
    //   `/${this.contributor?.socialInsuranceNo}/${this.contributor?.person?.personId}/${
    //     eachperson?.injuryId || eachperson.benefitReqId
    //   }`;
    // this.router.navigate([disabilityUrl], { queryParams: { disabilityType: eachperson?.assessmentType?.english } });
    // this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  /**
   * This method is to route to benefit details
   */
  navigateToHeirDetails() {
    this.socialInsuranceNo = this.contributor.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)]);
  }
  getHeirIdentity() {
    return getIdentityByType(this.PersonalInformation?.identity, this.PersonalInformation?.nationality?.english)?.id;
  }
}
