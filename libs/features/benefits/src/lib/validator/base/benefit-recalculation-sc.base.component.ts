import { ValidatorBaseScComponent } from './validator-sc.base-component';
import {
  AnnuityResponseDto,
  SanedRecalculation,
  BenefitRecalculation,
  BenefitConstants,
  SwitchTitle,
  AnnuityCalculationDetailsDcComponent,
  RecalculationEquationDcComponent,
  ActiveBenefits,
  Recalculation,
  UnemploymentResponseDto,
  setWorkFlowDataForMerge,
  BenefitCalcDetailsDcComponent,
  isOccBenefit
} from '../../shared';
import {
  BilingualText,
  WorkFlowActions,
  RouterConstants,
  assembleUserComment,
  Alert,
  ItTicketRequest,
  removeEscapeChar,
  ItTicketResponse,
  BPMUpdateRequest,
  BPMMergeUpdateParamEnum,
  ItTicketV2Request
} from '@gosi-ui/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from '@gosi-ui/core';
import { ComplaintConstants } from '@gosi-ui/features/complaints/lib/shared/constants';

export abstract class BenefitRecalculationBaseScComponent extends ValidatorBaseScComponent {
  readonly benefitConstants = BenefitConstants;
  isSaned;
  benefitDetails: AnnuityResponseDto;
  benefitRecalculationDetails: BenefitRecalculation;
  benefitSanedDetails: UnemploymentResponseDto;
  payload;
  calculationModalTitle: SwitchTitle;
  nin: number;
  payForm: FormGroup;
  recalculationAlertMessages: Alert;
  recalculationInfoMessages: BilingualText[];
  sanedRecalculationDetails: SanedRecalculation;
  selectedInspection: BilingualText;
  transactionNumber;
  retirementForm : FormGroup = new FormGroup({});


