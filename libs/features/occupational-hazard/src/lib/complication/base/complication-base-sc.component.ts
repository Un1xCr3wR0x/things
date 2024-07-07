/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Directive, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router, ParamMap } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  markFormGroupTouched,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WizardItem,
  WorkflowService,
  FeedbackStatus,
  BPMUpdateRequest,
  WorkFlowActions,
  AlertTypeEnum,
  TransactionStatus,
  LanguageToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  Complication,
  ComplicationConstants,
  ComplicationFeedback,
  ComplicationService,
  ContributorService,
  DiseaseService,
  Engagement,
  EstablishmentService,
  Injury,
  InjuryHistory,
  InjuryService,
  InjuryWrapper,
  NavigationIndicator,
  OhBaseScComponent,
  OhConstants,
  OHReportTypes,
  OhService,
  OHTransactionType,
  Pagination,
  Person,
  ProcessType,
  RouteConstants
} from '../../shared';
import { ComplicationWrapper } from '../../shared/models/complication-wrapper';
import { ForeignMandatoryErrorKey } from '@gosi-ui/foundation/form-fragments';

@Directive()
export abstract class ComplicationBaseScComponent extends OhBaseScComponent {
  /*** viewchild components */
  @ViewChild('reportComplicationWizard', { static: false })
  reportComplicationWizard: ProgressWizardDcComponent;
  /*
   * Local Variables
   */
  currentTab = 0;
  isReportView = false;
  uploadFailed: boolean;
  viewInjuryDetail: Injury;
  establishmentRegNo: number;
  complicationId: number;
  pageLimit = ComplicationConstants.PAGE_LIMIT_LOAD;
  currentPage = 0;
  hasErrorAlert: boolean;
  isContributor: boolean;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  pagination = new Pagination();
  lang: string;
  pageTotal: number;
  reportComplicationWizardItems: WizardItem[] = [];
  injuryList: InjuryHistory[] = [];
  modalRef: BsModalRef;
  reportedComplicationInformation: Complication = new Complication();
  reportComplicationMainForm: FormGroup = new FormGroup({});

  isWorkflow: boolean;
  personId: number;
  socialInsuranceNo: number;
  registrationNo: number;
  cityList$: Observable<LovList>;
  booleanList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  complicationDocumentList$: Observable<DocumentItem[]>;
  complicationDocumentList: DocumentItem[] = [];
  actionflag = false;
  injuryId: number;
  feedbackdetails: ComplicationFeedback = new ComplicationFeedback();
  personComplicationDocumentList: DocumentItem[];
  isAddressOptional = true;
  documentForm: FormGroup = new FormGroup({});
  error: boolean;
  emergencyContact: string;
  isAppPrivate: boolean;
  isIndividualApp : boolean;
  occupation: BilingualText = new BilingualText();
  selectedEngagament: Engagement = null;
  selectedPerson: Person;
  isValidator1 = false;
  isValidator2 = false;
  complicationDetails: Complication = new Complication();
  complicationDetailsWrapper: ComplicationWrapper = new ComplicationWrapper();
  documentLists: BilingualText[];
  documentTemp: DocumentItem[];
  documentArray: DocumentItem[] = [];
  documentTempItem: DocumentItem = new DocumentItem();
  ReqdocumentLists = [];
  processType: string;
  taskid: string;
  complications: any;
  value: Params;
  personalDetails: Person;
  modifyIndicator: boolean;
  reopenComplicationForm: FormGroup;
  isSelectedReasonOthers = false;
  isdControl: string;
  transactionId: number;
  injuryTransactionId = OhConstants.TRANSACTION_ID;
  isEdit = false;
  previousOutcome: string;

