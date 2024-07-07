import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, BilingualText, BPMUpdateRequest, DocumentItem, DocumentService, RouterData, RouterDataToken, scrollToTop, TransactionReferenceData, WizardItem, WorkFlowActions, WorkflowService } from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { ClaimWrapper, Complication, ComplicationService, ComplicationWrapper, DocumentDcComponent, Injury, InjuryConstants, InjuryFeedback, InjuryService, InjuryWrapper, OHTransactionType, OhConstants, OhService, RouteConstants } from '../../shared';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Repatriation, RepatriationDto } from '../../shared/models/dead-body-repatriation';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'oh-repatriation-injury-sc',
  templateUrl: './repatriation-injury-sc.component.html',
  styleUrls: ['./repatriation-injury-sc.component.scss']
})
export class RepatriationInjuryScComponent implements OnInit {
  /**
   * viewchild components
   */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: DocumentDcComponent;
  /**
   * Local Variables
   */
  repatriationWizardItems: WizardItem[] = []; 
  currentTab = 0;
  totalTabs = 2;
  isApiTriggered: boolean;
  documentItem: DocumentItem[] = [];
  reqdocumentList = [];
  documentsList: BilingualText[];
  reqdocumentTemp: Partial<DocumentItem[]>;
  uploadFailed: boolean;
  isAppPrivate: boolean=false;
  isIndividualApp: boolean=false;
  // diseaseId = 1002014162;
  // diseaseTransactionId = OhConstants.DISEASE_TRANSACTION_ID;
  diseaseTransactionId = null;
  documentForm: FormGroup = new FormGroup({});
  isSelectedReasonOthers = false;
  isEdit = false;
  processType: string;
  InjurydocumentList$: Observable<DocumentItem[]>;
  registrationNo: number;
  socialInsuranceNo: number;
  injuryId: number;
  settlementId: number = null;
  transactionMessage: BilingualText;
  modalRef: BsModalRef;
  repatriationTransactionId = OhConstants.REPATRIATION_ID;
  complicationId: number;
  complicationIndicator: boolean = false;
  injuryNo: number;
  pageEmpty: boolean = false;
  allowanceDetailsWrapper: ClaimWrapper;
  referenceNo: number;
  previousOutcome: string;
  repatriationReturn: boolean = false;
  taskid: string;
  comment: TransactionReferenceData[];
  isAdminSubmit: boolean = false;
  modifiedRepatriation: RepatriationDto;
  transactionId: number;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  injury: Injury;
  complicationDetailsWrapper: ComplicationWrapper = new ComplicationWrapper();
  complicationDetails: Complication = new Complication();
  documentLists: BilingualText[];
  documentTemp: DocumentItem[];
  documentArray: DocumentItem[] = [];
  documentTempItem: DocumentItem = new DocumentItem();
  complicationDocumentList: DocumentItem[] = [];
  ReqdocumentLists = [];
  isWorkflow = false;
  feedbackdetails: InjuryFeedback = new InjuryFeedback();
  repatriation: boolean = false;

