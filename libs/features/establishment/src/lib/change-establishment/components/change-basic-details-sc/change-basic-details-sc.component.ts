/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  bindToForm,
  Channel,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  GccCountryEnum,
  LookupService,
  LovList,
  markFormGroupTouched,
  minDateValidator,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  GccStartDateEnum,
  getDocumentContentIds,
  hasCrn,
  isDocumentsValid,
  isEstablishmentTokenValid,
  isEstFromMolMci,
  isGccEstablishment, isPGccEstablishment,
  LegalEntityEnum,
  NavigationIndicatorEnum
} from '../../../shared';
import { handleBasicDetailsDocuments } from './change-basic-helper';
import moment from 'moment';

@Component({
  selector: 'est-change-basic-details-sc',
  templateUrl: './change-basic-details-sc.component.html',
  styleUrls: ['./change-basic-details-sc.component.scss']
})
export class ChangeBasicDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit {
  //Constants
  engNameMaxLength = EstablishmentConstants.EST_NAME_ENGLISH_MAX_LENGTH;
  arabicNameMaxLength = EstablishmentConstants.EST_NAME_ARABIC_MAX_LENGTH;
  routeToView: string;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
  documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_BASIC_DETAILS;

  //local variables
  editBasicDetailsForm: FormGroup;
  activityTypeList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  basicDetailsDocuments: DocumentItem[];
  registrationNo: number;
  referenceNo: number;
  isGcc = false;
  isGOL: boolean = false;
  isUnn: boolean = false;
  hasCrn: boolean;
  minDate: Date;
  maxDate = new Date();
  transactionFeedback: TransactionFeedback;
  isValidator = false;
  estNameArabicMaxLength = EstablishmentConstants.EST_NAME_ARABIC_MAX_LENGTH;
  estNameEnglishMaxLength = EstablishmentConstants.EST_NAME_ENGLISH_MAX_LENGTH;
  gccRegNoMaxLength = EstablishmentConstants.GCC_REG_NO_MAX_LENGTH;
  disableNationality = false;
  disableGCCRegNo = false;
  nationalityList$: Observable<LovList>;
  lawTypeList$: Observable<LovList>;
  currentLegalEntity: string;
  uuid: string;
  isMolOrMci: boolean;
  isPpa = false;
  isUnclaimed:boolean;
  taskId:string;
  payload;
  showSaveButton:boolean=true;
  gccProactive = false;

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  constructor(
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly bsModalService: BsModalService,
    private fb: FormBuilder,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly uuidService: UuidGeneratorService,
    readonly transactionService:TransactionService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
  }

