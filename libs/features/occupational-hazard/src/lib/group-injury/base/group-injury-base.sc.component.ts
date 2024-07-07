/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { PlatformLocation, Location } from '@angular/common';
import { Directive, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  ApplicationTypeToken,
  TransactionService,
  WizardItem,
  LovList,
  BilingualText,
  TransactionReferenceData,
  scrollToTop,
  LookupCategory,
  DocumentItem,
  TransactionStatus,
  GosiCalendar,
  OccupationList,  
  EmploymentDetails,
  LanguageToken,
  Establishment
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  DocumentDcComponent,
  EstablishmentService,
  GroupInjuryFeedback,    
  InjuredContributorsDTO,  
  InjuryService,
  NavigationIndicator,
  OhBaseScComponent,
  OhConstants,
  OhService,
  Person,
  ProcessType,
  OHTransactionType
} from '../../shared';
import { GroupInjuryConstants } from '../../shared/constants/group-injury-constants';
import { GroupInjury } from '../../shared/models/group-injury-details';
import { GroupInjuryService } from '../../shared/services/group-injury.service';

@Directive()
export abstract class GroupInjuryBaseComponent extends OhBaseScComponent {
  transactionId: number;
  injuryTransactionId = OhConstants.TRANSACTION_ID;
  isEdit = false;
  comment: TransactionReferenceData[];
  injuredContributorDTOList: InjuredContributorsDTO[] = []; 
  navigationIndicator: NavigationIndicator;
  payeeInfo = false;
  workFlowType = GroupInjuryConstants.GROUP_INJURY;
  reportGroupInjuryForm: FormGroup;
  injuryDetails: GroupInjury = new GroupInjury();
  payeeT: number;
  previousOutcome: string;

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
    readonly groupInjuryService: GroupInjuryService,
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
  /**local varibales */
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;

  currentTab = 0;
  totalTabs = 4;
  feedbackdetails: GroupInjuryFeedback = new GroupInjuryFeedback();
  documentForm: FormGroup = new FormGroup({});
  emergencyContactNo: string;
  addGroupInjuryWizard: WizardItem[] = [];
  reportGroupInjuryMainForm: FormGroup = new FormGroup({});
  searchEstablishmentForm: FormGroup = new FormGroup({});
  contributorGroupInjuryForm: FormGroup;
  formStatus = false;
  reportedGroupInjuryInformation: GroupInjury = new GroupInjury();
  processType: string;
  reportedDate: GosiCalendar;
  engagementDetails: EmploymentDetails[];
  occupation: BilingualText = new BilingualText();


  isWorkflow = false;
  payeeInfoMessage: BilingualText;
  taskid: string;
  isValidator1 = false;
  modifyIndicator = false;
  isSelectedReasonOthers = false;
  documentsList: BilingualText[];
  reqdocumentTemp: Partial<DocumentItem[]>;
  isValidator2 = false;
  isAddressOptional = true;
  documentItem: DocumentItem[] = [];
  reqdocumentList = [];
  establishmentName: BilingualText; 
  establishmentPresent: Establishment = new Establishment();
  uploadFailed: boolean;
  groupInjuryDocumentList: DocumentItem[] = [];
  isdControl: string;
  /** Lookup observables*/
  injuryOccuredPlace$: Observable<LovList>;
  injuryReasonList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  booleanList$: Observable<LovList>;
  governmentSectorList$: Observable<LovList> = new Observable<LovList>(null);
  reopenReason$: Observable<LovList>;
  injuryTypeList$: Observable<LovList>;
  groupInjuryDocumentList$: Observable<DocumentItem[]>;
  occupationList$: Observable<OccupationList>;

