/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AddressDetails,
  AddressTypeEnum,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  Channel,
  ContactDetails,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  UuidGeneratorService,
  WorkflowService,
  bindToObject,
  markFormGroupTouched,
  setAddressFormToAddresses,
  setWaselAddressFormToAddresses
} from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  NavigationIndicatorEnum,
  getDocumentContentIds,
  isDocumentsValid,
  isEstablishmentTokenValid,
  isGccEstablishment
} from '../../../shared';
import { handleAddressDocuments } from './change-address-helper';
@Component({
  selector: 'est-change-address-details-sc',
  templateUrl: './change-address-details-sc.component.html',
  styleUrls: ['./change-address-details-sc.component.scss']
})
export class ChangeAddressDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit {
  address: AddressDetails[] = [];
  routeToView: string;
  isValidator: boolean;
  registrationNo: number;
  editAddressDetailsForm: FormGroup;
  transactionFeedback: TransactionFeedback;
  establishmentWaselAddress: AddressDetails;
  addressDetailsDocuments: DocumentItem[];
  gccCountryList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  isGcc = false;
  referenceNo: number;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
  documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_ADDRESS_DETAILS;
  navigationIndicator = NavigationIndicatorEnum.CSR_CHANGE_ADDRESS_DETAILS_SUBMIT;
  documents$: Observable<DocumentItem[]>;
  uuid: string;
  isWaselAddress: boolean;
  disableSubmitBtn: boolean = false;
  isGOL:boolean=false;
  showSaveButton:boolean=true;
  payload;
  taskId:string;


  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDetailsComponent: ContactDcComponent;
  isDirectChange: boolean;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  constructor(
    private fb: FormBuilder,
    readonly bsModalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly documentService: DocumentService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private location: Location,
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
    this.editAddressDetailsForm = this.createEditAddressDetailsForm();
  }

