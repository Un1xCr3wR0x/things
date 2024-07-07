/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Directive, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  EmploymentDetails,
  GosiCalendar,
  LookupCategory,
  LookupService,
  LovList,
  OccupationList,
  scrollToTop,
  WizardItem,
  Transaction,
  TransactionService,
  TransactionReferenceData,
  TransactionStatus,
  LanguageToken
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DocumentDcComponent, OhBaseScComponent } from '../../shared';
import { InjuryConstants, OhConstants } from '../../shared/constants';
import { NavigationIndicator, ProcessType, OHTransactionType } from '../../shared/enums';
import { Injury, InjuryFeedback, InjuryStatistics, InjuryWrapper } from '../../shared/models';
import { Person } from '../../shared/models/person';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../shared/services';
import { ParamMap, Router } from '@angular/router';

@Directive()
export abstract class InjuryBaseComponent extends OhBaseScComponent {
  transactionId: number;
  injuryTransactionId = OhConstants.TRANSACTION_ID;
  isEdit = false;
  comment: TransactionReferenceData[];
  previousOutcome: string;

  // report injury admin inbox
  allowanceFlag: boolean = false;
  allowanceFlagReturn: boolean = false;
  allowanceFlagReopen: boolean = false;

  /**
   * Constructor to initialize the class
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly complicationService: ComplicationService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly diseaseService: DiseaseService,
    readonly lookupService: LookupService,
    readonly ohservice: OhService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly modalService: BsModalService,
    readonly transactionService: TransactionService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohservice,
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
  /**
   * viewchild components
   */
  @ViewChild('reportOHTabs', { static: false })
  reportOHTabs: TabsetComponent;
  @ViewChild('reportOHWizard', { static: false })
  reportOHWizard: ProgressWizardDcComponent;
  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: DocumentDcComponent;