  //Method to initialise the component
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS)) {
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.isValidator = true;
      this.routeToView =this.isGOL ? EstablishmentRoutesEnum.ADMIN_TRANSACTION_BACK_ROUTING : EstablishmentRoutesEnum.VALIDATOR_BASIC_DETAILS;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialiseView, this.navigateToValidator);
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.establishmentToChange.registrationNo);
      if (!this.isValidator) {
        this.uuid = this.uuidService.getUuid();
      }

      //added//
      if (
        this.establishmentToChange.unifiedNationalNumber !== null &&
        this.establishmentToChange.unifiedNationalNumber !== 0
      ) {
        this.isUnn = true;
      }

      this.intialiseView();
    } else {
      this.location.back();
    }
    //added//
    this.setRouterData();
  }
  setRouterData(){
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.taskId = this.routerDataToken.taskId;
      this.isUnclaimed = this.payload?.isPool;
      this.showSaveButton=this.isValidator
                      ? this.isUnclaimed ? false : true
                      : true ;
    }
  }
  assignClicked(){
    this.showSaveButton=true;
  }
  releaseClicked(){
    this.showSaveButton=false;
  }

  /**
   * Method to bootstrap the view
   */
  @Autobind
  intialiseView() {
    this.isGcc = isGccEstablishment(this.establishmentToChange);
    this.isPpa = this.establishmentToChange.ppaEstablishment;
    this.nationalityList$ = this.lookupService.getNationalityList();
    this.lawTypeList$ = this.lookupService.getLawTypeList();
    this.activityTypeList$ = this.lookupService.getActivityTypeList();
    this.editBasicDetailsForm = this.createEditBasicDetailsForm();
    this.maxDate = new Date(this.establishmentToChange.startDate.gregorian);
    if (this.isGcc) {
      this.addGccFields();
      this.gccCountryList$ = this.lookupService.getGccCountryList();
      this.gccProactive = isPGccEstablishment(this.establishmentToChange);
    }
    this.currentLegalEntity = this.establishmentToChange.legalEntity.english;
    if (
      this.currentLegalEntity === LegalEntityEnum.GOVERNMENT ||
      this.currentLegalEntity === LegalEntityEnum.SEMI_GOV ||
      this.gccProactive
    ) {
      this.disableNationality = true;
    } else {
      this.disableNationality = false;
    }
    this.registrationNo = this.establishmentToChange.registrationNo;
    this.isMolOrMci = isEstFromMolMci(this.establishmentToChange);
    bindToForm(this.editBasicDetailsForm, this.establishmentToChange);
    if (this.isGcc) {
      if (this.establishmentToChange.startDate) {
        this.editBasicDetailsForm
          .get('startDate')
          .get('gregorian')
          .setValue(new Date(this.establishmentToChange.startDate.gregorian));
      }
      this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_GCC_BASIC_DETAILS;
      if(this.isPpa || this.gccProactive){
        this.disableGCCRegNo=true;
        this.editBasicDetailsForm.get('gccEstablishment').get('registrationNo').clearValidators();
        this.editBasicDetailsForm.get('gccEstablishment').get('registrationNo').updateValueAndValidity();
      }
    }
    this.getDocuments();
  }

  /**
   * Method to create the basic details form
   */
  createEditBasicDetailsForm() {
    return this.fb.group({
      name: this.fb.group({
        arabic: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.maxLength(this.arabicNameMaxLength)]),
            updateOn: 'blur'
          }
        ],
        english: [
          null,
          {
            validators: Validators.compose([Validators.maxLength(this.engNameMaxLength)]),
            updateOn: 'blur'
          }
        ]
      }),
      activityType: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      nationalityCode: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      lawType: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      navigationIndicator: NavigationIndicatorEnum.CSR_CHANGE_BASIC_DETAILS_SUBMIT,
      comments: ''
    });
  }

  /**
   * Method to add gcc fields
   */
  addGccFields() {
    this.editBasicDetailsForm.addControl(
      'gccEstablishment',
      this.fb.group({
        country: this.fb.group({
          arabic: [],
          english: [
            null,
            {
              validators: Validators.compose([Validators.required])
            }
          ]
        }),
        registrationNo: [null, { validators: Validators.required, updateOn: 'blur' }],
        gccCountryName: true
      })
    );
    this.setGccStartDate(this.establishmentToChange.gccEstablishment.country.english);
    if(!this.isPpa){
    this.editBasicDetailsForm.addControl(
      'startDate',
      this.fb.group({
        gregorian: [null, Validators.compose([Validators.required, minDateValidator(this.minDate)])],
        hijiri: null
      })
    );
  }
  else{
    this.editBasicDetailsForm.addControl(
      'startDate',
      this.fb.group({
        gregorian: [null, Validators.compose([Validators.required, minDateValidator(this.maxDate)])],
        hijiri: null
      })
    );
  }
  }

  /**
   * Method to set the minimum start date
   * @param nationality
   */
  setGccStartDate(nationality: string) {
    if (
      nationality === GccCountryEnum.OMAN ||
      nationality === GccCountryEnum.BAHRAIN ||
      nationality === GccCountryEnum.KUWAIT
    ) {
      this.minDate = new Date(GccStartDateEnum.COUNTRIES1);
    } else if (nationality === GccCountryEnum.UAE || nationality === GccCountryEnum.QATAR) {
      this.minDate = new Date(GccStartDateEnum.COUNTRIES2);
    }
    if (this.editBasicDetailsForm.get('startDate') && this.editBasicDetailsForm.get('startDate').get('gregorian')) {
      const date = new Date(this.editBasicDetailsForm.get('startDate').get('gregorian').value);
      this.editBasicDetailsForm.get('startDate').get('gregorian').setValue(new Date());
      if(!this.isPpa){
      this.editBasicDetailsForm
        .get('startDate')
        .get('gregorian')
        .setValidators([Validators.required, minDateValidator(this.minDate)]);
      }else{
        this.editBasicDetailsForm
        .get('startDate')
        .get('gregorian')
        .setValidators([Validators.required, minDateValidator(this.maxDate)]);
      }
      this.editBasicDetailsForm.get('startDate').get('gregorian').setValue(date);
      this.editBasicDetailsForm.get('startDate').get('gregorian').markAsTouched();
      this.editBasicDetailsForm.get('startDate').get('gregorian').updateValueAndValidity();
    }
  }

  /**
   * Method to update basic details
   */
  updateBasicDetails() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.editBasicDetailsForm);
    const isDocumentsSubmitted = isDocumentsValid(this.basicDetailsDocuments);
    if (this.isValidator) {
      this.editBasicDetailsForm
        .get('navigationIndicator')
        .setValue(NavigationIndicatorEnum.VALIDATOR_CHANGE_BASIC_DETAILS_SUBMIT);
    }
    if (this.editBasicDetailsForm.valid && isDocumentsSubmitted) {
      this.changeEstablishmentService
        .updateEstablishmentBasicDetails(this.registrationNo, {
          ...this.editBasicDetailsForm.getRawValue(),
          ...{
            contentIds: getDocumentContentIds(this.basicDetailsDocuments)
          },
          referenceNo: this.referenceNo,
          uuid: this.uuid
        })
        .subscribe(
          res => {
            this.transactionFeedback = new TransactionFeedback();
            this.transactionFeedback = res;
            if (this.isValidator) {
              this.updateBpmTransaction(this.estRouterData, this.editBasicDetailsForm.get('comments').value).subscribe(
                () => {
                  this.setTransactionComplete();
                  this.alertService.showSuccess(this.transactionFeedback.successMessage);
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                }
              );
            } else {
              this.setTransactionComplete();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
              this.location.back();
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    } else if (!this.editBasicDetailsForm.valid) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  /**
   * Method to get all documents
   */
  getDocuments() {
    this.documentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.registrationNo,
        this.referenceNo,
        null,
        this.referenceNo ? null : this.uuid
      )
      .subscribe(res => this.performInitialDocumentValidations(res));
  }

  /**
   * Initialise documents with necessary validations
   * @param documents
   */
  performInitialDocumentValidations(documents: DocumentItem[]) {
    this.basicDetailsDocuments = documents;
    this.hasCrn = hasCrn(this.establishmentToChange);
    const hasLicense = this.establishmentToChange?.license?.number ? true : false;
    const isFieldOfficeTransaction = this.isValidator
      ? this.estRouterData?.channel === Channel.FIELD_OFFICE
      : this.appToken === ApplicationTypeEnum.PRIVATE;
    handleBasicDetailsDocuments(
      this.basicDetailsDocuments,
      this.isGcc,
      isFieldOfficeTransaction,
      this.hasCrn,
      hasLicense,
      this
    );
  }

  /**
   * Method to get the document content
   * @param document
   */
  bindDocContent(document: DocumentItem) {
    this.documentService
      .refreshDocument(
        document,
        this.registrationNo,
        this.documentTransactionKey,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => (document = res));
  }
  /**method to initiate cancel template
   *
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelBasicDetailsTransaction();
  }
  /**
   * this method is to cancel the transaction already in progress
   */
  cancelBasicDetailsTransaction() {
    if (this.isValidator) {
      this.changeEstablishmentService
        .revertTransaction(this.establishmentToChange.registrationNo, this.estRouterData.referenceNo)
        .subscribe(
          () => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
              } else {
                this.changeEstablishmentService.navigateToBasicDetailsValidator();
              }
            }
          },
          err => this.alertService.showError(err?.error?.message)
        );
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.navigateToView();
    }
  }

  /**
   * Method to navigate to view
   */
  navigateToView() {
    this.location.back();
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.changeEstablishmentService.navigateToBasicDetailsValidator();
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  navigateRoutelink(){
    this.router.navigate([this.routeToView]);
  }
}
