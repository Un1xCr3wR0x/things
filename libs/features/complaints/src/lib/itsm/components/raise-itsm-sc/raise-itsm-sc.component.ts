/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TransactionService,
  Transaction,
  ItTicketRequest,
  AlertService,
  WorkflowService,
  ItTicketResponse,
  BPMUpdateRequest,
  RouterConstants,
  WorkFlowActions,
  removeEscapeChar,
  BPMMergeUpdateParamEnum,
  ItTicketV2Request,
  DocumentItem
} from '@gosi-ui/core';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidatorRoutingService } from '../../../shared/services';
import { ComplaintConstants } from '../../../shared/constants';
import en from 'libs/foundation/form-fragments/src/assets/i18n/form-fragments/en.json';
import ar from 'libs/foundation/form-fragments/src/assets/i18n/form-fragments/ar.json';
@Component({
  selector: 'ces-raise-itsm-sc',
  templateUrl: './raise-itsm-sc.component.html',
  styleUrls: ['./raise-itsm-sc.component.scss']
})
export class RaiseItsmScComponent implements OnInit {
  /*
   * Local Variables
   */
  en: any = en;
  ar: any = ar;
  // ITSM/Saedni local variables
  incidentTypeEn = en['ITSM-INCIDENT-TYPE'];
  incidentTypeAr = ar['ITSM-INCIDENT-TYPE'];
  mainSystemEn = en['ITSM-MAIN-SYSTEM'];
  mainSystemAr = ar['ITSM-MAIN-SYSTEM'];
  problemTypeEn = en['ITSM-PROBLEM-TYPE'];
  problemTypeAr = ar['ITSM-PROBLEM-TYPE'];
  generalProblemTypeEn = en['ITSM-PROBLEM-TYPE-GENERAL'];
  generalProblemTypeAr = ar['ITSM-PROBLEM-TYPE-GENERAL'];
  ameenSystemTypeEn = en['ITSM-AMEEN'];
  ameenSystemTypeAr = ar['ITSM-AMEEN'];
  systemTypeEn = en['ITSM-SYSTEM-TYPE'];
  systemTypeAr = ar['ITSM-SYSTEM-TYPE'];
  paymentStopAr = ar['PAYMENT-STOP'];
  financialImpactAr = ar['FINANCIAL-IMPACT-HEAD'];
  itsmSeverityEn = en['ITSM-SEVERITY'];
  itsmSeverityAr = ar['ITSM-SEVERITY'];
  itsmDescriptionEn = en['ITSM-DESCRIPTION'];
  itsmDescriptionAr = ar['ITSM-DESCRIPTION'];
  itsmRequiredActionEn = en['ITSM-REQUIRED-ACTION'];
  itsmRequiredActionAr = ar['ITSM-REQUIRED-ACTION'];
  itsmErrorMessageEn = en['ITSM-ERROR-MESSAGE'];
  itsmErrorMessageAr = ar['ITSM-ERROR-MESSAGE'];
  raiseItForm: FormGroup = new FormGroup({});
  transactionSummary: Transaction;
  modalRef: BsModalRef;
  transactionLink: string;
  /**
   *
   * @param transactionService
   * @param route
   * @param router
   * @param alertService
   * @param location
   * @param workflowService
   * @param modalService
   * @param routerData
   */
  constructor(
    readonly transactionService: TransactionService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorRoutingService: ValidatorRoutingService
  ) {}
  /*
   * Method is to initialise tasks
   */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.validatorRoutingService.setRouterToken();
    if (
      this.validatorRoutingService.complaintRouterData &&
      this.validatorRoutingService.complaintRouterData.transactionTraceId
    ) {
      this.transactionService
        .getTransaction(this.validatorRoutingService.complaintRouterData.transactionTraceId)
        .subscribe((value: Transaction) => {
          this.transactionSummary = value;
        });
    } else this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /*
   * Method is to submit itsm ticket details
   */
  confirmEvent() {
    this.alertService.clearAlerts();
    this.raiseItForm.updateValueAndValidity();
    this.createApplicationLink();
    if (this.raiseItForm.valid) {
      const request: ItTicketV2Request = new ItTicketV2Request();
      if (this.raiseItForm && this.raiseItForm.value && this.raiseItForm.value.itsmForm) {
        request.type = this.raiseItForm.value.itsmForm.itsmtype.english;
        request.subtype = this.raiseItForm.value.itsmForm.itsmsubtype.english;
        request.service = this.raiseItForm.value.itsmForm.itsmsubtype2.english;
        request.paymentStop = this.raiseItForm.value.itsmForm.paymentStop.english;
        request.financialImpact = this.raiseItForm.value.itsmForm.financialImpact.english;
        this.formatDetailDescription(request);
        if(this.raiseItForm.value.itsmForm.documents.length != 0){
          request.attachmentName1 = this.raiseItForm.value.itsmForm.documents[0]?.fileName;
          request.attachmentContent1 =  this.raiseItForm.value.itsmForm.documents[0]?.documentContent;
          request.attachmentName2 = this.raiseItForm.value.itsmForm.documents[1]?.fileName;
          request.attachmentContent2 =  this.raiseItForm.value.itsmForm.documents[1]?.documentContent;
          request.attachmentName3 = this.raiseItForm.value.itsmForm.documents[2]?.fileName;
          request.attachmentContent3 =  this.raiseItForm.value.itsmForm.documents[2]?.documentContent;
        }
        this.workflowService.raiseItTicketV2(request).subscribe(
          res => {
            const itTicketResponse: ItTicketResponse = new ItTicketResponse().fromJsonToObject(res);
            if (itTicketResponse && this.validatorRoutingService.complaintRouterData) {
              const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
              bpmUpdateRequest.taskId = this.validatorRoutingService.complaintRouterData.taskId;
              bpmUpdateRequest.payload = this.validatorRoutingService.complaintRouterData.content;
              bpmUpdateRequest.outcome = WorkFlowActions.REQUEST_ITSM;
              bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ITSMNUMBER, itTicketResponse.incidentNumber);
              this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
                () => {
                  if (this.modalRef) this.modalRef.hide();
                  this.router.navigate([RouterConstants.ROUTE_INBOX]);
                  this.alertService.showSuccessByKey(ComplaintConstants.RAISE_ITSM_SUCCESS, {
                    referenceNo: this.validatorRoutingService.complaintRouterData.transactionTraceId,
                    incidentNumber: itTicketResponse.incidentNumber
                  });
                  this.validatorRoutingService.removeRouterToken();
                },
                err => {
                  if (this.modalRef) this.modalRef.hide();
                  this.alertService.showError(err.error.message);
                }
              );
            }
          },
          err => {
            if (this.modalRef) this.modalRef.hide();
            this.alertService.showError(err.error.message);
          }
        );
      }
    }
  }
 formatDetailDescription(request: ItTicketV2Request): void{
     request.detailDescription = `${this.incidentTypeEn} - ${this.incidentTypeAr}: ${this.mainSystemEn} - ${this.mainSystemAr}

     ${this.problemTypeEn} - ${this.problemTypeAr}: ${this.generalProblemTypeEn} - ${this.generalProblemTypeAr}

     ${this.mainSystemEn} - ${this.mainSystemAr}: ${this.ameenSystemTypeEn} - ${this.ameenSystemTypeAr}

     ${this.systemTypeEn} - ${this.systemTypeAr}: ${this.raiseItForm.value.itsmForm.itsmtype.english} - ${this.raiseItForm.value.itsmForm.itsmtype.arabic}

     ${this.paymentStopAr}: ${this.raiseItForm.value.itsmForm.paymentStop.english}

     ${this.financialImpactAr}: ${this.raiseItForm.value.itsmForm.financialImpact.english}

     ${this.itsmSeverityEn} - ${this.itsmSeverityAr}: ${this.raiseItForm.value.itsmForm.itsmSeverity.english}

     ${this.itsmDescriptionEn} - ${this.itsmDescriptionAr}: 
     ${removeEscapeChar(this.raiseItForm.value.itsmForm.note)}
     ${this.validatorRoutingService.complaintRouterData.transactionTraceId}
     ${this.transactionLink}

     ${this.itsmRequiredActionEn} - ${this.itsmRequiredActionAr}: 
     ${removeEscapeChar(this.raiseItForm.value.itsmForm.requiredAction)}
     
     ${this.itsmErrorMessageEn} - ${this.itsmErrorMessageAr}: ${this.raiseItForm.value.itsmForm.errorMessage.english==="Yes"
      ?this.raiseItForm.value.itsmForm.errorMessage.english+`,`+removeEscapeChar(this.raiseItForm.value.itsmForm.errorMessageText)
      :this.raiseItForm.value.itsmForm.errorMessage.english}`;
  }
  /*
   * This method is to show form validation error
   */
  showError() {
    this.alertService.showMandatoryErrorMessage();
  }
  /** This method is to trigger show modal event
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }

  createApplicationLink(){
    let applicationPrivateUrl = 'https://ameen.gosi.ins/establishment-private/#/home/transactions/view/';
    let transactionId = this.transactionSummary?.transactionId;
    let transactionReferenceNumber = this.validatorRoutingService.complaintRouterData.transactionTraceId;
    this.transactionLink = `${applicationPrivateUrl}${transactionId}/${transactionReferenceNumber}`
  }
}
