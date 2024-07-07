/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  bindToObject, Channel,
  DocumentItem,
  DocumentService,
  getPersonNameAsBilingual,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken, scrollToTop,
  TransactionReferenceData,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared';
import { ContributorConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { ContributorBPMRequest, Establishment, SystemParameter } from '../../../shared/models';
import {DocumentType} from "@gosi-ui/core/lib/enums/document-type";

@Component({
  selector: 'cnt-e-inspection-sc',
  templateUrl: './e-inspection-sc.component.html',
  styleUrls: ['./e-inspection-sc.component.scss']
})
export class EInspectionScComponent implements OnInit {
  currentLang;
  documents;
  establishmentDetails;
  personDetails;
  engagementDetails;
  registrationNumber;
  socialInsuranceNumber;
  engagementId;
  payload;
  requestId;
  violationDetails;
  workFlowDetails;
  referanceNumber = null;
  state;
  transaction;
  types;
  taskId: string = undefined;
  isUnclaimed: boolean;
  personName: BilingualText;
  transactionRefData: TransactionReferenceData[];
  uuid: string;
  isAnyDoc = false;
  systemParams: SystemParameter;
  isBillBatch = false;
  isModifyCoverage = false;
  isKashefChannel: boolean = false;
  constructor(
    private alertService: AlertService,
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private uuidGeneratorService: UuidGeneratorService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.currentLang = lang;
    });
    this.setRouterData();
    this.getEstablishment();
    this.getContributor();
    this.getViolationRequest();
    this.getUuid();
    this.getSystemParameters();
  }
  getUuid() {
    this.uuid = this.uuidGeneratorService.getUuid();
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
      if (this.systemParams.BILL_BATCH_INDICATOR === 1) {
        this.alertService.setInfoByKey('CONTRIBUTOR.SERVICE-MAINTANACE');
        this.isBillBatch = true;
      }
    });
  }
  /**
   * Method to get contributor details
   */
  getContributor() {
    this.contributorService.getContributor(this.registrationNumber, this.socialInsuranceNumber).subscribe(data => {
      this.personDetails = data;
    });
  }
  /** Method to get establishment details*/
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNumber).subscribe(data => {
      this.establishmentDetails = bindToObject(new Establishment(), data);
    });
  }
  getEngagement(engagementId) {
    this.engagementService
      .getEngagementDetails(this.registrationNumber, this.socialInsuranceNumber, engagementId)
      .subscribe(data => {
        this.engagementDetails = data;
      });
  }
  setRouterData() {
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);

      this.registrationNumber = this.payload.registrationNo;
      this.socialInsuranceNumber = this.payload.socialInsuranceNo;
      this.requestId = this.payload.requestId;
      this.referanceNumber = parseInt(this.payload.referenceNo, 10);
      this.state = this.payload?.previousOutcome;
      this.taskId = this.routerDataToken.taskId;
      this.isUnclaimed = this.payload?.isPool;
      this.isKashefChannel = this.payload?.roleId === Channel.KASHEF;
    }
    this.transactionRefData = this.routerDataToken.comments;
  }
  getViolationRequest() {
    this.contractAuthenticationService.getViolationRequest(this.registrationNumber, this.requestId).subscribe(data => {
      this.violationDetails = data;
      this.getEngagement(data['engagementId']);
      if (data['violationType'] && data['violationType']['english'] === 'Cancel Engagement') {
        this.transaction = DocumentTransactionId.CANCEL_ENGAGEMENT_VIOLATION;
        this.types = [DocumentTransactionType.CANCEL_ENGAGEMENT_VIOLATION];
      } else if (data['violationSubType'] && data['violationSubType']['english'] === 'Modify Leaving Date') {
        this.transaction = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
        this.types = [DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_LEAVING_DATE];
      } else if (data['violationSubType'] && data['violationSubType']['english'] === 'Modify Joining Date') {
        this.transaction = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
        this.types = [DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE];
      } else if (data['violationType'] && data['violationType']['english'] === 'Terminate Engagement') {
        this.transaction = DocumentTransactionId.TERMINATE_ENGAGEMENT_VIOLATION;
        this.types = [DocumentTransactionType.TERMINATE_ENGAGEMENT_VIOLATION];
      } else if (data['violationType'] && data['violationSubType']['english'] === 'Modify Wage And Occupation') {
        this.transaction = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
        this.types = [DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_UPDATE_WAGE];
        this.isModifyCoverage = true;
      }
      if (this.transaction && this.types) {
        this.getRequiredDocument(this.transaction, this.types, this.state === WorkFlowActions.RETURN, this.requestId);
      }
    });
  }
  /* Method to update theworkflow */
  updateWorkFlow(userInput) {
    const workflowData = new ContributorBPMRequest();
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = userInput.action;
    workflowData.comments = userInput.comments;
    const isValid: boolean = this.isKashefChannel ? this.checkDocuments() : this.isAtleastOneUploaded(this.documents)
    if ((this.documents && isValid) || userInput.action === WorkFlowActions.APPROVE) {
      this.workflowService.updateTaskWorkflow(workflowData).subscribe(
        res => {
          if (res) {
            this.getInspectionSuccessMessage(workflowData.outcome);
            this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      if(this.isKashefChannel) {
        this.showMandatoryFieldsError()
      } else {
        this.alertService.showErrorByKey('CONTRIBUTOR.COMPLIANCE.ATLEAST-ONE_DOC');
      }
    }
  }
  /** Method to get required document list. */
  getRequiredDocument(workFLowType: string, transactionType: string[], isRefreshRequired = false, requestId) {
    this.documentService.getRequiredDocuments(workFLowType, transactionType).subscribe(
      res => {
        this.documents = this.documentService.removeDuplicateDocs(res);
        if (isRefreshRequired)
          this.documents.forEach(doc => {
            this.refreshDocument(doc, workFLowType, requestId);
          });
        this.filterDocumentBasedOnKashef()
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem, workFlowType, requestId) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, requestId !== undefined ? requestId : null, workFlowType, null, this.referanceNumber)
        .subscribe(res => {
          doc = res;
          if (!this.isAnyDoc && doc?.documentContent) {
            this.isAnyDoc = true;
          }
        });
    }
  }
  isAtleastOneUploaded(doc: DocumentItem[]) {
    doc.forEach((docItem: DocumentItem) => {
      docItem?.documentContent ? (docItem.uploaded = true) : (docItem.uploaded = false);
    });
    return doc.some(d => d.uploaded);
  }
  cancelInspection() {
    this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
  }
  /*Methode to successmessage after workflow save  **/
  getInspectionSuccessMessage(action: string) {
    let message: string;
    if (action === WorkFlowActions.APPROVE) {
      if (this.violationDetails?.violationSubType?.english === "Modify Wage And Occupation"){
        message = 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-WAGE-OCCUPATION';
      }
      else {
        message = 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-SUCCES-MESSAGE';
      }
      this.alertService.showSuccessByKey(message, null, 15);
    } else if (action === WorkFlowActions.REJECT) {
      let rejectMessage: string;
      const transactionId = this.routerDataToken.transactionId;
      if (this.violationDetails?.violationType?.english === 'Cancel Engagement') {
        rejectMessage = ContributorConstants.EST_ADMIN_DISAGREE_CANCEL_INSPECTION;
      } else if (this.violationDetails?.violationType?.english === 'Modify Engagement') {
        rejectMessage = ContributorConstants.EST_ADMIN_DISAGREE_MODIFY_INSPECTION;
      } else if (this.violationDetails?.violationType?.english === 'Terminate Engagement') {
        rejectMessage = ContributorConstants.EST_ADMIN_DISAGREE_TERMINATE_INSPECTION;
      }
      this.personName = getPersonNameAsBilingual(this.personDetails?.person?.name);
      this.personName.english = this.personName.english ?? this.personName.arabic;
      const params = {
        personFullName: this.personName,
        transactionId: transactionId
      };
      this.alertService.showSuccessByKey(rejectMessage, params, 15);
    } else if (action === WorkFlowActions.SUBMIT) {
      message = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE';
      this.alertService.showSuccessByKey(message, null, 5);
    }
  }

  /**
   * Method to filter the doc based on kashef channel.
   */
  filterDocumentBasedOnKashef(): void {
    if(this.isKashefChannel) {
      this.documents = this.documents.filter(doc => this.getKashefDocs().includes(doc.documentTypeId))
      this.documents = this.documents.map(doc => {
        if (this.getKashefRequiredDocs().includes(doc.documentTypeId)) {
          doc.required = true;
        }
        return doc
      })
      this.documents = this.documents.sort((a,b) => b.required - a.required)
    } else {
      this.documents = this.documents.filter(doc => this.getExcludeKashefDocs().indexOf(doc.documentTypeId) == -1)
    }
  }

  /**
   * Method to get Kashef docs
   */
  getKashefDocs(): DocumentType[] {
    return [
      DocumentType.OTHERS_EXTERNAL,
      DocumentType.HEALTH_INSURANCE_EXTERNAL,
      DocumentType.EMPLOYMENT_CONTRACT_EXTERNAL,
      DocumentType.PAYROLL_DATA_EXTERNAL,
      DocumentType.ATTENDANCE_BOOK_EXTERNAL,
      DocumentType.CONTRIBUTOR_AUTHORIZATION_OR_PERMITS_EXTERNAL
    ];
  }

  /**
   * Method to get Kashef required docs
   */
  getKashefRequiredDocs(): DocumentType[] {
    return [
      DocumentType.PAYROLL_DATA_EXTERNAL,
      DocumentType.ATTENDANCE_BOOK_EXTERNAL,
      DocumentType.EMPLOYMENT_CONTRACT_EXTERNAL
    ]
  }

  /**
   * Method to exclude kashef docs
   */
  getExcludeKashefDocs(): DocumentType[] {
    return [
      DocumentType.CONTRIBUTOR_AUTHORIZATION_OR_PERMITS_EXTERNAL,
      DocumentType.OTHERS_EXTERNAL
    ]
  }

  /** Method to check documents. */
  checkDocuments(): boolean {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }

  /** Method to show mandatory fields errors. */
  showMandatoryFieldsError(): void {
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
  }
}
