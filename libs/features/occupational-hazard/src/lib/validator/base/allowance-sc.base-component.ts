/**
 * Copyright GOSI. All Rights Reserved.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Directive, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMUpdateRequest,
  Channel,
  DocumentRequiredList,
  DocumentService,
  Lov,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService,
  DocumentNameList,
  BPMMergeUpdateParamEnum,
  LanguageToken
} from '@gosi-ui/core';
import * as moment from 'moment';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  OHTransactionType,
  setWorkFlowDataForAllowance,
  setDocAlert,
  DiseaseService,
  ClaimWrapper
} from '../../shared';
import { OhBaseScComponent } from '../../shared/component/base/oh-base-sc.component';
import { dateCalculation, comments } from '../../shared/models/date';
import { OhBPMRequest } from '../../shared/models/oh-bpm-request';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Directive()
export abstract class AllowanceBaseScComponent extends OhBaseScComponent {
  regNo: number;
  sin: number;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string,  
    readonly workflowService: WorkflowService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken      
    );
    pLocation.onPopState(() => {
      this.hideModal();
    });
  }
  allAllowanceDetails = [];
  maxLengthComments = 300;
  allAllowanceList = [];
  repatriation: boolean = false;
  totalExpense = 0;
  // repatriationDifference: boolean = false;
  repatriationWrapper: ClaimWrapper;
  intialiseTheView(routerData: RouterData) {
    this.alertService.clearAlerts();
    this.reportAllowanceForm = this.createAllowanceDetailsForm();
    this.reportAllowanceModal = this.createAllowanceModalForm();
    this.bindQueryParamsToForm(routerData);
    this.ohService.setRouterData(routerData);
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.regNo = payload.registrationNo;
      this.sin = payload.socialInsuranceNo;
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.injuryId = payload.id;
      this.assignedRole = payload.assignedRole;
      this.channel = payload.channel;
      this.referenceNo = routerData.transactionId;
      this.workflowType = payload.resource;
      this.tpaCode = payload.tpaCode;
      this.tpaComments = this.routerData.comments;
      this.invoiceId = payload.invoiceId;
      this.ohService.setComplicationId(payload.id);
      this.ohService.setSocialInsuranceNo(this.sin);
      this.ohService.setRegistrationNo(this.regNo);
      this.ohService.setIdForValidatorAction(payload.id);
      this.claimsService.setTPACode(this.tpaCode);
      this.claimsService.setInvoiceId(this.invoiceId);
      this.setValidatorActions();
      this.getContributor();
      this.getEstablishment();
      this.getAllowance();
    }
    if (!this.routerData.taskId && !this.ohService.getRouterData().taskId) {
      this.navigateToInbox();
    }
  }
  receiveDocumentList(documentList) {
    if (this.documents.length > 0 && documentList.length > 0) {
      this.docAlert = setDocAlert(this.documents, documentList);
    } else if (documentList.length === 0) {
      this.docAlert = false;
    }
    this.requstedDocuments = documentList;
    this.requstedDocuments = documentList.map(({ sequence, ...item }) => item);
    const tpaDocs = new DocumentNameList();
    this.requstedDocuments.forEach(item => (tpaDocs.docName = item.english));
    if (tpaDocs.docName) {
      this.tpaRequestedDocs.push(tpaDocs);
    }
  }
  setValidatorActions() {
    const validatorActions = this.routerData.customActions;
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.APPROVE) {
        this.canApprove = true;
      }
      if (action === WorkFlowActions.REJECT) {
        this.canReject = true;
      }
      if (action === WorkFlowActions.RETURN) {
        this.canReturn = true;
      }
      if (action === WorkFlowActions.SEND_FOR_CLARIFICATION) {
        this.canRequestClarification = true;
      }
    });
    if (this.assignedRole === Role.VALIDATOR_1 && this.channel === Channel.FIELD_OFFICE) {
      this.canReturn = false;
      this.canEdit = true;
    }
  }
  updateReadStatus(ohId: number, transactionId: number) {
    this.claimsService.updateReadStatus(ohId, transactionId).subscribe();
  }
  fetchComments(ohId: number, sin: number, regNo: number, transactionId: number, isTranscation?, assignedTo?) {
    this.commentList = [];
    this.claimsService.getComments(ohId, sin, regNo, transactionId).subscribe(
      res => {
        this.receiveClarification = res;
        this.getDocuments(this.routerData.transactionId);
        if (this.receiveClarification && this.receiveClarification?.length > 0) {
          this.receiveClarification?.forEach(key => {
            this.commentList.push(comments(key, this.routerData, isTranscation, assignedTo));
          });
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getAllowance() {
    this.ohService
      .getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo)
      .subscribe(
        response => {
          this.allowanceDetailsWrapper = response;
          if(this.repatriation) {
            this.getModifiedRepatriation();
          }
          this.workDisabilityDate = this.allowanceDetailsWrapper.workDisabilityDate;
          if (this.allowanceDetailsWrapper.ohType === 0) {
            this.allowanceType = 'INJURY';
          } else if (this.allowanceDetailsWrapper.ohType === 1) {
            this.allowanceType = 'DISEASE';
          } else if (this.allowanceDetailsWrapper.ohType === 2) {
            this.allowanceType = 'COMPLICATION';
          }
          if (this.allowanceDetailsWrapper) {
            if (this.allowanceDetailsWrapper.startDate && this.allowanceDetailsWrapper.endDate) {
              const startDate = moment(this.allowanceDetailsWrapper.startDate.gregorian);
              const endDate = moment(this.allowanceDetailsWrapper.endDate.gregorian);
              this.daysDifference = endDate.diff(startDate, 'days') + 1;
            }
            if (
              this.allowanceDetailsWrapper &&
              this.allowanceDetailsWrapper.claimDetails &&
              this.allowanceDetailsWrapper.claimDetails.length > 0
            ) {
              this.allowanceDetailsWrapper.claimDetails.forEach(details => {
                details.claimItem.forEach((allowance, index) => {
                  this.getAdditionalDetails(allowance, details, index);
                });
              });
            }
          }
          if (
            this.allowanceDetailsWrapper &&
            this.allowanceDetailsWrapper.claimDetails &&
            this.allowanceDetailsWrapper.claimDetails.length > 0
          ) {
            this.allowanceDetailsWrapper.claimDetails.forEach(claim => {
              claim.claimItem.forEach(allowance => {
                this.calculationWrapper = allowance.calculationWrapper;
              });
            });
            this.allowanceDetailsWrapper?.claimDetails?.forEach((claimDetails, index) => {
              if (claimDetails.actualPaymentStatus.english === 'Invalid Wage') {
                this.isInvalidWage = true;
                if (
                  claimDetails.claimItem[0].type.english === 'InPatient Daily Allowance' ||
                  claimDetails.claimItem[0].type.english === 'OutPatient Allowance' ||
                  claimDetails.claimItem[0].type.english === 'OutPatient Daily Allowance' ||
                  claimDetails.claimItem[0].type.english === 'InPatient Daily Allowance Adjustment' ||
                  claimDetails.claimItem[0].type.english === 'OutPatient Daily Allowance Adjustment' ||
                  claimDetails.claimItem[0].type.english === 'Balance Settlement Allowance' ||
                  claimDetails.claimItem[0].type.english === 'Balance Settlement Reversal' ||
                  claimDetails.claimItem[0].type.english === 'Balance Settlement Adjustment Allowance' ||
                  (claimDetails.claimItem[0].type.english === 'Balance Settlement Reversal Adjustment' &&
                    this.allowanceDetailsWrapper?.claimDetails[index]?.claimItem.length > 0)
                ) {
                  this.allowanceDetailsWrapper.claimDetails[index].claimItem[0].isDisabled = true;
                }
              } else if (this.allowanceDetailsWrapper?.claimDetails[index]?.claimItem.length > 0) {
                this.allowanceDetailsWrapper.claimDetails[index].claimItem[0].isDisabled = false;
              }
            });
            if (this.isInvalidWage) {
              this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.ALLOWANCE.INVALID-WAGE');
            }
          }
          this.documents = this.documentFetchForAllowance(this.injuryId, this.referenceNo);
        },
        err => {
          this.showError(err);
        }
      );
  }
  getDocuments(referenceNo) {
    this.receiveClarification?.forEach((element, index) => {
      this.documentService.getOldDocuments(element?.requestId, null, null, referenceNo).subscribe(document => {
        this.receiveClarification[index].documents = document.filter(item => item.documentContent !== null);
      });
    });
  }
  documentFetchForAllowance(ohId, referenceNo) {
    this.documentService.getOldDocuments(ohId, null, null, referenceNo).subscribe(documentResponse => {
      this.documents = documentResponse.filter(item => item.documentContent !== null);
    });
    return this.documents;
  }
  requestedDocumentList() {
    let type = OHTransactionType.AUDIT_ALLOWANCE;
    if (this.invoiceId) {
      type = OHTransactionType.AUDIT_CLAIMS;
    }
    this.documentService
      .getRequiredDocuments(type, OHTransactionType.REQUEST_CLARIFICATION)
      .pipe(
        map(documentResponse => this.documentService.removeDuplicateDocs(documentResponse)),
        catchError(error => of(error))
      )
      .subscribe(documentResponse => {
        this.docItemList = documentResponse;
        if (this.docItemList) {
          if (this.docItemList.length > 0) {
            this.items = this.docItemList.map(document => {
              const lov = new Lov();
              lov.value = document.name;
              return lov;
            });
            this.documentListLov = new LovList(this.items);
            this.documentListLov.items.forEach(doc => {
              doc.sequence = this.iSequence;
              this.iSequence++;
            });
          }
        }
      });
  }
  getAdditionalDetails(allowanceItem, allowance, index) {
    this.calculationWrapper = null;
    this.getBreakUpDetails(allowance, allowanceItem, index);
    if (
      allowanceItem.type.english === 'Companion Allowance' ||
      allowanceItem.type.english === 'Companion Conveyance Allowance' ||
      allowanceItem.type.english === 'Companion Daily Allowance'
    ) {
      this.ohService.getCompanionDetails(allowance.claimId).subscribe(
        res => {
          if (this.allowanceDetailsWrapper.claimDetails) {
            allowance.claimItem[index].companionDetails = res;
            if (allowanceItem.type.english === 'Companion Daily Allowance') {
              if (
                allowance.claimItem[index].companionDetails.startDate.hijiri !==
                allowance.claimItem[index].benefitStartDate.hijiri
              ) {
                allowance.claimItem[index].calculationWrapper.benefitStartDate =
                  allowance.claimItem[index].benefitStartDate;
              }
            }
            if (
              allowance.claimItem[index].companionDetails &&
              allowance.claimItem[index].companionDetails.distanceTravelled
            ) {
              allowance.claimItem[index].companionDetails.distanceTravelled = Number(
                allowance.claimItem[index].companionDetails.distanceTravelled
              ).toString();

              if (Number(allowance.claimItem[index].companionDetails.distanceTravelled) > 100) {
                allowance.claimItem[index].companionDetails.isGreater = true;
              } else {
                allowance.claimItem[index].companionDetails.isGreater = false;
              }
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  getBreakUpDetails(allowance, allowanceItem, index) {
    this.ohService.getBreakUpDetails(allowance.claimId, allowanceItem.id).subscribe(
      res => {
        if (this.allowanceDetailsWrapper.claimDetails) {
          allowance.claimItem[index].calculationWrapper = res;
          allowance.claimItem[index].day = dateCalculation(
            allowance.claimItem[index].calculationWrapper.allowanceBreakup.startDate,
            allowance.claimItem[index].calculationWrapper.allowanceBreakup.endDate
          );
          const startDate = moment(allowance.claimItem[index].calculationWrapper.allowanceBreakup.startDate.gregorian);
          const endDate = moment(allowance.claimItem[index].calculationWrapper.allowanceBreakup.endDate.gregorian);
          allowance.claimItem[index].calculationWrapper.allowanceBreakup.differenceinDay =
            endDate.diff(startDate, 'days') + 1;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  confirmApprove() {
    const action = WorkFlowActions.APPROVE;
    this.reportAllowanceForm.get('status').setValue('APPROVE');
    this.updateCofirmation(action);
  }
  bindQueryParamsToForm(routerData: RouterData) {
    if (this.routerData) {
      this.reportAllowanceForm.get('taskId').setValue(routerData.taskId);
      this.reportAllowanceForm.get('user').setValue(routerData.assigneeId);
    }
  }
  updateCofirmation(action) {
    this.reportAllowanceForm.updateValueAndValidity();
    this.getWorkFlowType(this.routerData, false);
    const workflowData = setWorkFlowDataForAllowance(
      this.routerData,
      this.reportAllowanceModal,
      this.reportAllowanceForm,
      this.workflowRequest,
      action
    );
    workflowData.closingStatus = this.ohService.getClosingstatus();
    if (this.requstedDocuments) {
      const DocumentList = new DocumentRequiredList();
      DocumentList.requiredDocumentsList = this.requstedDocuments;
      this.ohService.validatorAction(DocumentList).subscribe(
        () => {},
        err => {
          this.showError(err);
        }
      );
    }
    this.workflowService.updateTaskWorkflow(workflowData).subscribe(
      () => {
        this.navigateToInbox(action);
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }
  updateRejection(action) {
    this.reportAllowanceForm.updateValueAndValidity();
    this.getWorkFlowType(this.routerData, false);
    const formData = this.reportAllowanceForm.getRawValue();
    const workflowData = new OhBPMRequest();
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.payload = this.routerData.content;
    workflowData.outcome = WorkFlowActions.REJECT;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
    if (action === WorkFlowActions.REJECT) {
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, formData.rejectionReason.english);
    } else if (action === WorkFlowActions.RETURN && this.requstedDocuments === null) {
      workflowData.returnReason = formData.returnReason;
    }
    if (this.requstedDocuments) {
      const DocumentList = new DocumentRequiredList();
      DocumentList.requiredDocumentsList = this.requstedDocuments;
      this.ohService.validatorAction(DocumentList).subscribe(
        () => {},
        err => {
          this.showError(err);
        }
      );
    }
    this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
      () => {
        this.navigateToInbox();
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }
  createAllowanceDetailsForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      status: [null]
    });
  }
  createAllowanceModalForm() {
    return this.fb.group({
      comments: [null, { validators: Validators.required }],
      document: this.fb.group({
        english: [''],
        arabic: ['']
      })
    });
  }
  navigateToInboxValidator() {
    this.routerData.fromJsonToObject(new RouterData());
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  navigateToInbox(action?: string) {
    this.hideModal();
    if (action === WorkFlowActions.APPROVE) {
      this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-APPROVED');
    } else if (action === WorkFlowActions.REJECT) {
      this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED');
    } else if (action === WorkFlowActions.RETURN) {
      this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-RETURNED');
    }
    this.navigateToInboxValidator();
  }
  getRouterData(routerData: RouterData) {
    if (routerData.payload) {
      this.ohService.setRouterData(routerData);
      const payload = JSON.parse(routerData.payload);
      this.tpaCode = payload.tpaCode;
      this.invoiceId = payload.id;
      this.batchItemId = payload.id;
    }
  }
  getClaimsInvoice(filterValues?) {
    this.claimsService.getInvoiceDetails(this.tpaCode, this.invoiceId, filterValues).subscribe(
      response => {
        this.invoiceDetails = response;
        this.previousInvoiceId = this.invoiceDetails.previousInvoiceId;
        this.previoustpaCode = this.invoiceDetails.previousBatchTpaCode;
        this.invoiceDetails.batchYear = moment(this.invoiceDetails.batchMonth.gregorian)
          .toDate()
          .getFullYear()
          .toString();
      },
      err => {
        this.showError(err);
      }
    );
  }
  approveWorkflow() {
    const workflowData = new BPMUpdateRequest();
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.workflowService.updateTaskWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-APPROVED');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
        this.modalRef.hide();
      },
      error => {
        this.modalRef.hide();
        this.showError(error);
      }
    );
  }
  getModifiedRepatriation() {
    this.ohService.getModifiedRepatriation(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo).subscribe((res) => {
      this.modifiedRepatriation = res;
      if(this.allowanceDetailsWrapper && this.modifiedRepatriation.modifiedDeadBodyRepatriationDto.length > 0) {
        this.modifiedRepatriation.modifiedDeadBodyRepatriationDto.forEach(element => {
          this.allowanceDetailsWrapper.claimDetails[0].claimItem.forEach(item => {
            // if(item.totalAmount !== element.amount) {
            //   this.repatriationDifference = true;
            // }
            if (item.type.english === element.claimType.english) {
              item.totalAmount = element.amount;
              this.totalExpense = this.totalExpense + item.totalAmount;
            }
          })
        })
        this.repatriationWrapper = this.allowanceDetailsWrapper;
      }
    });
 }
}