  /**
   * Local Variables
   */
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  documentForm: FormGroup = new FormGroup({});
  emergencyContactNo: string;
  addInjuryWizard: WizardItem[] = [];  
  reqdocumentTemp: Partial<DocumentItem[]>;
  currentTab = 0;
  transId: number;
  totalTabs = 4;
  payeeT: number;
  modalRef: BsModalRef;
  formStatus = false;
  payeeInfoMessage: BilingualText;
  injuryStatistics: InjuryStatistics = new InjuryStatistics();
  reportInjuryMainForm: FormGroup = new FormGroup({});
  reportedInjuryInformation: Injury = new Injury();
  feedbackdetails: InjuryFeedback = new InjuryFeedback();
  occupation: BilingualText = new BilingualText();
  engagementDetails: EmploymentDetails[];
  reportedDate: GosiCalendar;
  documentsList: BilingualText[];
  isWorkflow = false;
  establishmentName: BilingualText; 
  isValidator1 = false;
  isValidator2 = false;
  navigationIndicator: NavigationIndicator;
  isAddressOptional = true;
  uploadFailed: boolean;
  injuryDocumentList: DocumentItem[] = [];
  documentItem: DocumentItem[] = [];
  reqdocumentList = [];
  payeeInfo = false;
  processType: string;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  modifyIndicator = false;
  isSelectedReasonOthers = false;
  taskid: string;
  workFlowType = InjuryConstants.INJURY;
  isdControl: string;
  transaction: Transaction;
  /**
   * Lookup Observables
   */
  cityList$: Observable<LovList>;
  booleanList$: Observable<LovList>;
  injuryOccuredPlace$: Observable<LovList>;
  reopenReason$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  injuryTypeList$: Observable<LovList>;
  injuryReasonList$: Observable<LovList>;
  InjurydocumentList$: Observable<DocumentItem[]>;
  countryList$: Observable<LovList>;
  governmentSectorList$: Observable<LovList> = new Observable<LovList>(null);
  establishmentList$: Observable<LovList> = new Observable<LovList>(null);
  /**
   * Method to initialize Lookups
   */
  initializeLookups() {
    this.injuryTransactionId = (this.processType === ProcessType.REOPEN) ? OhConstants.INJURY_REOPEN_TRANSACTION_ID : OhConstants.TRANSACTION_ID;
    this.cityList$ = this.lookupService.getCityList();
    this.booleanList$ = this.ohservice.getTreatmentCompleted();
    this.injuryOccuredPlace$ = this.lookupService.getInjuryOccuredPlace();
    this.occupationList$ = this.lookupService.getOccupationList();
    this.countryList$ = this.lookupService.getCountryList();
    this.injuryTypeList$ = this.lookupService.getInjuryTypeList();
    const injuryReason = new BehaviorSubject<LovList>(null);
    const injuryReason$ = injuryReason.asObservable();
    if (this.isAppPrivate) {
      this.reopenReason$ = this.lookupService.getReopenReason(LookupCategory.REGISTRATION);
    } else {
      this.reopenReason$ = this.lookupService.getReopenReason(LookupCategory.COLLECTION);
    }
    injuryReason.next(new LovList([]));
    this.injuryReasonList$ = injuryReason$;
    this.governmentSectorList$ = this.lookupService.getGovernmentSectorList();
    if (this.isAppPrivate) {
      this.establishmentList$ = this.lookupService.getEstablishmentNameList(this.socialInsuranceNo);
    }
  }
  /**
   * Getting engagement details
   * @param registrationNo
   */
  getEngagementDetails(registrationNo, socialInsuranceNo) {
    this.contributorService
      .getEngagement(registrationNo, socialInsuranceNo)
      .pipe(map(res => res.engagements))
      .subscribe(
        res => {
          this.engagementDetails = res;
          if (res[0]?.engagementPeriod[0]?.occupation && !this.allowanceFlag) {
            this.occupation = res[0].engagementPeriod[0].occupation;
          }
          setTimeout(() => {
            if (
              this.reportInjuryMainForm.get('reportInjury') &&
              this.reportInjuryMainForm.get('reportInjury').get('occupation')
            ) {
              this.reportInjuryMainForm
                .get('reportInjury')
                .get('occupation')
                .get('english')
                .setValue(this.occupation?.english);
              this.reportInjuryMainForm
                .get('reportInjury')
                .get('occupation')
                .get('arabic')
                .setValue(this.occupation?.arabic);
            }
          }, 2000);
        },
        err => {
          this.showError(err);
        }
      );
  }
  /* Document Functionalities */
  getManageInjuryDocumentList() {
    this.InjurydocumentList$ = this.documentService
      .getRequiredDocuments(OhConstants.DOCUMENT_TRANSACTION_KEY, InjuryConstants.DOCUMENT_TRANSACTION_TYPE)
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
      if (
        this.isWorkflow ||
        this.processType === ProcessType.MODIFY ||
        this.processType === ProcessType.REOPEN ||
        this.isEdit === true
      ) {
        for (const InjuryDocumentItem of this.documentItem) {
          this.refreshDocument(InjuryDocumentItem);
        }
      }
    });
  }
  //Method to fetch the content of the document
  refreshDocument(item: DocumentItem) {
    const transactionStatus = this.ohService.getTransactionStatus();
    this.transId = this.injuryId
    if(this.isBulkInjury){
      this.transId = this.bulkInjuryId
    }
    if (item && item.name) {
      this.documentService
        .refreshDocument(
          item,
          this.transId,
          null,
          null,
          this.referenceNo && transactionStatus.english !== TransactionStatus.DRAFT ? this.referenceNo : null
        )
        .subscribe(res => {
          item = res;
        });
    }
  }
  //This methd is used to save address details
  saveAddress(personDetails) {
    this.ohservice.updateAddress(personDetails).subscribe(
      () => {
        this.nextForm();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /** Method to show error message for mandatory documents. */
  showErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.isAppPrivate && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
 

  /**
   * This method is to initialize progress wizard
   */
  initializeWizardItems() {
    this.addInjuryWizard = [];
    if (this.processType === ProcessType.REOPEN) {
      const wizardItem: WizardItem = new WizardItem(InjuryConstants.WIZARD_REOPEN_DETAILS, 'Reopen');
      wizardItem.isImage = true;
      this.addInjuryWizard.push(wizardItem);
      this.addInjuryWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    } else {
      this.addInjuryWizard.push(new WizardItem(InjuryConstants.WIZARD_INJURY_DETAILS, 'user-injured'));
      this.addInjuryWizard.push(new WizardItem(OhConstants.SEC_CONTACT_DETAILS, 'user'));
      this.addInjuryWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    }
    this.addInjuryWizard[0].isActive = true;
    this.addInjuryWizard[0].isDisabled = false;
  }
  /**
   * Display Next Form
   */
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.reportOHTabs.tabs[this.currentTab].active = true;
    }
    if (this.reportOHWizard) {
      this.reportOHWizard.setNextItem(this.currentTab);
    }
  }

  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }

  /**
   * This method is to navigate to previous tab
   * @memberof ManageInjuryDcComponent
   */
  previousForm() {
    scrollToTop();
    this.currentTab--;
    this.alertService.clearAlerts();
    this.reportOHWizard.setPreviousItem(this.currentTab);
  }

  // Service call for injury statistics
  getInjuryStatistics() {
    this.injuryService.getInjuryStatistics(this.injuryId).subscribe(
      response => {
        this.injuryStatistics = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  //Service call for allowance Payee
  saveAllowancePayee(payeeType) {
    if (this.isAppPrivate && this.processType !== ProcessType.EDIT) {
      this.navigationIndicator = NavigationIndicator.CSR_UPDATE_PAYEE;
    } else if (this.processType === ProcessType.EDIT) {
      this.navigationIndicator = NavigationIndicator.VALIDATOR1_UPDATE_PAYEE;
    } else {
      this.navigationIndicator = NavigationIndicator.ADMIN_UPDATE_PAYEE;
    }
    this.injuryService.saveAllowancePayee(payeeType, this.navigationIndicator).subscribe(
      response => {
        response = response;
        if (response.english.indexOf(OhConstants.PAYEE_MSG) !== -1) {
          this.payeeInfo = true;
          this.payeeInfoMessage = response;
          this.showModal(this.errorTemplate, 'modal-lg');
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
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
        this.ohservice.setRegistrationNo(this.registrationNo);
        this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setInjuryId(this.injuryId);
        this.isEdit = true;
      }
    });
  }
  getNavigationIndicator(routerData) {
    if (this.processType === ProcessType.MODIFY && !routerData.taskId) {
      if (this.isEdit) {
        this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.CSR_EDITS;
      }
    } else if (this.processType === ProcessType.MODIFY && routerData.taskId !== null) {
      if (this.isEdit) {
        this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS;
      }
    } else if (this.processType === ProcessType.REOPEN) {
      if (this.isAppPrivate) {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.CSR_REOPEN_INJURY;
        }
      } else {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          if (this.isEdit) {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.EST_ADMIN_REOPEN_INJURY;
          }
        }
      }
    }
    this.injuryService.setNavigationIndicator(this.reportedInjuryInformation.navigationIndicator);
  }

  clearModal() {
    this.modalRef.hide();
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
      if (
        this.isWorkflow ||
        this.processType === ProcessType.MODIFY ||
        this.processType === ProcessType.REOPEN ||
        this.isEdit === true
      ) {
        for (const InjuryDocumentItem of this.documentItem) {
          this.refreshDocument(InjuryDocumentItem);
        }
      }
    });
  }

  
}