  ngOnInit(): void {
    this.isDirectChange = this.appToken === ApplicationTypeEnum.PUBLIC && (!!this.changeEstablishmentService.selectedEstablishment?.unifiedNationalNumber || !!this.changeEstablishmentService.selectedEstablishment?.crn?.number);
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS)) {
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS;
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.getEstablishmentWithWorkflowData(
        this.estRouterData,
        this.initialiseViewWithAddress,
        this.navigateToValidator
      );
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.establishmentToChange.registrationNo);
      if (!this.isValidator) {
        this.uuid = this.uuidService.getUuid();
      }
      if (
        this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber === null &&
        this.changeEstablishmentService.selectedEstablishment.crn != null &&
        this.appToken === ApplicationTypeEnum.PUBLIC &&
        !this.isGcc
      ) {
        this.updateWaselError();
      }
      this.initialiseViewWithAddress();
      if (
        this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber &&
        this.appToken === ApplicationTypeEnum.PUBLIC &&
        !this.isGcc
      ) {
        this.fetchWaselUnn();
      } else if (
        this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber === null &&
        this.changeEstablishmentService.selectedEstablishment.crn.number != null &&
        this.appToken === ApplicationTypeEnum.PUBLIC &&
        !this.isGcc
      ) {
        this.fetchWaselCrn();
      }
    } else {
      this.location.back();
    }
    this.setRouterData();
  }
      // Method to get router data for claim pool
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
  initialiseViewWithAddress() {
    this.gccCountryList$ = this.lookUpService.getGccCountryList();
    this.countryList$ = this.lookUpService.getCountryList();
    this.gccCountryList$ = this.lookUpService.getGccCountryList();
    this.cityList$ = this.lookUpService.getCityList();

    this.isGcc = isGccEstablishment(this.establishmentToChange);
    this.registrationNo = this.establishmentToChange.registrationNo;
    const estContactDetails = bindToObject(new ContactDetails(), this.establishmentToChange.contactDetails);
    this.establishmentToChange = { ...this.establishmentToChange, ...{ contactDetails: estContactDetails } };
    this.getDocuments();
  }

  /**
   * Method to update the address details
   */
  updateAddressDetails() {
    this.disableSubmitBtn = true;
    this.alertService.clearAlerts();
    markFormGroupTouched(this.editAddressDetailsForm);
    const isDocumentsSubmitted = this.isDirectChange ? true : isDocumentsValid(this.addressDetailsDocuments);
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      if (this.isValidator) {
        this.navigationIndicator = NavigationIndicatorEnum.VALIDATOR_CHANGE_ADDRESS_DETAILS_SUBMIT;
      } else {
        this.navigationIndicator = NavigationIndicatorEnum.ESTADMIN_CHANGE_ADDRESS_DETAILS_SUBMIT;
      }
    } else if (this.isValidator) {
      this.navigationIndicator = NavigationIndicatorEnum.VALIDATOR_CHANGE_ADDRESS_DETAILS_SUBMIT;
    }
    const currentMailingAddress = this.isGcc
      ? AddressTypeEnum.OVERSEAS
      : this.editAddressDetailsForm.get('currentMailingAddress').value;

    if (this.addressDetailsComponent.getAddressValidity() && isDocumentsSubmitted) {
      this.changeEstablishmentService
        .changeAddressDetails(this.registrationNo, {
          ...{
            currentMailingAddress: currentMailingAddress
          },
          ...{
            contentIds: this.isDirectChange ? [] : getDocumentContentIds(this.addressDetailsDocuments)
          },
          comments: this.isDirectChange ? '' : this.editAddressDetailsForm.get('comments').value,
          navigationIndicator: this.navigationIndicator,
          referenceNo: this.referenceNo,
          addresses: setAddressFormToAddresses(this.editAddressDetailsForm),
          uuid: this.uuid
        })
        .subscribe(
          res => {
            this.transactionFeedback = res;
            if (this.isValidator) {
              const comments = this.editAddressDetailsForm.get('comments').value;
              this.updateBpmTransaction(this.estRouterData, comments).subscribe(() => {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
                this.disableSubmitBtn = false;
              });
            } else {
              this.setTransactionComplete();
              this.location.back();

              this.alertService.showSuccess(this.transactionFeedback.successMessage);
              this.disableSubmitBtn = false;
            }
          },
          err => {
            this.alertService.showError(err.error.message);
            this.disableSubmitBtn = false;
          }
        );
    } else if (!this.addressDetailsComponent.getAddressValidity()) {
      this.alertService.showMandatoryErrorMessage();
      this.disableSubmitBtn = false;
    } else {
      this.alertService.showMandatoryDocumentsError();
      this.disableSubmitBtn = false;
    }
  }

  createEditAddressDetailsForm() {
    return this.fb.group({
      comments: ''
    });
  }

  /**
   * Method to get all documents
   */
  getDocuments() {
    this.documents$ = this.documentService.getDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.registrationNo,
      this.referenceNo,
      undefined,
      this.referenceNo ? null : this.uuid
    );
    this.documents$.pipe(map(res => this.performInitialDocumentValidations(res))).subscribe(res => {
      this.addressDetailsDocuments = res;
    });
  }

  /**
   * Initialise documents with necessary validations
   * @param documents
   */
  performInitialDocumentValidations(documents: DocumentItem[]) {
    const isFieldOfficeTransaction = this.isValidator
      ? this.estRouterData?.channel === Channel.FIELD_OFFICE
      : this.appToken === ApplicationTypeEnum.PRIVATE;
    return handleAddressDocuments(
      documents,
      this.isGcc,
      isFieldOfficeTransaction,
      this.establishmentToChange?.contactDetails?.addresses?.length === 0
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
        this.documentTransactionType,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => (document = res));
  }
  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.changeEstablishmentService.navigateToAddressDetailsValidator();
  }
  /**
   * method to cancel the modal
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelAddressDetailsTransactions();
  }

  /**
   * this method is to cancel the transaction already in progress
   */
  cancelAddressDetailsTransactions() {
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
                this.changeEstablishmentService.navigateToAddressDetailsValidator();
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

  deletedAddress() {
    if (this.isGcc) {
      this.isDirectChange = this.appToken === ApplicationTypeEnum.PUBLIC && !this.isValidator;
      this.addressDetailsDocuments = handleAddressDocuments(
        this.addressDetailsDocuments,
        this.isGcc,
        this.appToken === ApplicationTypeEnum.PRIVATE,
        true
      );
    }
  }
  addedAddress() {
    if (this.isGcc) {
      this.isDirectChange = false;
      this.addressDetailsDocuments = handleAddressDocuments(
        this.addressDetailsDocuments,
        this.isGcc,
        this.appToken === ApplicationTypeEnum.PRIVATE,
        false
      );
    }
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  fetchWaselUnn() {
    const queryParam = this.changeEstablishmentService.selectedEstablishment.unifiedNationalNumber;
    this.changeEstablishmentService.getEstablishmentWaselAddress(queryParam, this.registrationNo).subscribe(res => {
      this.establishmentWaselAddress = res;
      this.isDirectChange = true;
      this.isWaselAddress = true;
      if (
        this.changeEstablishmentService.selectedEstablishment.contactDetails.currentMailingAddress ===
        AddressTypeEnum.POBOX
      ) {
        this.addressDetailsComponent.choseAddresses(true, AddressTypeEnum.NATIONAL, 'saudiAddress');
      }
      this.alertService.showSuccessByKey('ESTABLISHMENT.WASEL-PRESENT');
    });
  }
  fetchWaselCrn() {
    const queryParam = this.changeEstablishmentService.selectedEstablishment.crn.number;
    this.changeEstablishmentService.getEstablishmentWaselAddressCrn(queryParam, this.registrationNo).subscribe(res => {
      this.establishmentWaselAddress = res;
      this.isDirectChange = true;
      this.isWaselAddress = true;
      if (
        this.changeEstablishmentService.selectedEstablishment.contactDetails.currentMailingAddress ===
        AddressTypeEnum.POBOX
      ) {
        this.addressDetailsComponent.choseAddresses(true, AddressTypeEnum.NATIONAL, 'saudiAddress');
      }
      this.alertService.showSuccessByKey('ESTABLISHMENT.WASEL-PRESENT');
    });
  }
  updateWaselError() {
    this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.WASEL-ERROR');
  }
  /**
   * Method to update the address details
   */
  updateWaselAddressDetails() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.editAddressDetailsForm);
    const isDocumentsSubmitted = this.isDirectChange ? true : isDocumentsValid(this.addressDetailsDocuments);
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.navigationIndicator = NavigationIndicatorEnum.ESTADMIN_CHANGE_ADDRESS_DETAILS_SUBMIT;
    } else if (this.isValidator) {
      this.navigationIndicator = NavigationIndicatorEnum.VALIDATOR_CHANGE_ADDRESS_DETAILS_SUBMIT;
    }
    const currentMailingAddress = this.isGcc
      ? AddressTypeEnum.OVERSEAS
      : this.editAddressDetailsForm.get('currentMailingAddress').value;

    if (this.addressDetailsComponent.getAddressWaselValidity() && this.isWaselAddress && isDocumentsSubmitted) {
      this.changeEstablishmentService
        .changeAddressDetails(this.registrationNo, {
          ...{
            currentMailingAddress: currentMailingAddress
          },
          ...{
            contentIds: this.isDirectChange ? [] : getDocumentContentIds(this.addressDetailsDocuments)
          },
          comments: this.isDirectChange ? '' : this.editAddressDetailsForm.get('comments').value,
          navigationIndicator: this.navigationIndicator,
          referenceNo: this.referenceNo,
          addresses: setWaselAddressFormToAddresses(this.editAddressDetailsForm),
          uuid: this.uuid,
          isWaselAddress: this.isWaselAddress
        })
        .subscribe(
          res => {
            this.transactionFeedback = res;
            if (this.isValidator) {
              const comments = this.editAddressDetailsForm.get('comments').value;
              this.updateBpmTransaction(this.estRouterData, comments).subscribe(() => {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
              });
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }
}
