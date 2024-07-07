import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  CalendarTypeEnum,
  Channel,
  CsvFile,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  InspectionReferenceType,
  InspectionService,
  InspectionStatus,
  InspectionTypeEnum,
  LanguageToken,
  LookupService,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService,
  convertToStringDDMMYYYY,
  getPersonNameAsBilingual,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { EstablishmentDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';
import { LegalEntityEnum, OrganisationTypeEnum } from '@gosi-ui/features/establishment';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  Contributor,
  ContributorConstants,
  ContributorRouteConstants,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  EstablishmentService,
  PersonalInformation,
  TransactionId,
  ValidatorBaseScComponent
} from '../../../../shared';
import { SaveEngagementPayload } from '../../../../shared/models/e-inspection-saveEngagement';

@Component({
  selector: 'cnt-validate-e-registration-sc',
  templateUrl: './validate-e-registration-sc.component.html',
  styleUrls: ['./validate-e-registration-sc.component.scss']
})
export class ValidateERegistrationScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  //Local Variables
  lang = 'en';
  collapseView = false;
  documents: DocumentItem[];
  csvDocument: CsvFile;
  searchDetailsCsr: EstablishmentDetails;
  booleanList: LovList;
  docUploaded = false;

  isBeneficiary: boolean = false;
  canEdit: boolean = true;
  isSvg = false;
  status = '';
  age: number = 10;
  MAX_LENGTH: number = 9;
  uuid: string;

  // local variables for action area
  canRequestInspection = false;
  canReturn = false;
  canReject = true;
  canApprove = true;
  isReturn = false;
  disableApprove = false;
  disableReject = false;
  disableReturn = false;
  engDetailsCsr: SaveEngagementPayload;
  joiningDate: string;
  leavingDate: string;
  personId: number;
  gosiRegistrationNumber: number;
  personNin = [];
  isCsr: boolean = false;
  isValidator1: boolean = false;
  isValidator2: boolean = false;
  isFC: boolean = false;
  isAdmin: boolean = false;
  flag: boolean = false;
  error: boolean = false;
  referenceNo: number;
  requestId: number;
  identifier: number;
  person: PersonalInformation;
  AdminDetailsForm: FormGroup;
  documentsForm: FormGroup;
  searchKeyForm: FormGroup;
  // searchKeyControl: FormControl = new FormControl(this.searchKey, Validators.compose([Validators.minLength(3)]));
  isActive: boolean;
  engagementStatus: string;
  isGccEstablishment = false;
  hasInspectionCompleted = false;
  fieldActivityNumber: string;

  /** Observables */
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  isDocumentUpload: boolean;
  disableEdit: boolean;
  transactionId: number;
  adminDocuments: DocumentItem[];
  customActions = [];
  contributorDocs: DocumentItem[];
  payload;
  minDiff: any;
  seconds: string;
  secDiff: any;

  @Input() badge: string = null;

  //Output Vairables
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();
  @Output() onCollapse: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadCsv: EventEmitter<null> = new EventEmitter();

  //Output Variables action area
  @Output() approveEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() rejectEvent: EventEmitter<null> = new EventEmitter();
  @Output() returnEvent: EventEmitter<null> = new EventEmitter();
  heading = { english: 'Add Backdated Engagement', arabic: 'إضافة مدة اشتراك بأثر رجعي' };
  taskId: string = undefined;
  isUnclaimed: boolean;

  constructor(
    private fb: FormBuilder,
    readonly inspectionService: InspectionService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private uuidGeneratorService: UuidGeneratorService,
    readonly transactionService: TransactionService
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
    this.language.subscribe(res => (this.lang = res));
  }

  ngOnInit(): void {
    this.transactionId = TransactionId.E_REGISTER_ENGAGEMENT;
    super.getSystemParameters();
    this.getUuid();
    this.setDataFromToken(this.routerDataToken);
    if (
      this.routerDataToken?.assignedRole === Role.BRANCH_ADMIN ||
      this.routerDataToken?.assignedRole.toLowerCase() === Role.ADMIN ||
      this.routerDataToken?.assignedRole === Role.ADMINPOOL
    ) {
      this.isAdmin = true;
      this.alertService.clearAlerts();
      //console.log('val ', this.engDetailsCsr);
      this.getDataForView();

      this.AdminDetailsForm = this.createDetailsForm();
      this.documentsForm = this.createDocsForm();
      this.booleanList = {
        items: [
          { value: { english: 'Agree', arabic: 'نعم' }, sequence: 0 },
          { value: { english: 'Disagree', arabic: 'لا' }, sequence: 1 }
        ]
      };
    } else {
      this.contributor = new Contributor();
      this.isAdmin = false;
      this.alertService.clearAlerts();
      this.getDefaultLookupValues();
      super.readDataFromToken(this.routerDataToken);
      super.setFlagsForView(this.routerDataToken);
      if (
        this.routerDataToken.assignedRole === Role.VALIDATOR_1 ||
        this.routerDataToken?.assignedRole === Role.VALIDATOR
      ) {
        this.isValidator1 = true;
        this.checkInspectionRequired();
      } else if (this.routerDataToken.assignedRole === Role.VALIDATOR_2) {
        this.isValidator2 = true;
        this.canReturn = true;
      } else if (
        this.routerDataToken.assignedRole === Role.CNT_FC_APPROVER ||
        this.routerDataToken.assignedRole === Role.FC_CONTROLLER
      ) {
        this.isCsr = false;
        this.isFC = true;
        this.canReturn = true;
      } else {
        this.isCsr = true;
        this.searchKeyForm = this.createSearchForm();
      }
      this.getPersonDetails(this.identifier);
      this.getDataForView();
      // this.getDocument();
    }
    this.calculateTimeDiff();
  }
  createDocsForm(): any {
    return this.fb.group({
      docs: null
    });
  }
  handleTitle() {
    if (this.isPPA && this.channel === Channel.TAMINATY) {
      this.heading = { english: this.titleEnglish, arabic: this.titleArabic };
    } else {
      this.heading = { english: 'Add Backdated Engagement', arabic: 'إضافة مدة اشتراك بأثر رجعي' };
    }
  }
  getUuid() {
    this.uuid = this.uuidGeneratorService.getUuid();
  }
  //if (this.channel === Channel.RASED)
  /** Method to check whether inspection is completed. */
  checkWhetherInspetionIsCompleted() {
    this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).subscribe(
      // filter(res => res && res.length > 0),
      res => {
        this.hasInspectionCompleted = res[0]?.inspectionTypeInfo?.status === InspectionStatus.COMPLETED;
        this.fieldActivityNumber = res[0]?.fieldActivityNumber;
        if (this.hasInspectionCompleted) {
          this.getInspectionDocuments();
        }
      }
    );
  }

  /** Method to get Inspection documents. */
  getInspectionDocuments() {
    this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.identifier,
        InspectionReferenceType.NATIONAL,
        this.fieldActivityNumber
      )
      .subscribe(
        docs => {
          if (docs.length > 0) this.documents = docs.concat(this.documents);
        },
        catchError(err => {
          return of(this.documents);
        })
      );
  }

  /** Method to check whether inspection is required. */
  checkInspectionRequired() {
    const validatorActions = this.routerDataToken.customActions;
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.SEND_FOR_INSPECTION) {
        this.canRequestInspection = true;
      }
    });
  }

  createSearchForm() {
    return this.fb.group({
      searchKey: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH)]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /** Method to get values for nin,requestid. */
  setDataFromToken(token: RouterData) {
    if (token.payload) {
      this.payload = JSON.parse(token.payload);
      // this.isGccEstablishment = payload.isGccEstablishment? Boolean(payload.isGccEstablishment) : null;
      this.referenceNo = this.payload.referenceNo ? Number(this.payload.referenceNo) : null;
      this.requestId = this.payload.id ? Number(this.payload.id) : null;
      this.identifier = this.payload.identifier ? Number(this.payload.identifier) : null;
      this.gosiRegistrationNumber = this.payload.registrationNo ? Number(this.payload.registrationNo) : null;
      this.isUnclaimed = this.payload?.isPool;
      //console.log(this.gosiRegistrationNumber);
      if (this.payload.titleEnglish) this.titleEnglish = this.payload.titleEnglish;
      if (this.payload.titleArabic) this.titleArabic = this.payload.titleArabic;
      this.taskId = this.routerDataToken.taskId;
    }
    this.channel = token.channel;
    this.customActions = token?.customActions;
    this.comments = token.comments;
  }

  /** Method to get lookup values for component. */
  getDefaultLookupValues() {
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
  }

  /**Method to get engagement details */
  getDataForView() {
    this.contributorService
      .getAddMissingEngagementDetails(this.gosiRegistrationNumber, this.identifier, this.requestId)
      .subscribe(
        res => {
          this.engDetailsCsr = res;
          this.disableEdit = res?.ppaEstablishment;
          this.isPPA = res?.ppaEstablishment;
          this.handleTitle();
          this.getDataForViewAdmin(this.identifier);
          if (this.engDetailsCsr.engagementRequestDto?.joiningDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
            this.joiningDate = convertToStringDDMMYYYY(
              this.engDetailsCsr.engagementRequestDto?.joiningDate?.gregorian?.toString()
            );
          } else {
            this.joiningDate = convertToStringDDMMYYYY(this.engDetailsCsr.engagementRequestDto?.joiningDate?.hijiri);
          }
          if (this.engDetailsCsr.engagementRequestDto.leavingDate) {
            if (this.engDetailsCsr.engagementRequestDto?.leavingDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
              this.leavingDate = convertToStringDDMMYYYY(
                this.engDetailsCsr.engagementRequestDto?.leavingDate?.gregorian?.toString()
              );
            } else {
              this.leavingDate = convertToStringDDMMYYYY(this.engDetailsCsr.engagementRequestDto?.leavingDate?.hijiri);
            }
          }
          if (!this.isCsr && this.engDetailsCsr.establishmentStatus) this.status = 'CONTRIBUTOR.ACTIVE';
          else if (!this.isCsr) this.status = 'CONTRIBUTOR.INACTIVE';

          this.isActive = this.engDetailsCsr.engagementRequestDto?.isActive;
          if (this.isActive) {
            this.engagementStatus = 'CONTRIBUTOR.ACTIVE';
          } else {
            this.engagementStatus = 'CONTRIBUTOR.INACTIVE';
          }
          if (!this.isAdmin) {
            this.isPPA ? this.getAllDocs(this.referenceNo) : this.getDocument();
          }
          if (this.isAdmin && this.isPPA) {
            this.getAdminDocuments();
            this.getContributorUploadedDocs();
          }
        },
        err => this.alertService.showError(err.error.message)
      );
  }

  getAllDocs(referenceNo: number) {
    this.documentService.getAllDocuments(null, referenceNo).subscribe(res => {
      this.documents = res.filter(item => item.documentContent !== null);
    });
  }
  /** Method to get documents. */
  getDocument() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
        this.isPPA
          ? [
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA,
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_REJECT
            ]
          : DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION,
        this.requestId
      )
      .subscribe(res => (this.documents = res));
  }
  /** Method to get documents. */
  getAdminDocuments() {
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    this.documentService
      .getDocuments(
        DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
        approveWithDocs
          ? DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITH_DOCUMENT
          : DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITHOUT_DOCUMENT,
        this.requestId
      )
      .subscribe(res => (this.adminDocuments = res));
  }
  getContributorUploadedDocs() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
        DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA,
        this.engagementId,
        this.referenceNo
      )
      .subscribe(res => {
        this.contributorDocs = res.filter(item => item.documentContent !== null);
      });
  }
  /** Method to get personel details. */
  getPersonDetails(nin) {
    const queryParams: string = `NIN=${nin}`;
    this.contributorService
      .getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          this.contributor.person = res;
          this.age = res.ageInHijiri;
          this.personNin[0] = res.identity[0];
          this.socialInsuranceNo = res.socialInsuranceNumber[0];
          if (!this.isCsr && !this.isPPA) this.checkWhetherInspetionIsCompleted();
        })
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }
  // Method to show error message.
  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }

  /** Method to navigate back to e-inspection personal page for editing */
  onEditPersonalDetails() {
    this.routerDataToken.tabIndicator = 0;
    this.routerDataToken.priority = this.identifier;
    this.routerDataToken.transactionId = this.requestId;
    this.router.navigate([ContributorRouteConstants.ROUTE_E_REGISTER_EDIT]);
  }

  /** Method to navigate back to e-inspection engagement page for editing */
  onEditContent() {
    this.routerDataToken.tabIndicator = 1;
    this.routerDataToken.priority = this.identifier;
    this.routerDataToken.transactionId = this.requestId;
    this.router.navigate([ContributorRouteConstants.ROUTE_E_REGISTER_EDIT]);
  }

  /** Method to navigate back to e-inspection document page for editing */
  onEditDocument() {
    this.routerDataToken.tabIndicator = 2;
    this.routerDataToken.priority = this.identifier;
    this.routerDataToken.transactionId = this.requestId;
    this.router.navigate([ContributorRouteConstants.ROUTE_E_REGISTER_EDIT]);
  }

  downloadCsvFile(): void {
    this.downloadCsv.emit();
  }

  // Method to emit return details

  returnEventDetails() {
    this.returnEvent.emit();
  }
  // Method to emit reject details

  rejectEventDetails() {
    this.rejectEvent.emit();
  }
  // Method to emit approve details

  approveEventDetails() {
    this.approveEvent.emit();
  }

  cancelEventDetails() {
    this.cancelEvent.emit();
  }

  /**
   * method to emit search event
   */
  onSearch() {
    this.alertService.clearAllErrorAlerts();
    this.registrationNo = this.searchKeyForm.get('searchKey').value;
    if (this.registrationNo !== null && this.searchKeyForm.get('searchKey').value.trim() !== '') {
      // if (this.searchKeyForm.get('searchKey').value) this.searchKeyForm.setValue(this.searchKeyForm.get('searchKey').value.trim());
      this.contributorService.getESearch(this.searchKeyForm.get('searchKey').value).subscribe(
        res => {
          if (res) {
            this.setNationality(res);
            //console.log('get data', res);
            this.error = false;
            this.searchDetailsCsr = res;
            //console.log(this.searchDetailsCsr.status.english);
            if (this.searchDetailsCsr?.status.english === EstablishmentStatusEnum.REGISTERED) {
              this.status = 'CONTRIBUTOR.ACTIVE';
            }
            //  else if (
            //   this.searchDetailsCsr?.status.english === EstablishmentStatusEnum.CLOSED ||
            //   this.searchDetailsCsr?.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
            // ){
            //   this.error=true;
            //   this.status = 'CONTRIBUTOR.INACTIVE';
            //   this.alertService.showErrorByKey('CONTRIBUTOR.NOT-REGISTERED');
            // }
            else this.status = 'CONTRIBUTOR.INACTIVE';
          }
        },
        err => {
          this.status = '';
          this.error = true;
          this.alertService.showErrorByKey('CONTRIBUTOR.INVALID-EST-NUMBER');
        }

        // err => this.showAlertDetails(err)
      );

      // {
      //   this.isSearchIcon = false;
      // } else this.isSearchIcon = true;
    } else {
      this.alertService.showMandatoryErrorMessage();
      this.status = '';
    }
  }

  setNationality(res) {
    if (res.proactive === true) {
      this.isGccEstablishment = false;
    } else if (res.organizationCategory?.english === OrganisationTypeEnum.GCC) {
      this.isGccEstablishment = true;
    } else if (
      res.legalEntity &&
      (res.legalEntity.english === LegalEntityEnum.GOVERNMENT || res.legalEntity.english === LegalEntityEnum.SEMI_GOV)
    ) {
      this.isGccEstablishment = false;
    } else {
      this.isGccEstablishment = false;
    }
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    //console.log(data);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to handle reject events. */
  handleApprove() {
    if (this.isCsr) {
      const bpmRequest = new BPMUpdateRequest();
      bpmRequest.updateMap.set(BPMMergeUpdateParamEnum.ISGCCESTABLISHMENT, this.isGccEstablishment);
      const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
      bpmRequest.outcome = approveWithDocs && this.isPPA ? WorkFlowActions.APPROVE_WITH_DOCS : WorkFlowActions.APPROVE;
      bpmRequest.isGccEstablishment = this.isGccEstablishment;
      bpmRequest.payload = this.routerDataToken.content;
      if (bpmRequest.payload) {
        Object.keys(bpmRequest.payload).forEach(key => {
          this.setRegistraionNo(bpmRequest.payload[key], this.registrationNo);
        });
      }
      bpmRequest.commentScope = 'BPM';
      bpmRequest.isExternalComment = false;
      bpmRequest.comments = this.validatorForm.get('comments').value;
      bpmRequest.taskId = this.routerDataToken.taskId;
      bpmRequest.user = this.routerDataToken.assigneeId;
      //console.log(bpmRequest);
      this.contributorService.einspectionCsrApprove(this.identifier, this.requestId, this.registrationNo).subscribe(
        res => {
          this.workflowService.mergeAndUpdateTask(bpmRequest).subscribe(
            () => {
              const successMessage = this.getSuccessMessage(bpmRequest.outcome);
              this.alertService.showSuccessByKey(successMessage, null, 5);
              this.hideModal();
              this.navigateBack();
            },
            err => {
              this.hideModal();
              scrollToTop();
              this.alertService.showError(err.error.message);
            }
          );
        },
        err => {
          this.hideModal();
          scrollToTop();
          if (err.error.details) this.alertService.showError(err.error.details[0].message);
          else this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.valDetailSubmit();
    }
  }

  valDetailSubmit() {
    const bpmRequest = new BPMUpdateRequest();
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    bpmRequest.outcome = approveWithDocs && this.isPPA ? WorkFlowActions.APPROVE_WITH_DOCS : WorkFlowActions.APPROVE;
    bpmRequest.taskId = this.routerDataToken.taskId;
    this.workflowService.updateTaskWorkflow(bpmRequest).subscribe(
      res => {
        if (res) {
          this.hideModal();
          this.alertService.showSuccessByKey('BILLING.TRANSACTION-APPROVED', null, 5);
          this.router.navigate([RouterConstants.ROUTE_HOME]);
        }
      },
      err => {
        this.hideModal();
        this.alertService.showError(err.error.message);
      }
    );
  }

  // method to set registration number to payload for approval
  setRegistraionNo(obj: any, regNo: Number) {
    for (const key in obj) {
      if (key === 'registrationNo') {
        obj[key] = regNo;
        return;
      }
      if (typeof obj[key] === 'object') {
        this.setRegistraionNo(obj[key], regNo);
      }
    }
  }

  /** Method to handle cancel events. */
  confirmCancel() {
    this.hideModal();
    this.navigateBack();
  }

  /** Method to navigate back to inbox page. */
  navigateBack() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isAutoSize = false, disableEsc = false, flag = false): void {
    if (flag && !this.error) {
      //flag true for Approve button
      if (this.isCsr ? this.searchKeyForm.valid : this.isValidator1 || this.isValidator2 || this.isFC) {
        const style = isAutoSize ? '' : 'modal-lg ';
        this.modalRef = this.modalService.show(templateRef, {
          class: style + 'modal-dialog-centered',
          backdrop: true,
          ignoreBackdropClick: true,
          keyboard: !disableEsc
        });
      } else {
        this.alertService.showMandatoryErrorMessage();
        this.status = '';
      }
      markFormGroupTouched(this.searchKeyForm);
    } else if (flag && this.error) this.onSearch();
    else if (!flag) {
      const style = isAutoSize ? '' : 'modal-lg ';
      this.modalRef = this.modalService.show(templateRef, {
        class: style + 'modal-dialog-centered',
        backdrop: true,
        ignoreBackdropClick: true,
        keyboard: !disableEsc
      });
    }
  }

  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }

  // ..........................Admin..................................................................

  // admin FOrm

  createDetailsForm() {
    return this.fb.group({
      agree: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      comments: null
    });
  }

  getDataForViewAdmin(nin) {
    const queryParams: string = `NIN=${nin}`;
    this.contributorService
      .getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          if (res) {
            this.contributor = new Contributor();
            this.person = this.contributor.person = res;
            this.socialInsuranceNo = res.socialInsuranceNumber[0];
            //console.log('Social Insurance number:', res.socialInsuranceNumber);
          }
        }),
        switchMap(res => {
          if (res.personId && !this.isPPA)
            //To check sin for existing contributor
            return this.contributorService.setSin(this.person.personId).pipe(
              tap(response => {
                if (response) {
                  this.socialInsuranceNo = response.socialInsuranceNo;
                }
              })
            );
        })
      )
      .subscribe({
        next: () => {
          this.alertService.clearAllErrorAlerts();
        },
        error: err => this.showError(err)
      });
  }

  submitDetails() {
    if (this.AdminDetailsForm.valid) {
      //(this.AdminDetailsForm);

      //console.log('submitted successfully');
      const bpmRequest = new BPMUpdateRequest();
      this.AdminDetailsForm.value.agree.english === 'Agree'
        ? (bpmRequest.outcome = WorkFlowActions.APPROVE)
        : (bpmRequest.outcome = WorkFlowActions.REJECT);
      bpmRequest.taskId = this.routerDataToken.taskId;
      if (bpmRequest.outcome === WorkFlowActions.APPROVE && this.isPPA) {
        this.handleApproveForPPA(bpmRequest);
      } else {
        this.workflowService.updateTaskWorkflow(bpmRequest).subscribe(
          res => {
            if (res) {
              if (
                (bpmRequest.outcome === WorkFlowActions.APPROVE ||
                  bpmRequest.outcome === WorkFlowActions.APPROVE_WITH_DOCS) &&
                this.isPPA
              ) {
                this.alertService.showSuccessByKey(
                  'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE',
                  null,
                  5
                );
              } else if (bpmRequest.outcome === WorkFlowActions.REJECT && this.isPPA) {
                let personName = getPersonNameAsBilingual(this.person?.name);
                if (personName?.english || personName?.arabic) {
                  personName.english = personName?.english ?? personName?.arabic;
                }
                const params = {
                  personFullName: personName,
                  transactionId: this.transactionId
                };
                this.alertService.showSuccessByKey(
                  'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-EREGISTER-REJECT',
                  params,
                  5
                );
              } else {
                this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE', null, 5);
              }
              this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
            }
          },
          err => this.alertService.showError(err.error.message)
        );
      }
    } else this.alertService.showMandatoryErrorMessage();
  }
  handleApproveForPPA(bpmRequest: BPMUpdateRequest) {
    const comments = this.documentsForm.get('comments')?.get('comments').value;
    bpmRequest.comments = comments;
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    if (approveWithDocs) bpmRequest.outcome = WorkFlowActions.APPROVE_WITH_DOCS;
    if (this.documentService.checkMandatoryDocuments(this.adminDocuments)) {
      this.contributorService
        .submitAdminApprove(this.gosiRegistrationNumber, this.identifier, this.requestId)
        .subscribe(
          () => {
            this.workflowService.updateTaskWorkflow(bpmRequest).subscribe(
              res => {
                if (res) {
                  let personName = getPersonNameAsBilingual(this.person?.name);
                  if (personName?.english || personName?.arabic) {
                    personName.english = personName?.english ?? personName?.arabic;
                  }
                  const params = {
                    personFullName: personName,
                    transactionId: this.transactionId
                  };
                  this.alertService.showSuccessByKey(
                    'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-AGREE-EREGISTER-APPROVE',
                    params,
                    5
                  );
                  this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
                }
              },
              err => this.alertService.showError(err.error.message)
            );
          },
          err => {
            this.showError(err);
          }
        );
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }
  saveCancellationDetails() {
    this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
  }

  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }

  /** Method to check for  active inspection. */
  checkForActiveInspection() {
    this.inspectionService
      .getInspectionList(this.registrationNo, this.socialInsuranceNo, true)
      .pipe(
        tap(res => {
          if (res.length > 0)
            this.alertService.showErrorByKey(ContributorConstants.VALIDATOR_CANNOT_SEND_FOR_INSPECTION, {
              personFullName: this.getPersonName(),
              transactionId: Number(res[0].transactionTraceId)
            });
          else
            this.initiateInspection(
              this.routerDataToken,
              'CONTRIBUTOR.SUCCESS-MESSAGES.REGISTER-INSPECTION-SUCCESS-MESSAGE'
            );
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
  }
  listenForAdminDecision(decision) {
    this.documentsForm?.get('comments')?.get('comments').setValue(null);
    if (this.isPPA && decision === 'Agree') {
      this.isDocumentUpload = true;
    } else {
      this.isDocumentUpload = false;
    }
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService;
      this.documentService
        .refreshDocument(
          doc,
          this.engagementId,
          DocumentTransactionId.CHANGE_ENGAGEMENT,
          null,
          this.referenceNo,
          this.uuid
        )
        .subscribe(res => {
          doc = res;
        });
    }
  }
  checkForDocumentUpload() {
    const flag = this.adminDocuments?.filter(doc => doc?.uploaded === true).length > 0;
    if (flag) this.docUploaded = true;
    else this.docUploaded = false;
    return flag;
  }

  claimTask() {
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      (res: any) => {
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
      },
      err => {
        //console.log(err.error.status, err.headers.status);
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
        setTimeout(() => {
          this.alertService.showError(value);
        }, 500);
      }
    );
    //  this.onClaimClicked.emit();
  }
  calculateTimeDiff() {
    var currentDate: any = this.payload.currentDate;
    var convertedDate: any = moment.tz(currentDate, 'Asia/Riyadh');
    var expDate: any = this.payload.claimTaskExpiry;
    // console.log(currentDate,convertedDate.format())
    var updated = moment(convertedDate.format(), 'DD-MM-YYYY HH:mm:ss'); //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    if (expDate == 'NULL') {
      this.minDiff = '89';
      this.seconds = '0';
    } else {
      this.minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
      this.secDiff = expiry.diff(updated, 'seconds');
      this.seconds = (this.secDiff % 60).toString();
    }
  }
  release() {
    this.minDiff = '89';
    this.seconds = '0';
    this.payload.claimTaskExpiry = 'NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.isUnclaimed = true;
      setTimeout(() => {
        this.router.navigate(['home/transactions/list/todolist']);
      }, 2000);
    });
  }
}
