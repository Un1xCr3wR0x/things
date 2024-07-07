/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, SimpleChanges, OnChanges,
  TemplateRef,
  Output,
  EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonIdentity,
  getIdentityByType,
  Establishment,
  getPersonNameAsBilingual,
  RouterData,
  RouterDataToken,
  RouterConstants,
  BilingualText,
  LanguageToken,
  formatDate,
  DisabilityDetails,
  DisabilityData,
  MedicalboardAssessmentService } from '@gosi-ui/core';
 import { AssessmentConstants, AssessmentDetails } from '@gosi-ui/features/medical-board';
 import { AnnuityResponseDto } from '@gosi-ui/features/payment/lib/shared';
 import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
 import { BehaviorSubject } from 'rxjs';
import { ContributorSearchResult, Injury } from '../../../shared/models';
import { DatePipe } from '@angular/common';
import { OhService } from '../../services';

@Component({
  selector: 'oh-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() contributor: ContributorSearchResult;
  @Input() showHeading = true;
  @Input() allowanceFlag: boolean;
  @Input() allowanceFlagVal: boolean;
  @Input() allowanceFlagVal2: boolean;
  @Input() allowanceFlagVal3: boolean;
  @Input() allowanceFlagVal4: boolean;
  @Input() repatriation: boolean;
  @Input() OH: boolean;

  @Input() disabilty: boolean;
  @Input() injury: Injury;
  @Input() showNonOCCDisability: boolean;
  @Input() previousDisabilityDetails: DisabilityData;
  @Input() heirDisabilityAssessment: boolean;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() injuryClosingStatus: BilingualText;
  @Input() nonOccDisabilityReassessment: boolean;
  @Input() complicationOccupation: BilingualText;
  @Input() isComplication: boolean;
  @Input() disabilityDetails: DisabilityDetails;
  @Input() isBenefitNonOcc= false;
  @Input() isMbTransaction = false;
  @Output() previousOhDetails: EventEmitter<null> = new EventEmitter();
  @Output() previousAssessmentDetails: EventEmitter<AssessmentDetails> = new EventEmitter();

  /**
   * Local variables
   */
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  socialInsuranceNo: number;
  location: BilingualText = null;
  modalRef: BsModalRef;
  cityLocation: BilingualText;
  lang: string = 'en';

  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(
    readonly ohService: OhService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly datePipe: DatePipe,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    this.setPersonDetails();
  }
  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setPersonDetails();
    if (changes && changes.establishment) {
      this.establishment = changes.establishment.currentValue;
    }
    if (changes && changes.contributor) {
      this.contributor = changes.contributor.currentValue;
      if (this.contributor) {
        const nameObj = getPersonNameAsBilingual(this.contributor.person.name);
        this.personNameEnglish = nameObj.english;
        this.personNameArabic = nameObj.arabic;
        this.socialInsuranceNo = this.contributor.socialInsuranceNo;
      }
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = changes.registrationNo.currentValue;
    }
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.contributor) {
      /**
       * getting the identity type for the contributor eg:iqama number border number
       */

      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
    }
    this.contributor
      ? (this.cityLocation = this.contributor?.person?.contactDetail?.addresses[0]?.city)
      : this.disabilityDetails
      ? (this.cityLocation = this.disabilityDetails?.city)
      : (this.cityLocation = null);
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    if (this.allowanceFlag || this.allowanceFlagVal || this.allowanceFlagVal3 || this.allowanceFlagVal4 || this.allowanceFlagVal2) {
      this.routerData.previousOwnerRole = "AdminInjury";
      this.routerData.resourceType = null;
      this.router.navigate([
        `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/injury/history/${this.contributor.socialInsuranceNo}`
      ]);
    } else {
      this.routerData.resourceType = null;
      if(this.repatriation) {
        this.routerData.previousOwnerRole = "repatriation";
      }
      this.router.navigate([
        `home/profile/individual/internal/${this.contributor.socialInsuranceNo}/occupational-hazards`
      ]);
    }
  }
  /**
   * This method is to navigate to dashboard
   */
  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
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
    }
    // const disabilityUrl =
    //   RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
    //   `/${this.contributor?.socialInsuranceNo}/${this.contributor?.person?.personId}/${
    //     eachperson?.injuryId || eachperson.benefitReqId
    //   }`;
    // this.router.navigate([disabilityUrl], { queryParams: { disabilityType: eachperson?.assessmentType?.english } });
    this.medicaAssessmentService.setIsFromOh(true);
    this.previousAssessmentDetails.emit(eachperson);

    // this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
    // this.router.navigate([`/home/medical-board/disability-assessment/view`]);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  navigateToContributor(){
    this.ohService.setIsFromValidatorPage(true);
    this.router.navigate([`/home/profile/individual/internal/${this.primaryIdentity.id}/overview`]);
  }
}
