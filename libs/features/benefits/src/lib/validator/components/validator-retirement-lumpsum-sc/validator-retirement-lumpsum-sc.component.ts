import { Component, OnInit } from '@angular/core';
import { BPMMergeUpdateParamEnum, BPMUpdateRequest, Channel, ItTicketResponse, ItTicketV2Request, RouterConstants, WorkFlowActions, removeEscapeChar } from '@gosi-ui/core';
import {
  bindQueryParamsToForm,
  createDetailForm,
  createModalForm,
  isDocumentsValid,
  UITransactionType
} from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';
import { ComplaintConstants } from '@gosi-ui/features/complaints/lib/shared/constants';

@Component({
  selector: 'bnt-validator-retirement-lumpsum-sc',
  templateUrl: './validator-retirement-lumpsum-sc.component.html',
  styleUrls: ['./validator-retirement-lumpsum-sc.component.scss']
})
export class ValidatorRetirementLumpsumScComponent extends TransactionPensionBase implements OnInit {
  Channel = Channel;
  ngOnInit(): void {
    this.setBreadCrumpManually = true;
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedLumpsum = params.jailedlumpsum === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isRPALumpsum = params.rpa === 'true';
      this.isHoldBenefit = params.hold === 'true';
    });
    this.getSystemParam();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.retirementModal = createModalForm(this.fb);
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.intialiseTheView(this.routerData);
    super.getRejectionReason(this.retirementForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    this.fetchDocuments();
  }

  /** this function to fetch the documents required  */
  fetchDocuments() {
    if (this.isNonOcc) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_LUMPSUM_TRANSACTION;
    } else if (this.isJailedLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_LUMPSUM_TRANSACTION;
    } else if (this.isHazardous) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_LUMPSUM_TRANSACTION;
    } else if (this.isHeir) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_LUMPSUM_TRANSACTION;
    } else if (this.isOcc) {
      this.transactionKey = UITransactionType.REQUEST_OCC_LUMPSUM_TRANSACTION;
    } else if (this.isRPALumpsum) {
      this.transactionKey = UITransactionType.REQUEST_RPA_LUMPSUM_BENEFIT;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_LUMPSUM_BENEFIT;
    }
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNo);
  }

  getDocuments(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number,
    isBackDated = false
  ) {
    this.benefitDocumentService
      .getValidatorDocuments(
        this.socialInsuranceNo,
        benefitRequestId,
        referenceNo,
        transactionKey,
        transactionType,
        isBackDated
      )
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documentList = this.reqList;
        }
      });
  }

  raiseItsmTicket() {
    this.alertService.clearAlerts();
    this.retirementForm.updateValueAndValidity();
    if (this.retirementForm.valid) {
      const request: ItTicketV2Request = new ItTicketV2Request();
      //request.ticketNotes = removeEscapeChar(this.retirementForm.value.comments);
      //request.ticketSummary = `${this.transactionNumber} ${removeEscapeChar(this.retirementForm.value.comments)}`;
      if (this.retirementForm && this.retirementForm.value && this.retirementForm.value.itsmForm) {
        request.detailDescription = `${this.referenceNo} ${removeEscapeChar(this.retirementForm.value.comments)}`;
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
                    referenceNo: this.referenceNo,
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

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnRetirementLumpsum() {
    this.confirmReturn(this.retirementForm);
  }

  /**
   * While rejecting from validator
   */
  confirmRejectLumpsum() {
    this.confirmReject(this.retirementForm);
  }

  /**
   * Approving by the validator.
   */
  confirmApproveLumpsum() {
    this.confirmApprove(this.retirementForm);
  }
}
