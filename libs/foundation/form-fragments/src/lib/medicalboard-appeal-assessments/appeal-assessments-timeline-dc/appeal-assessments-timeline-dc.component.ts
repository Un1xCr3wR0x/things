import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AssessmentDetails, DisabilityData, MbAllowance, MenuService, RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gosi-ui-appeal-assessments-timeline-dc',
  templateUrl: './appeal-assessments-timeline-dc.component.html',
  styleUrls: ['./appeal-assessments-timeline-dc.component.scss']
})
export class AppealAssessmentsTimelineDcComponent implements OnInit {
  @Input() previousDisabilityDetails: DisabilityData;
  @Output() onNavigate: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() navigateToAppealInfo: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() selected: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() onAssessmentIdClicked: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() onAccept: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Output() clickPaymentId: EventEmitter<AssessmentDetails> = new EventEmitter();
  @Input() isMbo: boolean;
  @Input() isContributor: boolean;
  @Input() isHoDoctor: boolean;
  @Input() isAppPublic = false;
  @Input() mbAllowanceDto: MbAllowance;
  @Input() injuryId: number;
  @Input() complicationId: number;
  @Input() isCSR = false;
  @ViewChild('paymentIdTemplate', { static: true })
  paymentIdTemplate: TemplateRef<HTMLElement>;
  bsModalRef: BsModalRef;
  eachAllowance;
  hovering = false;
  allowedAppealEarly = [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.BOARD_OFFICER];
  allowEarlyReassessment =[RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.BOARD_OFFICER,RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER]
  /**
   * Local Varaible
   */
  showEarlyReassessmentRequest = false;
  constructor(readonly bsModalService: BsModalService, readonly menuService: MenuService) {}

  ngOnInit(): void {
    if (this.injuryId || this.complicationId) {
      this.filterInjuComplList();
    }
    this.getEarlyReassessment();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.previousDisabilityDetails.currentValue) {
      this.previousDisabilityDetails = changes.previousDisabilityDetails.currentValue;
      this.getEarlyReassessment();
    }
    if ((changes && changes?.injuryId?.currentValue) || (changes && changes?.complicationId?.currentValue)) {
      this.injuryId = changes?.injuryId?.currentValue;
      this.complicationId = changes?.complicationId?.currentValue;
    }
  }
  getEarlyReassessment() {
    const index = this.previousDisabilityDetails?.data.findIndex(
      assessment => assessment?.canEarlyReq === true && assessment?.status !== 'Rejected'
    );
    if (index !== -1) {
      this.previousDisabilityDetails.data[index].showEarlyReassessmentRequest = true;
    }
  }
  disableBenefitAmount() {
    if (
      this.previousDisabilityDetails?.data[
        this.previousDisabilityDetails?.data?.findIndex(val => val?.canAppeal === true)
      ]?.showAppeal
    ) {
      this.previousDisabilityDetails.data[
        this.previousDisabilityDetails?.data?.findIndex(val => val?.canAppeal === true)
      ].benefitAmount = undefined;
    }
  }
  appeal(assessment: AssessmentDetails) {
    // this.onNavigate.emit(assessment);
    this.onNavigate.emit(assessment);
    if (this.isCSR || this.isMbo) this.disableBenefitAmount();
  }
  earlyAssessment(selectedAssessment: AssessmentDetails) {
    this.selected.emit(selectedAssessment);
  }
  onAssessmentIdClick(id: AssessmentDetails) {
    this.onAssessmentIdClicked.emit(id);
  }
  filterInjuComplList() {
    this.previousDisabilityDetails.data = this.previousDisabilityDetails.data.filter(
      val => val?.injuryId === this.injuryId || val?.injuryId === this.complicationId
    );
  }
  accept(assessment: AssessmentDetails) {
    this.onAccept.emit(assessment);
  }
  // paymentId(templateRef: TemplateRef<HTMLElement>) {
  //   this.showModal(templateRef, 'xl');
  // }
  // showModal(template: TemplateRef<HTMLElement>, size: string): void {
  //   if (template) {
  //     this.bsModalRef = this.bsModalService.show(template, Object.assign({}, { class: 'modal-' + size }));
  //   }
  // }
  paymentId(commonModalRef: TemplateRef<HTMLElement>, assessment, size?: string) {
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
    this.eachAllowance = assessment;
    this.clickPaymentId.emit(assessment);
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.bsModalRef) this.bsModalRef.hide();
  }
}