  /**
   * Creating instance
   * @param ohService
   * @param injuryService
   * @param establishmentService
   * @param complicationService
   * @param alertService
   * @param router
   * @param modalService
   * @param documentService
   * @param contributorService
   * @param fb
   * @param routerData
   * @param appToken
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly coreContributorService: CoreContributorService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location
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
  }

  initializeLocalVariables() {
    this.currentTab = 0;
    const url = this.router.url;
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    if (window.location.href.indexOf('edit') !== -1) {
      this.processType = ProcessType.EDIT;
    }
    this.taskid = this.routerData.taskId;
    if (this.routerData?.payload) {
      const payload = JSON.parse(this.routerData.payload);
      this.previousOutcome = payload.previousOutcome;
    }
  }
  //Loading look ups
  initializeLookUps() {
    this.cityList$ = this.lookupService.getCityList();
    this.booleanList$ = this.ohService.getTreatmentCompleted();
    this.countryList$ = this.lookupService.getCountryList();
  }
  /**Getting Complication details */
  getComplicationDetails(registrationNo, socialInsuranceNo, injuryNo, complicationid) {
    let isChangeRequired = false;
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN || this.isEdit) {
      isChangeRequired = true;
    }
    this.complicationService
      .getComplication(registrationNo, socialInsuranceNo, injuryNo, complicationid, isChangeRequired)
      .pipe(
        tap(res => {
          this.complicationDetailsWrapper = res;
          if (this.processType === ProcessType.MODIFY) {
            this.ohService.setNavigationIndicator(NavigationIndicator.CSR_MODIFY);
          }
          if (
            (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN) &&
            this.routerData.taskId
          ) {
            this.injuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_COMPLICATION);
          }
          this.complicationDetails = this.complicationDetailsWrapper.complicationDetailsDto;
          this.emergencyContact = this.complicationDetails.emergencyContactNo.primary;
          this.isdControl = this.complicationDetails.emergencyContactNo.isdCodePrimary;
          if (
            (this.routerData && this.routerData.taskId && this.processType === ProcessType.RE_OPEN) ||
            (this.processType === ProcessType.RE_OPEN && this.isEdit)
          ) {
            this.reopenComplicationForm
              .get('reopenReason')
              .get('english')
              .setValue(this.complicationDetails.reopenReason.english);
            this.reopenComplicationForm
              .get('modifyComplicationIndicator')
              .setValue(this.complicationDetails.modifyComplicationIndicator);
            this.modifyIndicator = this.complicationDetails.modifyComplicationIndicator;
            if (this.complicationDetails.reopenReason.english === 'Others') {
              this.isSelectedReasonOthers = true;
            }
          }
          if (this.complicationDetails.initiatedBy === 'taminaty') {
            this.isContributor = true;
          } else {
            this.isContributor = false;
          }
          this.injuryId = this.complicationDetails.injuryDetails.injuryId;
          this.emergencyContact = this.complicationDetails.emergencyContactNo.primary;
          this.isdControl = this.complicationDetails.emergencyContactNo.isdCodePrimary;
          if (this.complicationDetails && this.complicationDetails.injuryDetails && this.injuryId) {
            this.ohService.setInjuryId(this.complicationDetails.injuryDetails.injuryId);
          }
          this.viewInjuryDetail = this.complicationDetails.injuryDetails;
          this.establishmentRegNo = this.complicationDetails.establishmentRegNo;
          this.documentLists = this.complicationDetails.requiredDocuments;
          this.complicationDetails.injuryDetails.injuryTime =
            this.complicationDetails.injuryDetails.injuryHour != null
              ? this.complicationDetails.injuryDetails.injuryHour +
                ':' +
              this.complicationDetails.injuryDetails.injuryMinute
              : null;
        })
      )
      .subscribe(
        () => {
          /* Document Functionality on Validator Flow */
          if (
            (this.routerData.assignedRole === Role.CONTRIBUTOR && !this.isEdit) ||
            (this.routerData.assignedRole === Role.EST_ADMIN_OH && !this.isEdit) ||
            (this.previousOutcome === 'RETURN' && this.isEdit && this.routerData.assignedRole === Role.EST_ADMIN_OH)
          ) {
            this.documentService
              .getDocuments(
                OHTransactionType.DOCUMENT_TRANSACTION_KEY,
                OHTransactionType.Complication,
                this.complicationDetails.complicationId
              )
              .subscribe(documentResponse => {
                this.documentTemp = [new DocumentItem()];
                this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
              });
            this.documentService
              .getDocuments(
                OHTransactionType.DOCUMENT_TRANSACTION_KEY,
                OHTransactionType.Complication,
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
        },
        err => {
          this.showError(err);
        }
      );
  }
  // Get person details through api and set relevant variables
  getContributorDetails(movetoNext, registrationNo: number, socialInsuranceNo: number) {
    this.contributorService.getContributor(registrationNo, socialInsuranceNo).subscribe(
      response => {
        if (response.person.identity[0]) {
          if (
            response &&
            response.person &&
            response.person.contactDetail &&
            response.person.contactDetail.addresses &&
            response.person.contactDetail.addresses.length > 0
          ) {
            this.isAddressPresent = true;
          }
          this.personalDetails = response.person;
          this.ohService.setPersonId(this.personalDetails.personId);
          this.selectedPerson = this.personalDetails;
          this.ohService.setPersonDetails(this.selectedPerson);
          if (this.personalDetails && this.personalDetails.contactDetail && this.personalDetails.contactDetail.addresses) {
            this.isAddressPresent = true;
            this.personId = this.personalDetails.personId;
          } else {
            this.isAddressPresent = false;
          }
          if (movetoNext) {
            this.nextForm();
          }
        } else {
          scrollToTop();
          this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REQUESTED-DETAILS-NOT-AVAILABLE');
        }
      },
      err => {
        this.error = false;
        this.showError(err);
      }
    );
  }
  // Getting the injury list
  getInjuryList() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.injuryService.getInjuryHistory(this.socialInsuranceNo, OHReportTypes.Complication).subscribe(
      response => {
        this.pageTotal = response.totalCount;
        this.injuryList = response.injuryHistory;
      },
      err => {
        this.showError(err);
      }
    );
  }
  nextForm() {
    scrollToTop();
    if (this.currentTab !== 0) {
      this.alertService.clearAlerts();
    }
    this.currentTab++;
    if (this.reportComplicationWizard) {
      this.reportComplicationWizard.setNextItem(this.currentTab);
    }
  }
  /**
   * @param reportComplicationDetails Method to save complication details
   */
  saveComplicationDetails(reportComplicationDetails: Complication) {
    this.isWorkflow = this.ohService.getIsWorkflow();
    this.reportedComplicationInformation = reportComplicationDetails;
    this.alertService.clearAlerts();
    reportComplicationDetails.registrationNo = this.registrationNo;
    if (this.reportComplicationMainForm.get('reportComplication')) {
      this.reportComplicationMainForm.markAllAsTouched();
      this.reportComplicationMainForm.updateValueAndValidity();
      if (
        !this.reportComplicationMainForm.invalid ||
        (this.processType === ProcessType.RE_OPEN && this.modifyIndicator === false)
      ) {
        if (this.reportedComplicationInformation.complicationToDeathIndicator === true && !this.isAddressPresent) {
          this.isAddressOptional = false;
        }
        this.complicationService.saveComplication(reportComplicationDetails, this.isWorkflow).subscribe(
          response => {
            this.complicationId = response;
            this.ohService.setISNewTransaction(false);
            this.ohService.setComplicationId(this.complicationId);
            this.nextForm();
          },
          err => {
            this.showError(err);
          }
        );
      } else {
        markFormGroupTouched(this.reportComplicationMainForm);
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  // Submit uploaded documents and move to feedback
  submitDocument(complicationId, injuryNumber, actionflag, comments) {
    //TODO try to use rxjs operators tap, switchMap if possible
    this.complicationService.submitComplication(complicationId, injuryNumber, actionflag, comments, this.registrationNo).subscribe(
      (response: ComplicationFeedback) => {
        this.feedbackdetails = response;
        const transactionStatus = this.ohService.getTransactionStatus();
        this.ohService.setComplicationId(null);
        if (
          (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN) &&
          (this.routerData.taskId === null || this.routerData.taskId === undefined)
        ) {
          this.injuryNumber = this.ohService.getInjuryNumber();
          this.ohService.setNavigationIndicator(NavigationIndicator.ADD_OH);
          let status = 'modify';
          if (this.processType === ProcessType.RE_OPEN) {
            status = 're-open';
          }
          if (transactionStatus?.english === TransactionStatus.DRAFT) {
            this.router.navigate(['home/transactions/list/history']);
          } else {
            this.router.navigate(
              [
                `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
              ],
              {
                queryParams: {
                  status: status
                }
              }
            );
          }
          this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
        } else if (
          (this.processType === ProcessType.EDIT ||
            this.processType === ProcessType.RE_OPEN ||
            this.processType === ProcessType.MODIFY) &&
          ((this.routerData.taskId !== null && this.routerData.taskId !== undefined) ||
            (this.processType !== ProcessType.EDIT && this.isEdit))
        ) {
          const workflowData = new BPMUpdateRequest();
          workflowData.taskId = this.routerData.taskId;
          workflowData.user = this.routerData.assigneeId;
          workflowData.comments = this.documentForm.get('uploadDocument').get('comments').value;
          workflowData.outcome = WorkFlowActions.UPDATE;
          workflowData.isExternalComment = true;
          this.workflowService.updateTaskWorkflow(workflowData).subscribe(
            () => {
              /**Inbox Routes **/
              if (this.isWorkflow && !this.isAppPrivate) {
                this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
              } else if (this.isAppPrivate && this.isWorkflow) {
                this.router.navigate([RouteConstants.ROUTE_INBOX]);
              } else {
                this.location.back();
              }
              this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
            },
            err => {
              this.showError(err);
            }
          );
        } else {
          this.ohService.resetValues();
          this.complicationId = null;
          this.injuryNumber = null;
          this.location.back();
          if (this.feedbackdetails.status.english === FeedbackStatus.REJECTED) {
            this.alertService.showError(this.feedbackdetails.transactionMessage);
          } else if (
            this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
            this.feedbackdetails.status.english === FeedbackStatus.PENDING  ||
            this.feedbackdetails.status.english === FeedbackStatus.INPROGRESS
          ) {
            this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
            this.showSuccessMessage(this.feedbackdetails.transactionMessage);
          }
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /* Document Functionalities */
  getManageInjuryDocumentList() {
    //this.isDisease = this.ohService.getIsDisease();
    //const transactionId = this.isDisease ? OhConstants.ADD_DISEASE_COMPLICATION : OhConstants.DOCUMENT_TRANSACTION_KEY;
   // const transactionType = this.isDisease && this.isAppPrivate ? OHTransactionType.ADD_DISEASE : this.isDisease && !this.isAppPrivate ? OHTransactionType.REPORT_COMPLICATION : OHTransactionType.Complication
    this.complicationDocumentList$ = this.documentService
    .getRequiredDocuments(OhConstants.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Complication)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    this.complicationDocumentList$.subscribe((documents: DocumentItem[]) => {
      this.complicationDocumentList = documents;
      if (this.isWorkflow || this.isEdit) {
        for (const complicationDocumentItem of this.complicationDocumentList) {
          this.refreshDocument(complicationDocumentItem);
        }
      }
    });
  }
  refreshDocument(item: DocumentItem) {
    const transactionStatus = this.ohService.getTransactionStatus();
    if (item && item.name) {
      this.documentService
        .refreshDocument(
          item,
          this.complicationId,
          null,
          null,
          this.referenceNo && transactionStatus.english !== TransactionStatus.DRAFT ? this.referenceNo : null
        )
        .subscribe(res => {
          item = res;
        });
    }
  }
  getRouteParam(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(params => {
      if (params && params.get('transactionId') && params.get('registrationNo') && params.get('socialInsuranceNo')) {
        this.transactionId = +params.get('transactionId');
        this.registrationNo = +params.get('registrationNo');
        this.socialInsuranceNo = +params.get('socialInsuranceNo');
        this.complicationId = +params.get('complicationId');
        this.injuryNumber = +params.get('injuryNumber');
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setComplicationId(this.complicationId);
        this.ohService.setInjuryNumber(this.injuryNumber);
        this.isEdit = true;
      }
    });
  }
  /**
   * @param reportComplicationDetails Method to save disease complication details
   */
  /* saveReportDiseaseDetails(reportComplicationDetails: Complication) {
  
    this.reportedComplicationInformation = reportComplicationDetails;
    this.alertService.clearAlerts();
    reportComplicationDetails.registrationNo = this.registrationNo;
    if (this.reportComplicationMainForm.get('reportComplication')) {
      this.reportComplicationMainForm.markAllAsTouched();
      this.reportComplicationMainForm.updateValueAndValidity();
      if (
        !this.reportComplicationMainForm.invalid ||
        (this.processType === ProcessType.RE_OPEN && this.modifyIndicator === false)
      ) {
        if (this.reportedComplicationInformation.complicationToDeathIndicator === true && !this.isAddressPresent) {
          this.isAddressOptional = false;
        }
        this.complicationService.saveDiseaseComplication(reportComplicationDetails).subscribe(
          response => {
            this.complicationId = response;
            this.ohService.setISNewTransaction(false);
            this.ohService.setComplicationId(this.complicationId);
            this.nextForm();
          },
          err => {
            this.showError(err);
          }
        );
      } else {
        markFormGroupTouched(this.reportComplicationMainForm);
        this.alertService.showMandatoryErrorMessage();
      }
    }
  } */

   // Submit uploaded documents and move to feedback
   /* submitDiseaseDocument(complicationId, diseaseNumber, actionflag, comments) {
    this.complicationService.submitDiseaseComplication(diseaseNumber, complicationId, actionflag, comments, this.registrationNo).subscribe(
      (response: ComplicationFeedback) => {
        this.feedbackdetails = response;
        // const transactionStatus = this.ohService.getTransactionStatus();
        this.ohService.setComplicationId(null);
        this.ohService.resetValues();
        this.complicationId = null;
        this.diseaseNumber = null;
        this.location.back();
        
            this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
            this.showSuccessMessage(this.feedbackdetails.transactionMessage);
      },
      err => {
        this.showError(err);
      }
    );
  } */
  getComplicationDraftDetails(registrationNo, socialInsuranceNo, diseaseNumber, complicationId) {
    this.complicationService
      .getHistoryComplication(
        registrationNo,
        socialInsuranceNo,
        diseaseNumber,
        complicationId
      )
      .pipe(
        tap(res => {
          this.complications = res?.diseaseComplicationResponse;
          this.diseaseId = this.complications?.diseaseId
          this.complicationDetails = this.complications;
          this.emergencyContact = this.complicationDetails.emergencyContactNo.primary;
          this.isdControl = this.complicationDetails.emergencyContactNo.isdCodePrimary;
          this.getDisease(false);
        })
      )
      .subscribe(
        () => {
          this.documentService.getOldDocuments(this.complicationId).subscribe(documentResponse => {
            this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          });
        },
        err => {
          this.showError(err);
        }
      );
  }
}