  /** Method to set router data to component variables */
  initialiseView(routerData) {
    if (routerData.payload) {
      this.payload = JSON.parse(routerData.payload);
      this.personId = this.payload.socialInsuranceNo;
      this.registrationNo = this.payload.registrationNo;
      this.requestId = this.payload.id;
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.transactionNumber = this.payload.referenceNo;
      this.referenceNo = this.payload.referenceNo;
      this.channel = this.payload.channel;
      this.taskId = routerData.taskId;
      this.user = routerData.assigneeId;
      this.transactionRefData = routerData.userComment.map(userData => {
        return assembleUserComment(userData);
      });
      this.nin = this.payload.nin;
      this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonList();
      this.returnReasonList = this.sanedBenefitService.getSanedReturnReasonList();
      this.inspectionList = this.sanedBenefitService.getSanedInspectionType();
      this.inspectionList.subscribe(inspection => {
        this.selectedInspection = inspection.items[0].value;
      });
      this.contributorService.personId = this.personId;
    }
  }
  /** Method to get benefit recalculation details */
  getBenefitRecalculation(referenceNo?: number) {
    this.manageBenefitService
      .getBenefitRecalculation(this.personId, this.requestId, referenceNo)
      .subscribe((res: BenefitRecalculation) => {
        this.benefitRecalculationDetails = res;
        if (this.payForm && this.payForm.get('checkBoxFlag'))
          this.payForm.get('checkBoxFlag').setValue(this.benefitRecalculationDetails?.directPaymentStatus);
        this.recalculationInfoMessages = res?.infoMessages;
        this.disableApprove = this.recalculationInfoMessages && this.recalculationInfoMessages?.length > 0;
        this.recalculationAlertMessages = this.adjustmentPaymentService.mapMessagesToAlert({
          details: this.recalculationInfoMessages,
          message: null
        });
      });
  }
  /**
   * Method to get benefit details
   */
  getBenefits() {
    this.manageBenefitService.getBenefitDetails(this.personId, this.requestId).subscribe(res => {
      this.benefitDetails = res;
      this.contributorService.selectedSIN = res?.personId;
    });
  }
  /** Method to open Recalculation wage modal */
  howToCalculate(calculationPeriod) {
    if (this.isOccBenefit) {
      this.commonModalRef = this.modalService.show(
        BenefitCalcDetailsDcComponent,
        Object.assign({}, { class: 'modal-xl' })
      );
    } else {
      this.commonModalRef = this.modalService.show(
        AnnuityCalculationDetailsDcComponent,
        Object.assign({}, { class: 'modal-xl' })
      );
    }
    this.commonModalRef.content.benefitRecalculationDetails = this.benefitRecalculationDetails;
    this.commonModalRef.content.benefitCalculationDetails = this.benefitRecalculationDetails;
    this.commonModalRef.content.averageMonthlyWagePeriods = this.benefitRecalculationDetails?.averageMonthlyWagePeriods;
    this.commonModalRef.content.oldAverageMonthlyWagePeriods =
      this.benefitRecalculationDetails?.oldAverageMonthlyWagePeriods;
    this.commonModalRef.content.lang = this.lang;
    this.commonModalRef.content.isLumpsum =
      this.benefitRecalculationDetails?.changeInEngagementRecalculationDetails?.newBenefitDetails?.benefitConversionType?.includes(
        'Pension to Lumpsum'
      ) || this.benefitRecalculationDetails?.newBenefitDetails?.benefitConversionType?.includes('Lumpsum to Lumpsum');
    this.commonModalRef.content.isRecalculation = true;
    this.commonModalRef.content.isSaned = false;
    if (this.commonModalRef)
      this.commonModalRef.content.close.subscribe(() => {
        this.commonModalRef.hide();
      });
  }
  /** Method to navigate to Contributor */
  viewContributorInfo() {
    this.routerData.stopNavigationToValidator = true;
    this.routerData.assignedRole = null;
    // this.router.navigate([`home/profile/contributor/${this.personId}/info`]);
    this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.personId)], {
      state: { loadPageWithLabel: 'PERSONAL-DETAILS' }
    });
  }
  /** Method  to  navigate  to  change  engagement */
  viewChangeEngagement(traceId) {
    const newRouterData = {
      ...this.routerData,
      payload: JSON.stringify({
        ...JSON.parse(this.routerData.payload),
        engagementId: this.sanedRecalculationDetails?.engagementId || this.benefitRecalculationDetails?.engagementId,
        registrationNo:
          this.sanedRecalculationDetails?.registrationNo || this.benefitRecalculationDetails?.registrationNo,
        referenceNo:
          this.sanedRecalculationDetails?.modificationRefNo || this.benefitRecalculationDetails?.modificationRefNo
      })
    };
    // this.routerService.setRouterDataTokenOnly(newRouterData);
    this.sanedBenefitService.getTransaction(traceId).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${traceId}`]);
    });
  }
  /** Method to navigate to payment history */
  viewPaymentHistory(benefit, benefitType) {
    this.adjustmentPaymentService.identifier = this.requestId;
    this.adjustmentPaymentService.benefitType = benefitType?.english;
    this.adjustmentPaymentService.benefitDetails = benefit;
    this.contributorService.personId = this.benefitDetails?.personId;
    this.coreBenefitService.setActiveBenefit(
      new ActiveBenefits(this.personId, this.requestId, benefitType, this.referenceNo)
    );
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment(benefitParam) {
    this.adjustmentPaymentService.identifier = this.benefitDetails?.personId || this.benefitSanedDetails?.personId;
    this.adjustmentPaymentService.sin = this.personId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: benefitParam } });
  }
  /** Method to approve benefit with payment status */
  approvePaymentBenefitInspection(form) {
    if (this.payload.assignedRole === Role.VALIDATOR_1 && this.benefitRecalculationDetails?.netAdjustmentAmount) {
      this.sanedBenefitService
        .editBenefitDirectPayment(this.personId, this.requestId, this.payForm.get('checkBoxFlag').value)
        .subscribe(
          () => {
            this.confirmApprove(form);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(form);
    }
  }
  /** Method to raise itsm ticket. */
  raiseItsmTicket() {
    this.alertService.clearAlerts();
    this.retirementForm.updateValueAndValidity();
    if (this.retirementForm.valid) {
      const request: ItTicketV2Request = new ItTicketV2Request();
      //request.ticketNotes = removeEscapeChar(this.retirementForm.value.comments);
      //request.ticketSummary = `${this.transactionNumber} ${removeEscapeChar(this.retirementForm.value.comments)}`;
      if (this.retirementForm && this.retirementForm.value && this.retirementForm.value.itsmForm) {
        request.detailDescription = `${this.transactionNumber} ${removeEscapeChar(this.retirementForm.value.comments)}`;
        request.type = this.retirementForm.value.itsmForm.itsmtype.english;
        request.subtype = this.retirementForm.value.itsmForm.itsmsubtype.english;
        request.service = this.retirementForm.value.itsmForm.itsmsubtype2.english;
        request.paymentStop = this.retirementForm.value.itsmForm.paymentStop.english;
        request.financialImpact = this.retirementForm.value.itsmForm.financialImpact.english;
        if (this.retirementForm.value.itsmForm.documents?.length != 0) {
          request.attachmentName1 = this.retirementForm.value.itsmForm.documents[0]?.fileName;
          request.attachmentContent1 = this.retirementForm.value.itsmForm.documents[0]?.documentContent;
          request.attachmentName2 = this.retirementForm.value.itsmForm.documents[1]?.fileName;
          request.attachmentContent2 = this.retirementForm.value.itsmForm.documents[1]?.documentContent;
          request.attachmentName3 = this.retirementForm.value.itsmForm.documents[2]?.fileName;
          request.attachmentContent3 = this.retirementForm.value.itsmForm.documents[2]?.documentContent;
        }

        this.manageBenefitService.raiseItTicket(request).subscribe(
          res => {
            const itTicketResponse: ItTicketResponse = new ItTicketResponse().fromJsonToObject(res);
            if (itTicketResponse && this.routerData) {
              const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
              bpmUpdateRequest.taskId = this.routerData.taskId;
              bpmUpdateRequest.payload = this.routerData.content;
              bpmUpdateRequest.outcome = WorkFlowActions.REQUEST_ITSM;
              bpmUpdateRequest.user = this.routerData.assigneeId;
              bpmUpdateRequest.assignedRole = this.routerData.assignedRole;
              bpmUpdateRequest.comments = this.retirementForm.value.comments;
              bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ITSMNUMBER, itTicketResponse.incidentNumber);
              this.manageBenefitService.updateAnnuityWorkflow(bpmUpdateRequest).subscribe(
                () => {
                  //if (this.modalRef) this.modalRef.hide();
                  this.router.navigate([RouterConstants.ROUTE_INBOX]);
                  this.alertService.showSuccessByKey(ComplaintConstants.RAISE_ITSM_SUCCESS, {
                    referenceNo: this.transactionNumber,
                    incidentNumber: itTicketResponse.incidentNumber
                  });
                  //this.validatorRoutingService.removeRouterToken();
                },
                err => {
                  //if (this.modalRef) this.modalRef.hide();
                  this.alertService.showError(err.error.message);
                }
              );
            }
          },
          err => {
            // if (this.modalRef) this.modalRef.hide();
            this.alertService.showError(err.error.message);
          }
        );
      }
    }
    this.hideModal();
  }
}
