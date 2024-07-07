import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { BilingualText, RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessedDoctorDetails, AssessmentDetail, AssessmentDetails, Contributor, DisabilityDetails } from '../../shared/models';
import { Router } from '@angular/router';
import { MbRouteConstants } from '../../shared';

@Component({
  selector: 'mb-tracking-assessment-details-dc',
  templateUrl: './tracking-assessment-details-dc.component.html',
  styleUrls: ['./tracking-assessment-details-dc.component.scss']
})
export class TrackingAssessmentDetailsDcComponent implements OnInit, OnChanges {

  limitvalue: number;
  limit = 100;
  readMore = false;
  showMoreText = 'MEDICAL-BOARD.READ-FULL-DESCRIPTION';
  helperRequired = false;
  helperReasons: BilingualText[];
  disabledBodyPartList: BilingualText[];
  disabledBodyPart: BilingualText;
  modalRef: BsModalRef;
  identificationNo: number;
  modifiedHelperReasons: BilingualText[];
  allowEarlyReassessment = [
    RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
    RoleIdEnum.BOARD_OFFICER,
    RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER
  ];

  @Input() isGosiDoctor = false;
  @Input() assessmentDetails: AssessmentDetail;
  @Input() isValidatorView = true;
  @Input() lang = 'en';
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Input() contributor: Contributor;
  @Input() ambTransaction = false;
  // @Input() socialInsuranceNo: number;
  // @Input() personId: number;
  @Input() isIndividalApp = false;
  @Input() isMbo: boolean;
  @Input() isContributor: boolean;
  @Input() singleAssessmentDetail: AssessmentDetails;
  @Input() isCSR = false;
  @Input() isHoDoctor = false;
  @Input() isGosiDrShow = false;
  @Input() hoDoctor = false;

  @Output() navigateToGosiDoctorEdit: EventEmitter<number> = new EventEmitter();
  @Output() onShowMBAssessmentClicked = new EventEmitter<null>();
  @Output() onOHClicked = new EventEmitter<null>();
  @Output() onInjuryIdClicked = new EventEmitter<null>();
  @Output() onNavigate: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() navigateToAppealInfo: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() selected: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() onAssessmentIdClicked: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() onAccept: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() benefitIdClick: EventEmitter<number> = new EventEmitter();
  constructor(readonly router: Router, readonly modalService: BsModalService) { }

  ngOnInit(): void {
    this.limitvalue = this.limit;
    this.disableBenefitAmount(); // disable benefit amount if appealed
  }
  ngOnChanges() {
    if (this.assessmentDetails) {
      if (this.assessmentDetails?.disabilityPercentage >= 50) {
        this.helperRequired = true;
      }
      if (this.assessmentDetails?.reasonForHelper) this.getReasonForHelper(this.assessmentDetails?.reasonForHelper);

      if (this.assessmentDetails?.modifiedDetails?.reasonForHelper) this.getModifiedHelperReasons(this.assessmentDetails?.modifiedDetails?.reasonForHelper);
      if (this.assessmentDetails?.bodyPartsList?.length > 0 && this.assessmentDetails?.bodyPartsList[0]?.bodyParts) {
        this.assessmentDetails?.bodyPartsList[0]?.bodyParts.forEach(bodyPart => {
          this.disabledBodyPart = bodyPart;
        });
      }
    }
  }
  gosiDoctorEdit() {
    this.navigateToGosiDoctorEdit.emit();
  }
  getSpeciality(speciality: BilingualText[]) {
    if (speciality && speciality.length > 0)
      return this.lang === 'en'
        ? speciality.map(item => item.english).join(',')
        : speciality.map(item => item.arabic).join(',');
  }
  getBodyParts(bodyParts: BilingualText[]) {
    if (bodyParts && bodyParts.length > 0)
      return this.lang === 'en'
        ? bodyParts.map(item => item.english).join(',')
        : bodyParts.map(item => item.arabic).join(',');
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.readMore = !this.readMore;
    this.limit = this.limitvalue;
    this.showMoreText = this.showMoreText;
    this.modalRef = this.modalService?.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  navigateToDoctor(details: AssessedDoctorDetails) {
    this.identificationNo = details?.identifier;
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }
  navigateToDoctorProfile() {
    this.identificationNo = this.assessmentDetails?.primaryGosiDr?.identifier;
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(TemplateValue, Object.assign({}, { class: 'modal-xl' }));
  }
  getDescriptionString(caseArr: string[]): string {
    if (caseArr) return caseArr?.toString();
    else return '';
  }
  appeal(singleAssessmentDetail: AssessmentDetails) {
    this.onNavigate.emit(singleAssessmentDetail);
  }
  earlyReAssessment(singleAssessmentDetail: AssessmentDetails) {
    this.selected.emit(singleAssessmentDetail);
  }
  onAssessmentIdClick(id: AssessmentDetails) {
    this.onAssessmentIdClicked.emit(id);
    this.hideModal();
  }

  accept(singleAssessmentDetail: AssessmentDetails) {
    this.onAccept.emit(singleAssessmentDetail);
  }
  showForNonOcc() {
    switch (this.assessmentDetails?.assessmentType?.english) {
      case 'Non-Occupational Disability Reassessment':
      case 'Heir Disability Reassessment':
      case 'Dependent Disability Reassessment':
      case 'Non-Occupational Disability':
      case 'Heir Disability':
      case 'Dependent Disability':
        return true;
      default:
        return false;
    }
  }
  disableBenefitAmount() {
    if (this.singleAssessmentDetail?.canWithdraw) {
      this.singleAssessmentDetail.benefitAmount = undefined;
    }
  }
  getReasonForHelper(reason: BilingualText[]) {
    if (reason) {
      reason.forEach(items => {
        this.helperReasons.push(items);
        return this.helperReasons;
      });
    }
  }
  getModifiedHelperReasons(reason: BilingualText[]) {
    if (reason) {
      reason.forEach(items => {
        this.modifiedHelperReasons.push(items);
        return this.modifiedHelperReasons;
      });
    }
  }
}