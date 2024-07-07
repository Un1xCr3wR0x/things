import {
  OhBaseScComponent,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService,
  NavigationIndicator,
  Person,
  DocumentDcComponent,
  OhConstants,
  ProcessType,
  DiseaseWrapper,
  Disease,
  OccupationDetails,
  EngagementDTO,
  DiseaseDetailsDTO,
  InjuryFeedback,
  OHTransactionType,
  TransferInjuryConstants,
  deepCopy,
  EngagementDetailsDTO,
  RouteConstants,
  ReopenDisease
} from '../../shared';
import { Directive, Inject, ViewChild, TemplateRef } from '@angular/core';
import {
  AlertService,
  DocumentService,
  LookupService,
  ApplicationTypeToken,
  TransactionService,
  TransactionReferenceData,
  EmploymentDetails,
  BilingualText,
  WizardItem,
  DocumentItem,
  TransactionStatus,
  scrollToTop,
  LovList,
  LookupCategory,
  GosiCalendar,
  LovCategoryList,
  LovCategory,
  convertToYYYYMMDD,
  startOfMonth,
  LanguageToken,
  bindToForm,
  RouterDataToken,
  RouterData,
  markFormGroupTouched,
  startOfDay,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  FeedbackStatus
} from '@gosi-ui/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatformLocation, Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, catchError } from 'rxjs/operators';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, of } from 'rxjs';
import { DiseaseConstants } from '../../shared/constants/disease-constants';
import { ParamMap, Router } from '@angular/router';
import moment from 'moment';

@Directive()
export abstract class DiseaseBaseComponent extends OhBaseScComponent {
  transactionId: number;
  reference: number;
  diseaseTransactionId = OhConstants.DISEASE_TRANSACTION_ID;
  taskid: string;
  isEdit = false;
  comment: TransactionReferenceData[];
  previousOutcome: string;
  /**
   * Local Variables
   */

  currentTab = 0;
  totalTabs = 4;
  isValidator1 = false;
  isValidator2 = false;
  navigationIndicator: NavigationIndicator;
  reopenDiseaseForm: FormGroup;
  isAddressOptional = false;
  uploadFailed: boolean;
  engagementDetails: EmploymentDetails[];
  engagementOccupationDetails: EngagementDTO[];
  occupation: BilingualText = new BilingualText();
  isWorkflow = false;
  addDiseaseWizard: WizardItem[] = [];
  diseaseDocumentList: DocumentItem[] = [];
  diseaseDetails: Disease = new Disease();
  reopenReasonDetails: ReopenDisease = new ReopenDisease();
  editedOccupation = false;
  documentScanList: DocumentItem[] = [];

  isdControl: string;
  diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();
  diseaseDetailsDTO: DiseaseDetailsDTO = new DiseaseDetailsDTO();
  occupationDetailsToSave: EngagementDetailsDTO[] = [];
  documentsList: BilingualText[];
  registeredOccupatonsList: BilingualText[] = [];
  establishmentName: BilingualText;
  emergencyContactNo: string;
  payeeType: number;
  reqdocumentTemp: Partial<DocumentItem[]>;
  reqdocumentList = [];
  modifyIndicator = false;
  documentForm: FormGroup = new FormGroup({});
  occupationDetailsForm: FormGroup = new FormGroup({});
  occupationForm: FormGroup;
  occupationsCausedDisease: OccupationDetails[] = [];
  feedbackdetails: InjuryFeedback = new InjuryFeedback();
  workFlowType = DiseaseConstants.DISEASE;
  payeeInfo = false;
  isPoMandatory: Boolean;
  payeeInfoMessage: BilingualText;
  isSelectedReasonOthers = false;
  diseaseDetailsForm: FormGroup;
  reportedDiseaseInformation: Disease = new Disease();
  reportedDate: GosiCalendar;
  resourceType: string;
  reportDiseaseMainForm: FormGroup = new FormGroup({});
  formStatus = false;
  minDate: Date;
  isOccupationsLoaded = false;
  selectedLang = 'en';
  diseaseDescriptionArray: string[] = [];
  diseaseDescription: string;
  otherDocuments: DocumentItem = {
    ...new DocumentItem(),
    documentTypeId: 2504,
    required: true,
    name: {
      arabic: 'مستندات اخرى',
      english: 'Other documents'
    },
    description: 'addedByUser',
    documentContent: null,
    reuse: false,
    sequenceNumber: null,
    documentClassification: 'External',
    parentDocumentId: null,
    fromJsonToObject: () => new DocumentItem()
  };
  /**
   * Lookup Observables
   */
  DiseasedocumentList$: Observable<DocumentItem[]>;
  cityList$: Observable<LovList>;
  booleanList$: Observable<LovList>;
  occupationList$: Observable<LovCategoryList> = new Observable<LovCategoryList>(null);
  occupations: LovCategory[] = [];
  newOccupationList: LovCategoryList = new LovCategoryList(null);
  countryList$: Observable<LovList>;
  reopenReason$: Observable<LovList>;
  governmentSectorList$: Observable<LovList> = new Observable<LovList>(null);
  establishmentList$: Observable<LovList> = new Observable<LovList>(null);
  diseaseDiagnosisList$: Observable<LovList>;
  establishmentName$: Observable<LovList> = new Observable<LovList>(null);
  diseaseCauseList$: Observable<LovList>;
  diseaseCauseLovList: LovList;
  disableEst: boolean = false;
  transId: number;

