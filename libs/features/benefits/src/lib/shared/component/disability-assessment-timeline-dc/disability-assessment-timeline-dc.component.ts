/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BenefitType } from '../../enum';
import { AssessmentDetails, InjuryDetails } from '../../models';
import { CoreBenefitService, MbAllowance, formatDate } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'bnt-disability-assessment-timeline-dc',
  templateUrl: './disability-assessment-timeline-dc.component.html',
  styleUrls: ['./disability-assessment-timeline-dc.component.scss']
})
export class DisabilityAssessmentTimelineDcComponent implements OnInit, OnChanges {
  assessments = [];
  isOcc = false;
  isNonOcc = false;
  assessmentWarningMessage = null;
  bsModalRef: BsModalRef;
  @Input() disabilityDetails: InjuryDetails[] = [];
  @Input() benefitType: string;
  @Input() lang = 'en';
  @Input() headingRequired = false;
  @Input() isIndividualApp = false;
  @Input() mbAllowanceDto: MbAllowance;
  @Output() accept: EventEmitter<number> = new EventEmitter();
  @Output() appeal: EventEmitter<{ assessmentId: number; isAssessment: boolean }> = new EventEmitter();
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() onInjuryIdClicked: EventEmitter<null> = new EventEmitter();
  @Output() onNavigateDisabilityAssessment: EventEmitter<InjuryDetails> = new EventEmitter();
  @Output() clickPaymentId: EventEmitter<InjuryDetails> = new EventEmitter();
  constructor(readonly coreBenefitService: CoreBenefitService,readonly bsModalService: BsModalService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.benefitType === BenefitType.occPension || this.benefitType === BenefitType.occLumpsum) this.isOcc = true;
    else if (this.benefitType === BenefitType.nonOccPensionBenefitType) this.isNonOcc = true;
    if (changes && changes.disabilityDetails) {
      this.disabilityDetails = changes.disabilityDetails.currentValue;
      this.setAssessmentWaringMessage(this.disabilityDetails);
    }
  }
  acceptAssessment(assessmentId: number) {
    if (assessmentId) {
      this.accept.emit(assessmentId);
    }
  }
  setAssessmentWaringMessage(disabilityDetails) {
    if (
      disabilityDetails.findIndex(
        assessment =>
          (assessment?.recordStatus === 'Processed' || assessment?.recordStatus === 'New') && !this.isIndividualApp
      ) >= 0
    ) {
      this.assessmentWarningMessage = {
        english:
          'The decision of the Primary Medical Committee has been approved by the GOSI and subject to objection by the contributor/beneficiary within (21) working days from the date of its issuance, please note that objection to the decision results in the case will be fully studied by the Appeal Medical Committee not just the causes of the objection.',
        arabic:
          'تم اعتماد قرار اللجنة الطبية الابتدائية من قبل المؤسسة العامة للتأمينات الاجتماعية وهو قابل للاعتراض من قبل المشترك/ المستفيد خلال (21) يوم عمل من تاريخ صدوره، علماً بأن الاعتراض على القرار يترتب عليه دراسة الحالة من قبل اللجنة الطبية الاستئنافية بشكل كامل وليس جزئيات الاعتراض فقط.'
      };
    }
    if (disabilityDetails?.findIndex(assessment => assessment?.isReassessment && !this.isIndividualApp) >= 0) {
      this.assessmentWarningMessage = {
        english: 'To Request early Reassessment, please click on the assessment id and navigate to Medical Board page',
        arabic: 'لطلب إعادة التقييم المبكر، يرجى النقر على معرف التقييم  للانتقال إلى صفحة اللجنة الطبية'
      };
    }
    if (disabilityDetails?.findIndex(assessment => assessment?.isWithdrawAppeal && !this.isIndividualApp) >= 0) {
      this.assessmentWarningMessage = {
        english: 'To withdraw appeal , Please click on the assessment id and navigate to Medical Board page',
        arabic: 'لسحب الاستئناف، يرجى النقر على معرف التقييم  للانتقال إلى صفحة اللجنة الطبية  '
      };
    }
  }

  appealAssessment(assessmentId: number, isAssessment: boolean) {
    this.appeal.emit({ assessmentId: assessmentId, isAssessment: isAssessment });
  }
  navigateToDisabilityAssessment(assessment) {
    this.onNavigateDisabilityAssessment.emit(assessment);
  }
  raiseAppeal() {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
  close() {
    this.closeModal.emit();
  }
  onNavigateToInjuryDetails(injuryId: number) {
    this.coreBenefitService.setInjuryId(injuryId);
    this.onInjuryIdClicked.emit();
  }
  paymentId(commonModalRef: TemplateRef<HTMLElement>, assessment:InjuryDetails, size?: string) {
    this.bsModalRef = this.bsModalService.show(
      commonModalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'xl'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
    this.clickPaymentId.emit(assessment);
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.bsModalRef) this.bsModalRef.hide();
  }
}
