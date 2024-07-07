import {Location} from '@angular/common';
import {ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Alert,
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  ContactDetails,
  DocumentItem,
  DocumentService,
  EmailType,
  getAlertSuccess,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  scrollToTop,
  Transaction,
  UuidGeneratorService,
  WizardItem,
  greaterThanValidator,
  startOfDay,
  GosiCalendar,
  CoreIndividualProfileService
} from '@gosi-ui/core';
import {ProgressWizardDcComponent} from '@gosi-ui/foundation-theme/lib/components/widgets/progress-wizard-dc/progress-wizard-dc.component';
import {ContactDcComponent} from '@gosi-ui/foundation/form-fragments';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {BehaviorSubject, fromEvent, Observable, of} from 'rxjs';
import {OhConstants} from '../../constants/oh-constants';
import {Person, ReimbursementDetails, ReimbursementRequestDetails} from '../../models';
import {ComplicationService, ContributorService, DiseaseService, EstablishmentService, InjuryService} from '../../services';
import {OhClaimsService} from '../../services/oh-claims.service';
import {OhService} from '../../services/oh.service';
import {OhBaseScComponent} from '../base';
import {map, catchError} from 'rxjs/operators';

@Component({
  selector: 'oh-reimbursement-claims-sc',
  templateUrl: './reimbursement-claims-sc.component.html',
  styleUrls: ['./reimbursement-claims-sc.component.scss']
})
export class ReimbursementClaimsScComponent extends OhBaseScComponent implements OnInit {
  lang = 'en';
  isViewOnly = false;
  isAppPrivate: boolean;
  items: Lov[] = [];
  payeeList: LovList = null;
  payee = 2;
  booleanList$: Observable<LovList>;
  modalRef: BsModalRef;
  maxLengthComments = 300;
  person: Person;
  emailId: EmailType = new EmailType();
  isTreatmentWithinSaudiArabia = true;
  uuid: string;
  reimbursementDetails: ReimbursementDetails;
  reimbDetails: ReimbursementRequestDetails;
  scanSucess = true;
  socialInsuranceNo: number;
  registrationNo: number;
  complicationId: number;
  injuryNo: number;
  injuryId: number;
  feedBackMessage: Alert;
  documentScanList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  documents: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  currentTab = 0;
  referenceNo: number;
  reimbId: number;
  payeeListForm: FormGroup;
  amountForm: FormGroup;
  treatmentListForm: FormGroup;
  contactForm: FormGroup = new FormGroup({});
  reimbursementWizardItem: WizardItem[] = [];
  totalTabs = 2;
  id: number;
  isdControl: string;
  isEdit = false;
  transaction: Transaction;
  transactionRefId: number;
  transactionId: number;
  commentsReimb: FormGroup;
  showAmount: boolean;
  invoiceRequestDate: GosiCalendar = new GosiCalendar();
  hospitalList$: Observable<LovList>;
  currentDate: Date = new Date();
  @ViewChild('contactDetails', {static: false})
  contactDetailsComponent: ContactDcComponent;
  @ViewChild('cancelInjury', {static: false})
  private cancelInjuryModal: TemplateRef<HTMLElement>;
  @ViewChild('errorTemplate', {static: true})
  errorTemplate: TemplateRef<HTMLElement>;
  @ViewChild('reportOHTabs', {static: false})
  reportOHTabs: TabsetComponent;
  @ViewChild('reimbursementWizard', {static: false})
  reimbursementWizard: ProgressWizardDcComponent;
  prefix: string;
  contact: ContactDetails = new ContactDetails();
  refNo: number;
  bussinessId: number;

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
    readonly claimService: OhClaimsService,
    readonly router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly uuidService: UuidGeneratorService,
    readonly activatedRoute: ActivatedRoute,
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly individualService: CoreIndividualProfileService
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
  }


  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.initializeWizardItems();
    this.language.subscribe(language => (this.lang = language));
    this.alertService.clearAlerts();
    this.uuid = this.uuidService.getUuid();
    this.items.push({
      value: {english: 'Contributor', arabic: ' مشترك'},
      sequence: 1
    });
    this.items.push({value: {english: 'Establishment', arabic: 'منشأة'}, sequence: 2});
    if (this.isAppPrivate) {
      this.items.push({value: {english: 'Hospital', arabic: 'الجهة العلاجية'}, sequence: 3});
    }
    this.payeeList = new LovList(this.items);
    this.payeeListForm = this.createPayeeForm();
    this.amountForm = this.createAmountForm();
    this.commentsReimb = this.createCommentsForm();
    this.treatmentListForm = this.createYesorNoList();
    this.booleanList$ = this.ohservice.getTreatmentCompleted();
    this.hospitalList$ = this.getHospitalList();
    this.activatedRoute.params.subscribe(res => {
      this.registrationNo = res.registrationNo;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.socialInsuranceNo = res.socialInsuranceNo;
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.injuryId = res.injuryId;
      this.complicationId = res.complicationId;
      this.injuryNo = res.injuryNo;
      this.reimbId = res.reimbId;
      if (res.transactionId) {
        this.referenceNo = res.transactionId;
      }
    });
    this.getContributor(true);
    if (this.reimbId) {
      this.isEdit = true;
      this.getReimbursementDetails();
    }
    this.getDocumentCategory();
    this.setData();
    fromEvent(window, 'popstate').subscribe(() => {
      this.setNavigationBack();
    });
  }

  getReimbursementDetails() {
    if (this.complicationId) {
      this.id = this.complicationId;
    } else {
      this.id = this.injuryId;
    }
    this.claimService.getReimbClaim(this.registrationNo, this.socialInsuranceNo, this.id, this.reimbId).subscribe(
      response => {
        this.reimbDetails = response;
        if (this.reimbDetails) {
          const isCode = '+' + this.reimbDetails.isdCode;
          const prefix = this.getKeyByValue(AppConstants.ISD_PREFIX_MAPPING, isCode);
          this.contact.mobileNo.primary = this.reimbDetails.mobileNo;
          this.contact.mobileNo.isdCodePrimary = prefix;
          this.contact.emailId.primary = this.reimbDetails.emailId;
          this.contact = new ContactDetails().fromJsonToObject(this.contact);
          if (this.reimbDetails.payableTo === 1) {
            this.payeeListForm.get('payeeType.english').setValue('Establishment');
            this.selectedpayeeList('Establishment');
          } else if (this.reimbDetails.payableTo === 2) {
            this.payeeListForm.get('payeeType.english').setValue('Contributor');
            this.selectedpayeeList('Contributor');
          } else if (this.reimbDetails.payableTo === 3) {
            this.payeeListForm.get('payeeType.english').setValue('Hospital');
            this.selectedpayeeList('Hospital');
          }
          if (this.reimbDetails.isTreatmentWithinSaudiArabia === true) {
            this.treatmentListForm.get('isTreatmentWithinSaudiArabia.english').setValue('Yes');
          } else {
            this.treatmentListForm.get('isTreatmentWithinSaudiArabia.english').setValue('No');
          }
        }
      },
      err => {
        this.alertService.showError(err.error.message, err.error.details);
      }
    );
  }

  /** This method is to create form */
  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: [null]
    });
  }

  createAmountForm(): FormGroup {
    return this.fb.group({
      invoiceAmount: [
        null,
        {validators: Validators.compose([Validators.required, Validators.min(0), greaterThanValidator(0)])}
      ],
      vatAmount: [
        null,
        {validators: Validators.compose([Validators.required])}
      ],
      hospital: this.fb.group({
        english: [null, {validators: Validators.required}],
        arabic: [null, {validators: Validators.required}]
      }),
      invoiceDate: this.fb.group({
        gregorian: [startOfDay(this.currentDate), {validators: Validators.required}],
        hijiri: [null]
      })
    });
  }

  //Event emitted method from progress wizard to make form navigation
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }

  //Setting data to services
  setData() {
    this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohservice.setRegistrationNo(this.registrationNo);
    this.ohservice.setInjuryId(this.injuryId);
    this.ohservice.setInjuryNumber(this.injuryNo);
    this.ohservice.setComplicationId(this.complicationId);
    if (this.complicationId) {
      this.id = this.complicationId;
    } else {
      this.id = this.injuryId;
    }
  }

  //This method is to navigate to previous tab
  previousForm() {
    scrollToTop();
    this.currentTab--;
    this.alertService.clearAlerts();
    this.reimbursementWizard.setPreviousItem(this.currentTab);
  }

  //This method is to initialize progress wizard
  initializeWizardItems() {
    this.reimbursementWizardItem = [];
    this.reimbursementWizardItem.push(new WizardItem(OhConstants.WIZARD_REIMBURSEMENT, 'coins'));
    this.reimbursementWizardItem.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    this.reimbursementWizardItem[0].isActive = true;
    this.reimbursementWizardItem[0].isDisabled = false;
  }

  //Display Next Form
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.reportOHTabs.tabs[this.currentTab].active = true;
    }
    if (this.reimbursementWizard) {
      this.reimbursementWizard.setNextItem(this.currentTab);
    }
  }

  //Method to get reference the of the contact form from child
  bindToContactForm(childForm: FormGroup) {
    this.contactForm = new FormGroup({});
    this.contactForm.addControl('contactDetail', childForm);
    if ((<FormGroup>this.contactForm.get('contactDetail')).valid) {
      this.person.contactDetail = bindToObject(
        this.person.contactDetail,
        (this.contactForm.get('contactDetail') as FormGroup).getRawValue()
      );
    }
  }

  //This method is to create createPayeeForm and initialize
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: ['Contributor', {validators: Validators.required, updateOn: 'blur'}],
        arabic: null
      })
    });
  }

  //This method is to create booleanLst and initialize
  createYesorNoList() {
    return this.fb.group({
      isTreatmentWithinSaudiArabia: this.fb.group({
        english: ['Yes', {validators: Validators.required, updateOn: 'blur'}],
        arabic: null
      })
    });
  }

  //This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    this.setNavigationBack();
  }

  setNavigationBack() {
    if (this.individualService.getFromNavigation()) {
      this.router.navigate([this.individualService.getFromNavigation()]);
    } else {
      this.location.back();
    }
  }

  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.id,
          'REIMBURSEMENT_CLAIM',
          'ADD_REIMBURSEMENT_CLAIM',
          this.referenceNo,
          null,
          null,
          document.sequenceNumber
        )
        .subscribe(res => {
          if (res.sequenceNumber === document.sequenceNumber) {
            document = res;
          }
        });
    }
  }

  //This method is to decline cancellation of transaction

  decline() {
    this.modalRef.hide();
  }

  //This method is used to show the cancellation template on click of cancel

  showCancelTemplate() {
    const config = {backdrop: true, ignoreBackdropClick: true};
    this.modalRef = this.modalService.show(this.cancelInjuryModal, config);
  }

  //This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, {class: size}));
  }

  /*This method to select Payee List*/
  selectedpayeeList(type) {
    if (type === 'Contributor') {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.payee = 2;
      this.showAmount = false;
      this.amountForm.reset();
    } else if (type === 'Establishment') {
      this.payeeListForm.get('payeeType.english').setValue('Establishment');
      this.payee = 1;
      this.showAmount = false;
      this.amountForm.reset();
    } else if (type === 'Hospital') {
      this.payeeListForm.get('payeeType.english').setValue('Hospital');
      this.payee = 3;
      this.showAmount = true;
    }
  }

  /*This method to select Hospital Treatment happened */
  selectedHospital(type) {
    this.amountForm.get('hospital.english').setValue(type);
  }

  /*This method to select treatment county */
  selectedbooleanList(type) {
    if (type === 'Yes') {
      this.isTreatmentWithinSaudiArabia = true;
    } else if (type === 'No') {
      this.isTreatmentWithinSaudiArabia = false;
    }
  }

  /** Method to get document category  */
  getDocumentCategory() {
    this.documentList$ = this.documentService
      .getRequiredDocuments(OhConstants.TRANSACTION_REIMBURSEMENT_CLAIM, OhConstants.WORKFLOW_ADD_REIMBURSEMENT_CLAIM)
      .pipe(
        map(documentResponse => this.documentService.removeDuplicateDocs(documentResponse)),
        catchError(error => of(error))
      );
    this.documentList$.subscribe((documents: DocumentItem[]) => {
      if (documents) {
        documents.forEach(items => {
          if (items && this.isAppPrivate) {
            this.documentCategoryList.push(items);
            this.documentScanList.push(items);
          } else if (items && items.name.english !== 'Reimbursement request form') {
            this.documentCategoryList.push(items);
            this.documentScanList.push(items);
          }
        });
      }
      if (this.isEdit && this.documentScanList.length > 0) {
        this.documentCategoryList.forEach(document => {
          this.refreshDocument(document);
        });
      }
    });
  }

  saveRequest() {
    if (this.contactForm) {
      this.contactForm.get('contactDetail').get('mobileNo').clearValidators();
      if (this.isEdit || this.reimbId) {
        if (
          this.payee === 3 &&
          !((
            this.amountForm.get('hospital').valid &&
            this.amountForm.get('invoiceDate').valid
          ) &&
          (
            this.amountForm.get('invoiceAmount').valid ||
            this.amountForm.get('vatAmount').valid
          ))
        ) {
          this.amountForm.markAllAsTouched();
          this.alertService.showMandatoryErrorMessage();
        } else {
          this.invoiceRequestDate.gregorian = startOfDay(this.amountForm.get('invoiceDate.gregorian').value);
          this.ohservice
            .updateReimbursementClaim(
              this.contactForm.get('contactDetail').get('emailId').get('primary').value,
              this.contactForm.get('contactDetail').get('mobileNo').value,
              this.isTreatmentWithinSaudiArabia,
              this.payee,
              this.uuid,
              this.reimbId,
              this.amountForm.get('invoiceAmount').value,
              this.amountForm.get('vatAmount').value,
              this.amountForm.get('hospital').value,
              this.invoiceRequestDate
            )
            .subscribe(
              res => {
                if (res) {
                  this.reimbId = res;
                  this.nextForm();
                }
              },
              err => {
                this.showErrorMessage(err);
              }
            );
        }
      } else {
        if (this.contactForm.get('contactDetail').get('mobileNo').get('isdCodePrimary').value === null) {
          this.contactForm.get('contactDetail').get('mobileNo').get('isdCodePrimary').setValue('sa');
        }
        if (
          this.payee === 3 &&
          !((
            this.amountForm.get('hospital').valid &&
            this.amountForm.get('invoiceDate').valid
          ) &&
          (
            this.amountForm.get('invoiceAmount').valid ||
            this.amountForm.get('vatAmount').valid
          ))
        ) {
          this.amountForm.markAllAsTouched();
          this.alertService.showMandatoryErrorMessage();
        } else {
          this.invoiceRequestDate.gregorian = startOfDay(this.amountForm.get('invoiceDate.gregorian').value);
          this.ohservice
            .addReimbursementClaim(
              this.contactForm.get('contactDetail').get('emailId').get('primary').value,
              this.contactForm.get('contactDetail').get('mobileNo').value,
              this.isTreatmentWithinSaudiArabia,
              this.payee,
              this.uuid,
              this.amountForm.get('invoiceAmount').value,
              this.amountForm.get('vatAmount').value,
              this.amountForm.get('hospital').value,
              this.invoiceRequestDate
            )
            .subscribe(
              res => {
                if (res) {
                  this.reimbursementDetails = res;
                  this.referenceNo = this.reimbursementDetails.referenceNo;
                  this.reimbId = this.reimbursementDetails.reimbursementId;
                  this.nextForm();
                }
              },
              err => {
                this.showErrorMessage(err);
              }
            );
        }
      }
    }
  }

  cancelModal() {
    this.alertService.clearAlerts();
    this.nextForm();
    this.modalRef.hide();
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  /**
   * Final Submit
   */
  submitClaim() {
    this.scanSucess = true;
    for (const documentItems of this.documentScanList) {
      if (documentItems.required && documentItems.documentContent === null) {
        documentItems.uploadFailed = true;
        this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
        this.scanSucess = false;
      } else {
        documentItems.uploadFailed = false;
      }
    }
    if (!this.scanSucess) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.claimService
        .submitReimbursement(
          this.registrationNo,
          this.socialInsuranceNo,
          this.id,
          this.reimbId,
          this.commentsReimb.get('comments').value
        )
        .subscribe(
          res => {
            if (res) {
              this.feedBackMessage = getAlertSuccess(res, null) as Alert;
              this.alertService.clearAlerts();
              if (this.complicationId) {
                this.injuryNo = this.ohservice.getInjuryNumber();
                this.router.navigate([
                  `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/claims/info`
                ]);
                // this.location.back();
              } else {
                this.router.navigate([
                  `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/claims/info`
                ]);
              }
              this.claimService.setAlert(this.feedBackMessage.message);
            }
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    }
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.alertService.clearAlerts();
  }

  /**
   * Get List of Hospitals for Reporting reimbursement
   */
  getHospitalList() {
    this.hospitalList$ = this.lookupService.getHospitalList();
    return this.hospitalList$;
  }
}