  /**
   * Method to initialize Lookups
   */
  initializeLookups() {
    this.booleanList$ = this.ohService.getTreatmentCompleted();
    this.cityList$ = this.lookupService.getCityList();
    this.injuryOccuredPlace$ = this.lookupService.getInjuryOccuredPlace();
    this.countryList$ = this.lookupService.getCountryList();
    this.injuryTypeList$ = this.lookupService.getInjuryTypeList();
    this.occupationList$ = this.lookupService.getOccupationList();
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
    this.groupInjuryDocumentList$ = this.documentService.getRequiredDocuments(OhConstants.GROUP_INJURY_TRANSACTION_KEY, GroupInjuryConstants.DOCUMENT_TRANSACTION_TYPE);
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

  getNavigationIndicator(routerData) {
    if (this.processType === ProcessType.MODIFY && !routerData.taskId) {
      if (this.isEdit) {
        this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.CSR_EDITS;
      }
    } else if (this.processType === ProcessType.MODIFY && routerData.taskId !== null) {
      if (this.isEdit) {
        this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS;
      }
    } else if (this.processType === ProcessType.REOPEN) {
      if (this.isAppPrivate) {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.CSR_REOPEN_INJURY;
        }
      } else {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          if (this.isEdit) {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.EST_ADMIN_REOPEN_INJURY;
          }
        }
      }
    }
    this.injuryService.setNavigationIndicator(this.reportedGroupInjuryInformation.navigationIndicator);
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
          if (res[0]?.engagementPeriod[0]?.occupation) {
            this.occupation = res[0].engagementPeriod[0].occupation;
          }
          setTimeout(() => {
            if (
              this.contributorGroupInjuryForm && 
              this.contributorGroupInjuryForm.get('occupation')
            ) {
              /* this.contributorGroupInjuryForm                
                .get('occupation')
                .get('english')
                .setValue(this.occupation?.english);
              this.contributorGroupInjuryForm                
                .get('occupation')
                .get('arabic')
                .setValue(this.occupation?.arabic); */
            }
          }, 2000);
        },
        err => {
          this.showError(err);
        }
      );
  }
  /**
   * This method is to initialize progress wizard
   */
  initializeWizardItems() {
    this.addGroupInjuryWizard = [];
    if (this.processType === ProcessType.REOPEN) {
      const wizardItem: WizardItem = new WizardItem(GroupInjuryConstants.WIZARD_REOPEN_DETAILS, 'Reopen');
      wizardItem.isImage = true;
      this.addGroupInjuryWizard.push(wizardItem);
      this.addGroupInjuryWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    } else {
      this.addGroupInjuryWizard.push(new WizardItem(GroupInjuryConstants.WIZARD_INJURY_DETAILS, 'user-injured'));
      this.addGroupInjuryWizard.push(new WizardItem(GroupInjuryConstants.WIZARD_CONTRIBUTORS_DETAILS, 'users'));
      this.addGroupInjuryWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    }
    this.addGroupInjuryWizard[0].isActive = true;
    this.addGroupInjuryWizard[0].isDisabled = false;
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

  //This methd is used to save address details
  saveAddress(personDetails) {
    this.ohservice.updateAddress(personDetails).subscribe(
      () => {
       // this.nextForm();
      },
      err => {
        this.showError(err);
      }
    );
  }

  getRouteParam(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(params => {
      if (
        params &&
        params.get('transactionId') &&
        params.get('registrationNo') &&       
        params.get('injuryId')
      ) {
        this.transactionId = +params.get('transactionId');
        this.registrationNo = +params.get('registrationNo');
        this.socialInsuranceNo = +params.get('socialInsuranceNo');
        this.groupInjuryId = +params.get('injuryId');
        if(this.registrationNo){
          this.ohservice.setRegistrationNo(this.registrationNo);    
        }        
        this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
        this.isEdit = true;
      }
    });
  }

  getAddressAvailability(person: Person): boolean {
    if (person && person.contactDetail && person.contactDetail.addresses) {
      if (person.contactDetail.addresses.length > 0) {
        return true;
      }
    }
    return false;
  }
  /**
   * Display Next Form
   */
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs && this.reportOHTabs.tabs[this.currentTab]) {
      this.reportOHTabs.tabs[this.currentTab].active = true;
    }
    if (this.reportOHWizard) {
      this.reportOHWizard.setNextItem(this.currentTab);
    }
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

  /* Document Functionalities */
  getManageGroupInjuryDocumentList() {
    this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OhConstants.GROUP_INJURY_TRANSACTION_KEY, GroupInjuryConstants.DOCUMENT_TRANSACTION_TYPE)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    this.groupInjuryDocumentList$.subscribe((documents: DocumentItem[]) => {
      if (documents && documents.length>0) {
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
        for (const GroupInjuryDocumentItem of this.documentItem) {
          this.refreshDocument(GroupInjuryDocumentItem);
        }
      }
    });
  }

  //Method to fetch the content of the document
  refreshDocument(item: DocumentItem) {
    const transactionStatus = this.ohService.getTransactionStatus();
    if (item && item.name) {
      this.documentService
        .refreshDocument(
          item,
          this.groupInjuryId,
          null,
          null,
          this.referenceNo && transactionStatus.english !== TransactionStatus.DRAFT ? this.referenceNo : null
        )
        .subscribe(res => {
          item = res;
        });
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
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }

  clearModal() {
    this.modalRef.hide();
  }
  // Service call for injury statistics
  getInjuredContributors() {
    this.groupInjuryService.getInjuredContributorsList(this.ohService.getSocialInsuranceNo()).subscribe(
      response => {
        this.injuredContributorDTOList = response.injuredContributors;
      },
      err => {
        this.showError(err);
      }
    );
  }

  getDocs(selectedSector) {

    let index = selectedSector.indexOf(' ');
    let value = (index != -1) ? selectedSector.substr(0, index).toUpperCase() : selectedSector.toUpperCase();

    // get docs list if app is public & private depending on selected government sector.
    if(OHTransactionType.Traffic.includes(value)) {
  
      this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Traffic)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Police.includes(value)) {

      this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Police)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Civil_Defense.includes(value)) {

      this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Civil_Defense)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else if(OHTransactionType.Red_Crescent.includes(value)) {

      this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Red_Crescent)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }else {

      this.groupInjuryDocumentList$ = this.documentService
      .getRequiredDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.No_Sector)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    }


    this.groupInjuryDocumentList$.subscribe((documents: DocumentItem[]) => {
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
        console.log("test-3");
      }
    });
  }

}