  /**
   * viewchild components
   */
  @ViewChild('reportDiseaseTabs', { static: false })
  reportDiseaseTabs: TabsetComponent;
  @ViewChild('reportDiseaseWizard', { static: false })
  reportDiseaseWizard: ProgressWizardDcComponent;
  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: DocumentDcComponent;
  businessTransaction: OHTransactionType;
  diseaseDescriptionValue: string;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly complicationService: ComplicationService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly diseaseService: DiseaseService,
    readonly lookupService: LookupService,
    readonly ohservice: OhService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
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

  ngOnInit(): void {}
  /**
   * Getting engagement details
   * @param registrationNo
   */
  getEngagementDetails(registrationNo, socialInsuranceNo) {
    this.contributorService
      .getEngagement(registrationNo, socialInsuranceNo)
      .pipe(map(res => res.engagements))
      .subscribe(res => {
        this.engagementDetails = res;
        if (res[0]?.engagementPeriod[0]?.occupation) {
          this.occupation = res[0].engagementPeriod[0].occupation;
        }
      });
  }
  getEngagementDetailsAsOnDate(socialInsuranceNo) {
    let date = new Date();
    let daeStr = convertToYYYYMMDD(startOfMonth(moment(date).toDate()).toString());
    this.contributorService
      .getEngagementOnDate(socialInsuranceNo, daeStr)
      .pipe(map(res => res.engagements))
      .subscribe(res => {
        this.engagementDetails = res;
        if (res[0]?.engagementPeriod[0]?.occupation) {
          this.occupation = res[0].engagementPeriod[0].occupation;
        }
      });
  }
  getOccupationEngagementDetail(socialInsuranceNo, occupation, registrationNo) {
    this.diseaseService
      .getEngagementOccupationDetails(
        socialInsuranceNo,
        occupation,
        registrationNo,
        this.isIndividualApp,
        this.isAppPrivate
      )
      .pipe(map(res => res.engagements))
      .subscribe(res => {
        this.registeredOccupatonsList = [];
        this.engagementOccupationDetails = res;
        if (occupation === null) {
          this.engagementOccupationDetails.forEach(engagement => {
            if (engagement.engagementPeriod) {
              engagement.engagementPeriod.forEach(period => {
                this.registeredOccupatonsList.push(period.occupation);
              });
            }
          });
          this.occupationList$ = this.ohservice.getOccupationList();
          this.convertToLOVlistWithCategory();
        }
      });
  }
  //This methd is used to save address details
  saveAddress(personDetails) {
    this.diseaseService.updateAddress(personDetails, this.socialInsuranceNo).subscribe(
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
    this.addDiseaseWizard = [];
    if (this.processType === ProcessType.RE_OPEN) {
      const wizardItem: WizardItem = new WizardItem(OhConstants.REOPEN_WIZARD, 'Reopen');
      wizardItem.isImage = true;
      this.addDiseaseWizard.push(wizardItem);
      this.addDiseaseWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    } else {
      let wizardItem: WizardItem = new WizardItem(DiseaseConstants.WIZARD_DISEASE_DETAILS, 'disease-details-gray');
      wizardItem.isImage = true;
      this.addDiseaseWizard.push(wizardItem);
      wizardItem = new WizardItem(DiseaseConstants.WIZARD_CONTACT_PAYMENT_DETAILS, 'contact-payment-details-gray');
      wizardItem.isImage = true;
      this.addDiseaseWizard.push(wizardItem);
      this.addDiseaseWizard.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    }
    this.addDiseaseWizard[0].isActive = true;
    this.addDiseaseWizard[0].isDisabled = false;
  }
  /**
   * Display Next Form
   */
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.reportDiseaseTabs.tabs[this.currentTab].active = true;
    }
    if (this.reportDiseaseWizard) {
      this.reportDiseaseWizard.setNextItem(this.currentTab);
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
    this.reportDiseaseWizard.setPreviousItem(this.currentTab);
  }
  /**
   * This method used to get status if address exists
   * @param person
   */
  getAddressAvailability(person: Person): boolean {
    if (person && person.contactDetail && person.contactDetail.addresses) {
      if (person.contactDetail.addresses.length > 0) {
        return true;
      }
    }
    return false;
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }
  /* Document Functionalities */
  getManageDiseaseDocumentList() {
    this.businessTransaction =
      this.processType === ProcessType.RE_OPEN ? OHTransactionType.REOPEN_DISEASE : OHTransactionType.Disease;
    this.DiseasedocumentList$ = this.documentService
      .getRequiredDocuments(this.businessTransaction, DiseaseConstants.DOCUMENT_TRANSACTION_TYPE)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    this.DiseasedocumentList$.subscribe((documents: DocumentItem[]) => {
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
      if(this.isTransferredInjury){
        this.documentItem.push(this.otherDocuments);
      }
      if (
        this.isWorkflow ||
        this.processType === ProcessType.MODIFY ||
        this.processType === ProcessType.RE_OPEN ||
        this.isEdit === true
      ) {
        for (const DiseaseDocumentItem of this.documentItem) {
          this.refreshDocument(DiseaseDocumentItem);
        }
      }
    });
  }
  //Method to fetch the content of the document
  refreshDocument(item: DocumentItem) {
    const transactionStatus = this.ohService.getTransactionStatus();
    this.transId = this.diseaseId;
    if (this.isTransferredInjury) {
      this.transId = this.transferInjuryId;
    }
    if (item && item.name) {
      this.documentService
        .refreshDocument(
          item,
          this.transId,
          null,
          null,
          this.referenceNo && transactionStatus?.english !== TransactionStatus.DRAFT ? this.referenceNo : null
        )
        .subscribe(res => {
          item = res;
          if (this.isTransferredInjury && item.name.english.toLowerCase() === 'medical report') {
            item.canDelete = false;
            this.medicalRecordDocumentItem = item;
          }
        });
    }
  }
  getRouteParam(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(params => {
      if (
        params &&
        params.get('transactionId') &&
        params.get('registrationNo') &&
        params.get('socialInsuranceNo') &&
        params.get('diseaseId') &&
        params.get('transferInjuryId')
      ) {
        this.transactionId = +params.get('transactionId');
        this.registrationNo = +params.get('registrationNo');
        this.socialInsuranceNo = +params.get('socialInsuranceNo');
        this.diseaseId = +params.get('diseaseId');
        this.transferInjuryId = +params.get('transferInjuryId');
        this.ohservice.setRegistrationNo(this.registrationNo);
        this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setDiseaseId(this.diseaseId);
        this.ohService.setTransferInjuryId(this.transferInjuryId);
        this.isEdit = true;
      }
    });
  }
  createReopenDiseaseForm() {
    return this.fb.group({
      reopenReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      modifyDiseaseIndicator: [false, { updateOn: blur }]
    });
  }
  saveReopenDetails() {
    if (this.processType === ProcessType.RE_OPEN) {
      if (!this.modifyIndicator) {
        this.bindDiseaseDetailForm();
      }
      this.diseaseDetails.reopenReason = this.reopenDiseaseForm.get('reopenReason').value;
      // this.diseaseDetails.modifyDiseaseIndicator = this.reopenDiseaseForm.get('modifyDiseaseIndicator').value;
      // this.diseaseDetails.emergencyContactNo = this.diseaseDetailsForm?.get('emergencyContactNo')?.value;
      if (this.isAppPrivate) {
        this.diseaseService.setNavigationIndicator(NavigationIndicator.CSR_REOPEN_DISEASE_DETAILS_SUBMIT);
      } else {
        this.diseaseService.setNavigationIndicator(NavigationIndicator.EST_ADMIN_REOPEN_DISEASE_DETAILS_SUBMIT);
      }
      if (this.reopenDiseaseForm.valid) {
        this.reopenReasonDetails.reOpenReason = this.diseaseDetails.reopenReason;
        this.diseaseService
          .saveReopenDisease(this.reopenReasonDetails, this.socialInsuranceNo, this.diseaseId)
          .subscribe(
            () => {
              // this.hideModal();
              this.nextForm();
            },
            err => {
              this.showError(err);
            }
          );
      }
      // if (this.diseaseDetailsForm?.get('payeeType.english')?.value === 'Contributor') {
      //   this.diseaseDetails.allowancePayee = 2;
      // } else if (this.diseaseDetailsForm?.get('payeeType.english')?.value === 'Establishment') {
      //   this.diseaseDetails.allowancePayee = 1;
      // }
    } else {
      this.diseaseDetails.emergencyContactNo = null;
      this.diseaseDetails.allowancePayee = null;
    }
  }
  saveDiseaseDetails() {
    if (this.previousOutcome === 'RETURN') {
      this.nextForm();
    } else {
      this.isPoMandatory = null;
      if (this.ohService.getIsNewDisease()) {
        this.diseaseId = null;
      }
      this.alertService.clearAlerts();
      markFormGroupTouched(this.diseaseDetailsForm);
      this.diseaseDetailsForm.markAllAsTouched();
      this.diseaseDetailsForm.updateValueAndValidity();
      if (!this.isAppPrivate) {
        this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').setValue(new Date());
      }
      this.diseaseDetails = this.diseaseDetailsForm.getRawValue();
      this.diseaseDetails.diseaseDiagnosisDate.gregorian = startOfDay(
        this.diseaseDetails.diseaseDiagnosisDate.gregorian
      );
      this.diseaseDetails.deathDate.gregorian = startOfDay(this.diseaseDetails.deathDate.gregorian);
      this.diseaseDetails.workDisabilityDate.gregorian = startOfDay(this.diseaseDetails.workDisabilityDate.gregorian);
      this.diseaseDetails.contributorInformedDate.gregorian = startOfDay(
        this.diseaseDetails.contributorInformedDate.gregorian
      );
      if(this.diseaseDetailsForm.get('employerInformedDate')?.get('gregorian')?.value){
        this.diseaseDetails.employerInformedOn = new GosiCalendar();
        this.diseaseDetails.employerInformedOn.gregorian =  startOfDay(
          this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').value
        );
      }
      this.diseaseDetails.employeeInformedDate = new GosiCalendar();
      this.diseaseDetails.employeeInformedDate.gregorian =  startOfDay(
        this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').value
      );

      this.diseaseDetails.diseaseDescriptionArray = this.splitDescription(this.diseaseDetails.diseaseDescription);
      this.diseaseDetails.diseaseCause = [];
      this.diseaseDetails.diseaseDescription = null;
      this.diseaseDetails.diseaseCause = this.diseaseDetailsForm
        ?.get('diseaseCause')
        ?.get('english')
        ?.value?.map(val => {
          return {
            english: this.diseaseCauseLovList.items[val?.sequence - 1]?.value?.english,
            arabic: this.diseaseCauseLovList.items[val?.sequence - 1]?.value?.arabic
          };
        });
      if (this.processType === ProcessType.RE_OPEN) {
        if (!this.modifyIndicator) {
          this.bindDiseaseDetailForm();
        }
      }
      if (this.processType === ProcessType.RE_OPEN) {
        this.diseaseDetails.reopenReason = this.reopenDiseaseForm.get('reopenReason').value;
        // this.diseaseDetails.modifyDiseaseIndicator = this.reopenDiseaseForm.get('modifyDiseaseIndicator').value;
        // this.diseaseDetails.emergencyContactNo = this.diseaseDetailsForm?.get('emergencyContactNo')?.value;
        if (this.isAppPrivate) {
          this.diseaseDetails.navigationIndicator = NavigationIndicator.CSR_REOPEN_DISEASE_DETAILS_SUBMIT;
        } else {
          this.diseaseDetails.navigationIndicator = NavigationIndicator.EST_ADMIN_REOPEN_DISEASE_DETAILS_SUBMIT;
        }
        // if (this.diseaseDetailsForm?.get('payeeType.english')?.value === 'Contributor') {
        //   this.diseaseDetails.allowancePayee = 2;
        // } else if (this.diseaseDetailsForm?.get('payeeType.english')?.value === 'Establishment') {
        //   this.diseaseDetails.allowancePayee = 1;
        // }
      } else {
        this.diseaseDetails.emergencyContactNo = null;
        this.diseaseDetails.allowancePayee = null;
        if (this.diseaseDetailsForm.get('payeeType')) {
          this.diseaseDetailsForm.get('payeeType.english').clearValidators();
          this.diseaseDetailsForm.get('payeeType.english').updateValueAndValidity();
        }
      }
      if (this.diseaseDetailsForm.valid) {
        if (!this.checkIfOccupationsAdded()) {
          this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATIONS_NOT_ADDED');
        } else {
          this.diseaseDetails.engagements = this.occupationDetailsToSave;
          this.isPoMandatory = this.diseaseDetails.diseaseLeadToDeathOfContributor;
          this.isPoMandatory = deepCopy(this.isPoMandatory);
          if (this.diseaseDetails.diseaseLeadToDeathOfContributor === true && !this.isAddressPresent) {
            this.isAddressOptional = false;
          }
          if (this.diseaseDetails.diseaseLeadToDeathOfContributor === false && !this.isAddressPresent) {
            this.isAddressOptional = true;
          }
          if (this.routerData.resourceType === DiseaseConstants.DISEASE && this.processType === ProcessType.EDIT) {
            this.diseaseDetails.navigationIndicator = NavigationIndicator.VALIDATOR_EDIT_DISEASE_DETAILS;
          }
          if (this.routerData.resourceType === TransferInjuryConstants.TRANSFER_INJURY) {
            this.diseaseDetails.navigationIndicator = NavigationIndicator.TRANSFER_INJURY_POST_DISEASE_DETAILS;
          }
          if (this.diseaseDetailsForm.get('diseaseLeadToDeathOfContributor').value === false) {
            this.diseaseDetails.deathDate = null;
          }
          if (this.isAppPublic) {
            this.diseaseDetails.establishmentRegNo = this.registrationNo;
          }
          this.reportedDate = this.diseaseDetails.diseaseDiagnosisDate;
          this.reportedDiseaseInformation.navigationIndicator = 0;
          this.registrationNo = this.ohService.getRegistrationNumber();
          this.getNavigationIndicator(this.routerData);
          if (
            this.diseaseDetailsForm?.get('diseaseCause')?.get('english')?.value ||
            this.diseaseDetailsForm?.get('diseaseCause')?.get('arabic')?.value
          ) {
            if (this.diseaseId && this.diseaseId !== 0) {
              this.diseaseDetails.diseaseId = this.diseaseId;
              this.diseaseDetails.isOccupationChanged = this.editedOccupation;
              this.diseaseService.updateDisease(this.diseaseDetails, this.registrationNo, this.isAppPublic).subscribe(
                response => {
                  this.diseaseId = response;
                  this.ohservice.setIsDisease(true);
                  this.disabled = this.getEngagementDetailsOfDisease(this.socialInsuranceNo, this.diseaseId);
                  this.ohService.setDiseaseId(this.diseaseId);
                  this.nextForm();
                },
                err => {
                  this.showError(err);
                }
              );
            } else {
              this.diseaseDetails.transferredInjuryid=this.transferInjuryId;
              this.diseaseDetails.isTransferredInjury=this.isTransferredInjury;
              this.diseaseService.reportDisease(this.diseaseDetails, this.registrationNo, this.isAppPublic).subscribe(
                response => {
                  this.diseaseId = response;
                  this.ohService.setIsNewDisease(false);
                  this.ohservice.setIsDisease(true);
                  this.ohService.setISNewTransaction(false);
                  this.diseaseDetails.diseaseId = this.diseaseId;
                  this.disabled = this.getEngagementDetailsOfDisease(this.socialInsuranceNo, this.diseaseId);
                  this.ohService.setDiseaseId(this.diseaseId);
                  this.nextForm();
                },
                err => {
                  this.showError(err);
                }
              );
            }
          }
        }
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  splitDescription(diseaseDescription: string) {
    this.diseaseDescriptionArray = diseaseDescription?.split(' ');
    this.diseaseDescriptionArray = this.diseaseDescriptionArray
      ?.reduce((res, item) => res.concat(item, ' '), [])
      ?.slice(0, -1);
    this.diseaseDescription = this.diseaseDescriptionArray?.join(',');
    console.log(this.diseaseDescription);
    return this.diseaseDescriptionArray;
  }
  getEngagementDetailsOfDisease(socialInsuranceNo, diseaseId) {
    this.diseaseService
      .getPayeeDetails(socialInsuranceNo, diseaseId, this.registrationNo, this.isAppPublic, false)
      .subscribe(
        response => {
          if (response?.applicablePayee?.length !== 2) {
            this.disabled = true;
          }
        },
        err => {
          this.showError(err);
        }
      );
    return this.disabled;
  }
  createDiseaseDetailsForm() {
    return this.fb.group({
      diseaseLeadToDeathOfContributor: [false, { disabled: true }],
      diseaseDiagnosisDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      workDisabilityDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      employerInformedDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      contributorInformedDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      diseaseDescription: [null, { validators: Validators.required }],
      diseaseDiagnosis: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      diseaseCause: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
      // payeeType: this.fb.group({
      //   english: ['Contributor', { validators: Validators.required, updateOn: 'blur' }],
      //   arabic: null
      // }),
      // emergencyContactNo: this.fb.group({
      //   primary: [
      //     '',
      //     {
      //       validators: Validators.compose([Validators.pattern('[0-9]+')]),
      //       updateOn: 'blur'
      //     }
      //   ],
      //   isdCodePrimary: ['sa', { updateOn: 'blur' }],
      //   secondary: [null],
      //   isdCodeSecondary: [null, { updateOn: 'blur' }]
      // })
    });
  }
  /**This method to get transferdiseaseId */
  getTransferDiseaseId() {
    this.diseaseService.getTransferDiseaseId(this.socialInsuranceNo, this.transferInjuryId).subscribe(
      response => {
        this.transferInjury = response;
        this.diseaseId = this.transferInjury.diseaseId;
        // this.getDiseaseDetails();
      },
      err => {
        this.showError(err);
      }
    );
  }
  getDiseaseDetails() {
    let isChangeRequired = false;
    this.ohService.setDiseaseId(this.diseaseId);
    if (
      this.routerData.taskId &&
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN)
    ) {
      isChangeRequired = true;
    }
    if (this.isEdit && (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN)) {
      isChangeRequired = true;
    }
    if (this.isEdit) {
      isChangeRequired = true;
    }
    this.diseaseService
      .getDiseaseDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.diseaseId,
        this.isAppPublic,
        isChangeRequired
      )
      .subscribe(
        response => {
          this.diseaseDetailsWrapper = response;
          if (this.diseaseDetailsWrapper?.diseaseDetailsDto?.status?.english === 'pending') {
            this.isValidator1 = true;
            this.isWorkflow = true;
          }
          if (this.processType === ProcessType.MODIFY && this.routerData.taskId !== null) {
            this.diseaseService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
          } else if (
            this.processType === ProcessType.RE_OPEN &&
            this.routerData.taskId !== null &&
            this.routerData.taskId !== undefined
          ) {
            this.diseaseService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_REOPEN_EDITS);
          }
          if (this.routerData.resourceType === DiseaseConstants.DISEASE && this.processType === ProcessType.EDIT) {
            this.diseaseService.setNavigationIndicator(NavigationIndicator.VALIDATOR_EDIT_DISEASE_DETAILS);
          }
          this.diseaseDetails = this.diseaseDetailsWrapper.diseaseDetailsDto;
          if (
            this.diseaseDetails &&
            this.diseaseDetails.requiredDocuments &&
            this.diseaseDetails.requiredDocuments.length > 0
          ) {
            this.documentsList = this.diseaseDetails.requiredDocuments;
          }
          this.emergencyContactNo = this.diseaseDetails.emergencyContactNo.primary;
          this.payeeType = this.diseaseDetails.allowancePayee;
          this.isdControl = this.diseaseDetails.emergencyContactNo.isdCodePrimary;
          if (
            (this.isWorkflow && this.diseaseDetailsForm) ||
            (this.isEdit && this.diseaseDetailsForm) ||
            this.processType === ProcessType.MODIFY ||
            this.processType === ProcessType.RE_OPEN
          ) {
            this.occupationsCausedDisease = this.diseaseDetailsWrapper.diseaseOccupationDurationDto;
            this.bindDiseaseDetailForm();
          }
          if (
            (this.isValidator2 === true && !this.isEdit) ||
            (this.previousOutcome === 'RETURN' && this.isEdit && this.isValidator2 === true)
          ) {
            this.businessTransaction =
              this.processType === ProcessType.RE_OPEN ? OHTransactionType.REOPEN_DISEASE : OHTransactionType.Disease;
            this.documentService
              .getDocuments(this.businessTransaction, OHTransactionType.Disease, this.diseaseId)
              .subscribe(documentResponse => {
                this.documentItem = documentResponse.filter(item => item.documentContent !== null);
                if(this.isTransferredInjury){
                  this.documentItem = documentResponse.filter(item => item.documentContent !== null && item.name.english.toLowerCase() !== 'medical report');
                  this.documentItem.push(this.medicalRecordDocumentItem);
                }               
                if (this.documentsList) {
                  for (const doc of this.documentsList) {
                    this.reqdocumentTemp = documentResponse.filter(
                      item => item.name.english.toLowerCase() === doc.english.toLowerCase()
                    );
                    this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
                    this.reqdocumentList.push(this.reqdocumentTemp);
                  }
                }
              });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  submitDocument(comments: string) {
    let actionFlag = false;
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      actionFlag = true;
    }
    if (this.processType === ProcessType.ADD) {
      actionFlag = true;
    }
    if (this.processType === ProcessType.RE_OPEN) {
      this.diseaseNumber = this.diseaseId;
    }
    if (this.documentForm.get('uploadDocument')) {
      this.documentForm.markAllAsTouched();
      if (this.documentForm.valid) {
        this.diseaseNumber = this.diseaseId;
        this.diseaseService
          .submitDisease(
            this.diseaseNumber,
            actionFlag,
            comments,
            this.registrationNo,
            this.isTransferredInjury,
            this.transferInjuryId,
            this.referenceNo,
            this.isAppPublic
          )
          .subscribe(
            response => {
              this.feedbackdetails = response;
              this.ohService.setDiseaseId(null);
              let status = 'modified';
              if (this.processType === ProcessType.RE_OPEN) {
                status = 're-open';
              }
              const transactionStatus = this.ohService.getTransactionStatus();
              this.diseaseService.setNavigationIndicator(NavigationIndicator.ADD_DISEASE);
              if (
                this.isWorkflow &&
                (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN) &&
                (this.routerData.taskId === null || this.routerData.taskId === undefined)
              ) {
                if (transactionStatus?.english === TransactionStatus.DRAFT) {
                  this.router.navigate(['home/transactions/list/history']);
                } else {
                  this.registrationNo = this.ohService.getRegistrationNumber();
                  this.router.navigate(
                    [`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.diseaseId}/disease/info`],
                    {
                      queryParams: {
                        status: status
                      }
                    }
                  );
                }
                this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
              } else if (
                (this.isTransferredInjury ||
                  this.processType === ProcessType.MODIFY ||
                  this.processType === ProcessType.RE_OPEN ||
                  this.processType === ProcessType.EDIT) &&
                this.routerData.taskId
              ) {
                const workflowData = new BPMUpdateRequest();
                workflowData.isExternalComment = true;
                workflowData.comments = this.documentForm.get('uploadDocument').get('comments').value;
                workflowData.taskId = this.routerData.taskId;
                workflowData.outcome = this.isAppPrivate ? WorkFlowActions.UPDATE : WorkFlowActions.SUBMIT;
                workflowData.user = this.routerData.assigneeId;
                this.workflowService.updateTaskWorkflow(workflowData).subscribe(
                  () => {
                    if (this.isAppPrivate && this.isWorkflow) {
                      this.router.navigate([RouteConstants.ROUTE_INBOX]);
                    } else if (!this.isAppPrivate && this.isWorkflow) {
                      this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
                    } else {
                      this.location.back();
                    }
                    this.alertService.clearAllErrorAlerts();
                    this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                  },
                  error => {
                    this.showError(error);
                  }
                );
              } else {
                this.ohService.resetValues();
                this.diseaseId = null;
                this.diseaseNumber = null;
                this.location.back();
                if (this.feedbackdetails.status.english === FeedbackStatus.REJECTED) {
                  this.alertService.showError(this.feedbackdetails.transactionMessage);
                } else if (
                  this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
                  this.feedbackdetails.status.english === FeedbackStatus.PENDING ||
                  this.feedbackdetails.status.english === FeedbackStatus.INPROGRESS
                ) {
                  this.alertService.clearAllErrorAlerts();
                  this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                  this.showSuccessMessage(this.feedbackdetails.transactionMessage);                  
                }
              }
              this.ohservice.setIsMessageForOcc(false);
            },
            error => {
              this.showError(error);
            }
          );
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  checkIfOccupationsAdded() {
    let exists = false;
    if (this.occupationDetailsToSave && this.occupationDetailsToSave.length > 0) {
      exists = true;
    }
    return exists;
  }

  bindDiseaseDetailForm() {
    bindToForm(this.diseaseDetailsForm, this.diseaseDetails);
    this.diseaseDetailsForm
      ?.get('diseaseDiagnosisDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.diseaseDiagnosisDate?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('workDisabilityDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.workDisabilityDate?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('employerInformedDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.employerInformedOn?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('contributorInformedDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.contributorInformedDate?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('diseaseLeadToDeathOfContributor')
      ?.setValue(this.diseaseDetails?.diseaseLeadToDeathOfContributor);
    if (this.diseaseDetails?.diseaseLeadToDeathOfContributor === true) {
      this.diseaseDetailsForm
        ?.get('deathDate')
        ?.get('gregorian')
        ?.setValue(moment(this.diseaseDetails?.deathDate?.gregorian).toDate());
    }
    if (this.diseaseDetailsForm?.get('diseaseCause')?.get('english')?.valid) {
      this.diseaseDetailsForm?.get('diseaseDiagnosis.english').setErrors(null);
      this.diseaseDetailsForm.get('diseaseDiagnosis.english').clearValidators();
    } else if (
      this.diseaseDetailsForm?.get('diseaseDiagnosis.english').valid &&
      this.diseaseDetailsForm?.get('diseaseCause')
    ) {
      this.diseaseDetailsForm?.get('diseaseCause.english').setErrors(null);
      this.diseaseDetailsForm.get('diseaseCause.english').clearValidators();
    }
  }

  /**
   * Method to initialize Lookups
   */
  initializeLookups() {
    this.cityList$ = this.lookupService.getCityList();
    this.booleanList$ = this.ohservice.getTreatmentCompleted();

    this.countryList$ = this.lookupService.getCountryList();
    this.diseaseDiagnosisList$ = this.lookupService.getDiseaseDiagnosisList();
    this.diseaseCauseList$ = this.lookupService.getDiseaseCauseList();
    this.lookupService.getDiseaseCauseList().subscribe(val => {
      this.diseaseCauseLovList = val;
    });
    this.reopenReason$ = this.lookupService.getReopenDiseaseReason(LookupCategory.REGISTRATION);
    this.governmentSectorList$ = this.lookupService.getGovernmentSectorList();
    if (this.isAppPrivate) {
      this.establishmentList$ = this.lookupService.getEstablishmentNameList(this.socialInsuranceNo);
    }
  }

  convertToLOVlistWithCategory() {
    if (!this.newOccupationList.items) {
      this.newOccupationList.items = [];
    }
    this.newOccupationList.items = [];

    if (this.occupationList$) {
      this.occupationList$.subscribe(items => {
        if (items && items.items) {
          this.occupations = items.items;
          if (this.occupations.length > 0) {
            this.occupations.forEach(occupation => {
              const lovCategory = {
                code: occupation.code,
                sequence: '0',
                value: occupation.value,
                category: { english: 'Unregistered Occupations', arabic: 'المهنة غير المسجلة' },
                groupByValueEnglish: 'Unregistered Occupations',
                groupByValueArabic: 'المهنة غير المسجلة'
              };
              if (this.newOccupationList.items.length > 0) {
                if (!this.containsObject(lovCategory, this.newOccupationList.items)) {
                  this.newOccupationList.items.push(lovCategory);
                }
              } else {
                this.newOccupationList.items.push(lovCategory);
              }
            });
            this.isOccupationsLoaded = true;
          }
        }
        if (this.registeredOccupatonsList && this.registeredOccupatonsList.length > 0) {
          this.registeredOccupatonsList.forEach(occupation => {
            const lovCategory = {
              code: occupation.english,
              sequence: '0',
              value: occupation,
              category: { english: 'Registered Occupations', arabic: 'المهنة المسجلة' },
              groupByValueEnglish: 'Registered Occupations',
              groupByValueArabic: 'المهنة المسجلة'
            };
            if (this.newOccupationList.items.length > 0) {
              if (!this.containsObject(lovCategory, this.newOccupationList.items)) {
                this.newOccupationList.items.push(lovCategory);
              }
            } else {
              this.newOccupationList.items.push(lovCategory);
            }
          });
        }
      });
    }
  }
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].value.english === obj.value.english && list[i].value.english === obj.value.english) {
        return true;
      }
    }
    return false;
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
    this.diseaseService
      .saveAllowancePayee(payeeType, this.navigationIndicator, this.registrationNo, this.isAppPublic)
      .subscribe(
        response => {
          response = response;
          if (response.english.indexOf(OhConstants.PAYEE_MSG) !== -1) {
            this.payeeInfo = true;
            this.payeeInfoMessage = response;
            // this.showModal(this.errorTemplate, 'modal-lg');
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
  getNavigationIndicator(routerData) {
    if (this.processType === ProcessType.MODIFY && !routerData.taskId) {
      if (this.isEdit) {
        this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.CSR_EDITS;
      }
    } else if (this.processType === ProcessType.MODIFY && routerData.taskId !== null) {
      if (this.isEdit) {
        this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS;
      }
    } else if (this.processType === ProcessType.REOPEN) {
      if (this.isAppPrivate) {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.CSR_REOPEN_INJURY;
        }
      } else {
        if (routerData.taskId) {
          if (this.isEdit) {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_REOPEN_EDITS;
          }
        } else {
          if (this.isEdit) {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
          } else {
            this.reportedDiseaseInformation.navigationIndicator = NavigationIndicator.EST_ADMIN_REOPEN_INJURY;
          }
        }
      }
    }
    this.injuryService.setNavigationIndicator(this.reportedDiseaseInformation.navigationIndicator);
  }
}