  constructor(
    readonly alertService: AlertService, readonly documentService: DocumentService,
    readonly router: Router,
    readonly ohService: OhService,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly injuryService: InjuryService,
    readonly complicationService: ComplicationService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly workflowService: WorkflowService
  ) { }
  @ViewChild('cancelInjury', { static: false })
  private cancelInjuryModal: TemplateRef<Object>;
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.currentTab = 0;
    this.repatriation = true;
    this.initializeWizardItems();
    if(this.routerData && this.routerData.resourceType !== undefined) {
      this.isAdminSubmit = true;
      const resourceType = this.routerData.resourceType;
      const channel = this.routerData.channel;
      const payload = JSON.parse(this.routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.taskid = this.routerData.taskId;
      if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
        this.comment = this.routerData.comments;
      }
      if (payload.injuryType === 'complication') {
        this.complicationId = payload.id;
        this.injuryId = payload.injuryIdentifier;
        this.complicationIndicator = true;
      } else {
        this.injuryId = payload.id;
      }
      this.injuryNo = payload?.injuryNo;
      this.referenceNo = payload.referenceNo;
      const assignedRole = payload.assignedRole;
      this.previousOutcome = payload.previousOutcome;
      this.getModifiedRepatriation();
    } else {
      this.injuryId = this.ohService.getInjuryId();
      this.registrationNo = this.ohService.getRegistrationNumber();
      this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
      this.complicationId = this.ohService.getComplicationId();
      this.injuryNo = this.ohService.getInjuryNumber();

      // for testing only - need to remove
      // this.referenceNo = 242386756;
      // this.getAllowance();
      // this.getValidatorReqDoc();
      // this.repatriationReturn = true;



    }
    this.getRouteParam(this.route.paramMap);
    this.getDocument();
    if (this.routerData.resourceType === 'Add dead body repatriation' && JSON.parse(this.routerData.payload)?.assignedRole === 'Admin') {
      this.repatriationReturn = true;
      if(this.complicationIndicator) {
        this.getComplicationDetails();
        // this.getComplicationReqDocs();
      } else {
        this.getInjuryDetails();
      }
      // this.getValidatorReqDoc();
    }
    const url = this.router.url;
    if (url.indexOf('/edit') >= 0) {
      this.isEdit = true;
    }
    if(this.socialInsuranceNo == undefined && this.registrationNo == undefined) {
      this.pageEmpty = true;
    }
    if (this.complicationId !== null && this.complicationId !== undefined) {
      this.complicationIndicator = true;
    }
    this.alertService.clearAlerts();
    this.processType = url.substr(url.lastIndexOf('/') + 1);
  }

  initializeWizardItems() {
    this.repatriationWizardItems = [];
    const wizardItem: WizardItem = new WizardItem(OhConstants.ADD_DEADBODY_REPATRIATION_CLAIMS, 'truck');
    // wizardItem.isImage = true;
    this.repatriationWizardItems.push(wizardItem);
    this.repatriationWizardItems.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    this.repatriationWizardItems[0].isActive = true;
    this.repatriationWizardItems[0].isDisabled = false;
  }

  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }
  expensesSubmit(repatriationExpenses: Repatriation) {
    if (this.settlementId !== null) {
      repatriationExpenses.settlementId = this.settlementId;
    } else {
      repatriationExpenses.settlementId = null;
    }
    if(this.referenceNo !== undefined && this.referenceNo !== null) {
      repatriationExpenses.referenceNo = this.referenceNo;
    }
    // repatriationExpenses.isAdminSubmit = this.isAdminSubmit;
    if (this.complicationId !== null && this.complicationId !== undefined) {
      this.ohService.submitRepatriationExpenses(repatriationExpenses, this.registrationNo, this.socialInsuranceNo, this.complicationId, this.isAdminSubmit).subscribe((res) => {
        this.settlementId = res.settlementId;
        this.navigateToNextTab();
      },
      error => {
        this.showError(error);
      });
    } else {
      this.ohService.submitRepatriationExpenses(repatriationExpenses, this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isAdminSubmit).subscribe((res) => {
        this.settlementId = res.settlementId;
        this.navigateToNextTab();
      },
      error => {
        this.showError(error);
      });
    }
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /** Method to navigate to next tab on successful save */
  navigateToNextTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.currentTab++;
    this.progressWizardItems.setNextItem(this.currentTab);
    scrollToTop();
  }
  /** Method to navigate to the previous tab */
  navigateToPreviousTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.currentTab--;
    this.progressWizardItems.setPreviousItem(this.currentTab);
    scrollToTop();
  }
  /** Method to navigate by index. */
  navigateToTabByIndex(activeTab: number) {
    this.isApiTriggered = false;
    this.currentTab = activeTab;
    this.progressWizardItems.setActive(this.currentTab);
    scrollToTop();
  }
  // getDocument() {
  //   this.documentService.getDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Injury, 1002014162)
  //     .subscribe(documentResponse => {
  //       this.documentItem = documentResponse.filter(item => item.documentContent !== null);
  //       if (this.documentsList) {
  //         for (const doc of this.documentsList) {
  //           this.reqdocumentTemp = documentResponse.filter(item => item.name.english === doc.english);
  //           this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
  //           this.reqdocumentList.push(this.reqdocumentTemp);
  //         }
  //       }
  //   });
  // }
  getDocument() {
    this.InjurydocumentList$ = this.documentService
    .getRequiredDocuments(OhConstants.REPATRIATION_TRANSACTION_KEY, OhConstants.REPATRIATION_TRANSACTION_KEY)
    .pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.InjurydocumentList$.subscribe((documents: DocumentItem[]) => {
      if (documents) {
        this.documentItem = [];
        for (const item of documents) {
          if (item.name.english === 'Occupational Hazard Processes Form') {
            this.documentItem.push(item);
            break;
          }
        }
        documents.forEach(item => {
          if (item.name.english !== 'Occupational Hazard Processes Form') {
            this.documentItem.push(item);
          }
        });
      }
      // if (
      //   this.isWorkflow ||
      //   this.processType === ProcessType.MODIFY ||
      //   this.processType === ProcessType.REOPEN ||
      //   this.isEdit === true
      // ) {
      //   for (const InjuryDocumentItem of this.documentItem) {
      //     this.refreshDocument(InjuryDocumentItem);
      //   }
      // }
    });
  }
  deleteDocument(document: DocumentItem) {}
  //Method to fetch the content of the document
  refreshDocument(item: DocumentItem) {
    // const transactionStatus = this.ohService.getTransactionStatus();
    // this.transId = this.injuryId
    // if(this.isBulkInjury){
    //   this.transId = this.bulkInjuryId
    // }
    if (item && item.name) {
      this.documentService
        .refreshDocument(
          item,
          this.injuryId,
          null,
          null,
          null
        )
        .subscribe(res => {
          item = res;
        });
    }
  }
  showMandatoryDocErrorMessage($event) {
    this.showErrorMessage($event);
  }
  /** Method to show error message for mandatory documents. */
  showErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    }
    this.alertService.showMandatoryErrorMessage();
  }
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjuryModal, config);
  }
  submitDocument(comments) {
    if (this.documentForm.get('uploadDocument')) {
      this.documentForm.markAllAsTouched();
      if (this.repatriationReturn) {
        if (this.documentForm.valid) {
          const workflowData = new BPMUpdateRequest();
            workflowData.isExternalComment = true;
            workflowData.comments = this.documentForm.get('uploadDocument').get('comments').value;
            workflowData.taskId = this.routerData.taskId;
            workflowData.outcome = WorkFlowActions.SUBMIT;
            workflowData.user = this.routerData.assigneeId;
            this.workflowService.updateTaskWorkflow(workflowData).subscribe(
              () => {
                  this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
                  this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-SUBMIT-MESSAGE', {
                    transactionId: this.referenceNo
                  });
              },
              error => {
                this.showError(error);
              }
            );
        }
      } else {
        if (this.documentForm.valid) {
          if (this.complicationId !== null && this.complicationId !== undefined) {
            this.ohService.submitRepatriation(this.registrationNo, this.socialInsuranceNo, this.complicationId, this.settlementId, comments)
            .subscribe((res) => {
              // let status = 'modified';
              this.transactionMessage = res.bilingualMessage;
              // this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/claims/info`],
              // {
              //   queryParams: {
              //     status: status
              //   }
              // });
              const data = { transactionMessage: this.transactionMessage}
              this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/claims/info`], {
                state: {data}
              });
              this.alertService.showSuccess(this.transactionMessage);
            },
            error => {
              this.showError(error);
            });
          } else {
            this.ohService.submitRepatriation(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.settlementId, comments)
            .subscribe((res) => {
              // let status = 'modified';
              this.transactionMessage = res.bilingualMessage;
              // this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/claims/info`],
              // {
              //   queryParams: {
              //     status: status
              //   }
              // });
              const data = { transactionMessage: this.transactionMessage}
              this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/claims/info`], {
                state: {data}
              });
              this.alertService.showSuccess(this.transactionMessage);
            },
            error => {
              this.showError(error);
            });
          }
        }
      }
    }
  }
  cancelTransaction(hasChanged) {
    if(this.repatriationReturn) {
      this.location.back();
    } else {
      this.router.navigate([`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`]);
    }
  }
  decline() {
    this.modalRef.hide();
  }
  confirmCancel() {
    this.modalRef.hide();
    this.cancelTransaction(true);
  }

  getAllowance(){
    // this.ohService
    //       .getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo)
    //       .subscribe(
    //         response => {
    if(this.complicationIndicator) {
      this.ohService.getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.complicationId, this.referenceNo).subscribe(res=>{
        this.allowanceDetailsWrapper=res;
      })
    } else {
      this.ohService.getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo).subscribe(res=>{
        this.allowanceDetailsWrapper=res;
      })
    }
  }

  getModifiedRepatriation() {
    if(this.complicationIndicator) {
      this.ohService.getModifiedRepatriation(this.registrationNo, this.socialInsuranceNo, this.complicationId, this.referenceNo).subscribe((res) => {
        this.modifiedRepatriation = res;
      });
    } else {
      this.ohService.getModifiedRepatriation(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo).subscribe((res) => {
        this.modifiedRepatriation = res;
      });
    }
  }

  getValidatorReqDoc() {
    let id = this.complicationIndicator ? this.complicationId : this.injuryId;
    this.documentService
    .getDocuments(OhConstants.REPATRIATION_TRANSACTION_KEY, OhConstants.REPATRIATION_TRANSACTION_KEY, id)
      .subscribe(documentResponse => {
        this.documentItem = documentResponse.filter(item => item.documentContent !== null);
        if(this.repatriationReturn) {
          this.documentItem.forEach(item => {
            item.referenceNo = this.referenceNo;
          })
        }
        if (this.documentsList) {
          for (const doc of this.documentsList) {
            this.reqdocumentTemp = documentResponse.filter(item => item.name.english.toLowerCase() === doc.english.toLowerCase());
            this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
            this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.referenceNo = this.referenceNo));
            this.reqdocumentList.push(this.reqdocumentTemp);
          }
        }
    });
  }

  getRouteParam(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(params => {
      if (
        params &&
        params.get('transactionId') &&
        params.get('registrationNo') &&
        params.get('socialInsuranceNo') &&
        params.get('injuryId')
      ) {
        this.transactionId = +params.get('transactionId');
        this.registrationNo = +params.get('registrationNo');
        this.socialInsuranceNo = +params.get('socialInsuranceNo');
        this.injuryId = +params.get('injuryId');
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setInjuryId(this.injuryId);
        this.isEdit = true;
      }
    });
  }

  getInjuryDetails() {
    this.injuryService
      .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isIndividualApp, false)
      .subscribe(
        response => {
          this.injuryDetailsWrapper = response;
          this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
          if (this.injury && this.injury.requiredDocuments.length > 0) {
            this.documentsList = this.injury.requiredDocuments;
          }
          // this.getDocs(this.injury.governmentSector.english);
          this.getValidatorReqDoc();
        });
  }

  getDocs(selectedSector) {

    let index = selectedSector.indexOf(' ');
    let value = (index != -1) ? selectedSector.substr(0, index).toUpperCase() : selectedSector.toUpperCase();

    // get docs list if app is public & private depending on selected government sector.
    if(OHTransactionType.Traffic.includes(value)) {
  
      this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Traffic)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Police.includes(value)) {

      this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Police)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Civil_Defense.includes(value)) {

      this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Civil_Defense)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Red_Crescent.includes(value)) {

      this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Red_Crescent)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else {

      this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.No_Sector)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }


    this.InjurydocumentList$.subscribe((documents: DocumentItem[]) => {
      if (documents) {
        this.documentItem = [];
        for (const item of documents) {
          if (item.name.english === 'Occupational Hazard Processes Form') {
            this.documentItem.push(item);
            break;
          }
        }
        documents.forEach(item => {
          if (item.name.english !== 'Occupational Hazard Processes Form') {
            this.documentItem.push(item);
          }
        });
      }
      // if (
      //   this.isWorkflow ||
      //   this.processType === ProcessType.MODIFY ||
      //   this.processType === ProcessType.REOPEN ||
      //   this.isEdit === true
      // ) {
      //   for (const InjuryDocumentItem of this.documentItem) {
      //     this.refreshDocument(InjuryDocumentItem);
      //   }
      // }
    });
  }

  getComplicationReqDocs() {
    this.documentService
              .getDocuments(
                OhConstants.REPATRIATION_TRANSACTION_KEY,
                OhConstants.REPATRIATION_TRANSACTION_KEY,
                this.complicationDetails.complicationId
              )
              .subscribe(documentResponse => {
                this.documentTemp = [new DocumentItem()];
                this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
              });
    this.documentService
              .getDocuments(
                OhConstants.REPATRIATION_TRANSACTION_KEY,
                OhConstants.REPATRIATION_TRANSACTION_KEY,
                this.complicationDetails.complicationId
              )
              .subscribe(docResponse => {               
                if (this.documentLists) {
                  this.documentLists.forEach(document => {
                    const docName = document.english;
                    docResponse.forEach(element => {
                      if (!this.documentArray.includes(element) && element.name.english.toLowerCase() === docName.toLowerCase()) {
                        element.required = true;
                         this.documentArray.push(element);
                      }
                    });                   
                    this.documentTemp = docResponse.filter(item => item.name.english.toLowerCase() === document.english.toLowerCase());
                    this.documentTemp = this.documentTemp.filter(item => (item.required = true));                    
                    this.ReqdocumentLists.push(this.documentTemp);

                    for (const indx in this.ReqdocumentLists[0]) {
                      if (this.ReqdocumentLists.hasOwnProperty(indx)) {
                        this.ReqdocumentLists[0][indx].required = true;
                      }
                    }
                  });
                 // this.complicationDocumentList = this.documentArray;
                  this.complicationDocumentList = docResponse.filter(item => item.documentContent !== null);
                }
              });
  }

  getComplicationDetails() {
    this.complicationService
      .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryNo, this.complicationId, false)
      .subscribe(res => {
        this.complicationDetailsWrapper = res;
        this.complicationDetails = this.complicationDetailsWrapper.complicationDetailsDto;
        this.documentsList = this.complicationDetails.requiredDocuments;
        this.getValidatorReqDoc();
      });
  }
}
