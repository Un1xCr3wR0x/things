import { Component, OnInit } from '@angular/core';
import { bindQueryParamsToForm, createDetailForm, createModalForm } from '../../../shared';
import { TransactionPensionBase } from '@gosi-ui/features/benefits/lib/shared/component/base/transaction-pension.base';
import { BPMMergeUpdateParamEnum, BPMUpdateRequest, Channel, ItTicketResponse, ItTicketV2Request, RouterConstants, WorkFlowActions, removeEscapeChar } from '@gosi-ui/core';
import { ComplaintConstants } from '@gosi-ui/features/complaints/lib/shared/constants';

@Component({
  selector: 'bnt-validator-retirement-pension-sc',
  templateUrl: './validator-retirement-pension-sc.component.html',
  styleUrls: ['./validator-retirement-pension-sc.component.scss']
})
export class ValidatorRetirementPensionScComponent extends TransactionPensionBase implements OnInit {
  Channel = Channel;
  ngOnInit(): void {
    this.setBreadCrumpManually = true;
    this.alertService.clearAlerts();
    this.getSystemParam();
    this.setValues();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.retirementForm = createDetailForm(this.fb);
    this.retirementModal = createModalForm(this.fb);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.intialiseTheView(this.routerData);
    // this.requestId = 1005185544;
    // this.benefitRequestId = 1005185544;

    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    //this.fetchDocuments();
    this.getTransactionCompletedDocuments();
    this.showComments = false;
    this.trackTransaction(this.referenceNo);
    // no edit option in occ benefits curretly
    if (this.isOcc) {
      this.validatorCanEdit = false;
    }
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
        if (this.retirementForm?.value?.itsmForm?.documents?.value && this.retirementForm?.value?.itsmForm?.documents?.length !== 0) {
          request.attachmentName1 = this.retirementForm?.value?.itsmForm?.documents[0]?.fileName;
          request.attachmentContent1 = this.retirementForm?.value?.itsmForm?.documents[0]?.documentContent;
          request.attachmentName2 = this.retirementForm?.value?.itsmForm?.documents[1]?.fileName;
          request.attachmentContent2 = this.retirementForm?.value?.itsmForm?.documents[1]?.documentContent;
          request.attachmentName3 = this.retirementForm?.value?.itsmForm?.documents[2]?.fileName;
          request.attachmentContent3 = this.retirementForm?.value?.itsmForm?.documents[2]?.documentContent;
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
}
