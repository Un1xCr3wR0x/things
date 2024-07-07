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
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  bindToForm,
  bindToObject,
  Channel,
  ContactDetails,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  markFormGroupTouched,
  RouterConstants,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
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
  getDocumentContentIds,
  isDocumentsValid,
  isGccEstablishment,
  NavigationIndicatorEnum
} from '../../..//shared';
import { handleContactDocuments } from './change-contact-helper';

@Component({
  selector: 'est-change-contact-details-sc',
  templateUrl: './change-contact-details-sc.component.html',
  styleUrls: ['./change-contact-details-sc.component.scss']
})
export class ChangeContactDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit {
  isValidator: boolean;
  contactDetailsDocuments: DocumentItem[];
  isTransactionSuccess: boolean;
  registrationNo: number;
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_CONTACT_DETAILS;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
  documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_CONTACT_DETAILS;
  routeToView: string;
  changeContactDetailsForm: FormGroup;
  isMobileDefault: boolean;
  referenceNo: number;
  commentsMaxLength: 100;
  transactionFeedback: TransactionFeedback;
  navigationIndicator = NavigationIndicatorEnum.CSR_CHANGE_CONTACT_DETAILS_SUBMIT;
  isGol: boolean;
  isDocumentsSubmitted = false;
  isGcc = false;
  uuid: string;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly documentService: DocumentService,
    private fb: FormBuilder,
    readonly workflowService: WorkflowService,
    private location: Location,
    readonly bsModalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly uuidService: UuidGeneratorService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.changeContactDetailsForm = this.createEditContactDetailsForm();
  }

  ngOnInit(): void {
    if (
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS;
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.getEstablishmentWithWorkflowData(
        this.estRouterData,
        this.initialiseViewWithContact,
        this.navigateToValidator
      );
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.establishmentToChange.registrationNo);
      if (!this.isValidator) {
        this.uuid = this.uuidService.getUuid();
      }
      this.initialiseViewWithContact();
    } else {
      this.location.back();
    }
  }

  /**
   * Method to initialise view
   */
  @Autobind
  initialiseViewWithContact() {
    this.registrationNo = this.establishmentToChange.registrationNo;
    this.establishmentToChange.contactDetails = bindToObject(
      new ContactDetails(),
      this.establishmentToChange.contactDetails
    );
    bindToForm(this.changeContactDetailsForm, this.establishmentToChange.contactDetails);
    this.isGcc = this.isValidator
      ? this.establishmentProfile.gccEstablishment
      : isGccEstablishment(this.establishmentToChange);
    this.isGol = this.appToken === ApplicationTypeEnum.PUBLIC;
    if (!this.isGol) {
      this.getDocuments();
      this.contactDetailsDocuments = [];
    }
  }

  createEditContactDetailsForm() {
    return this.fb.group({
      comments: ''
    });
  }

  /**
   * Method to get all documents
   */
  getDocuments() {
    let document$: Observable<DocumentItem[]>;
    document$ = this.documentService.getDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.registrationNo,
      this.referenceNo,
      null,
      this.referenceNo ? null : this.uuid
    );
    document$.subscribe(res => {
      const isFieldOfficeTransaction = this.isValidator
        ? this.estRouterData.channel === Channel.FIELD_OFFICE
        : this.appToken === ApplicationTypeEnum.PRIVATE;
      this.contactDetailsDocuments = handleContactDocuments(res, this.isGcc, isFieldOfficeTransaction);
    });
  }

  /**
   * Method to update contact details
   */
  updateContactDetails() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.changeContactDetailsForm);
    if (this.isGol) {
      this.isDocumentsSubmitted = true;
    } else {
      this.isDocumentsSubmitted = isDocumentsValid(this.contactDetailsDocuments);
    }

    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.navigationIndicator = NavigationIndicatorEnum.ESTADMIN_CHANGE_CONTACT_DETAILS_SUBMIT;
    } else if (this.isValidator) {
      this.navigationIndicator = NavigationIndicatorEnum.VALIDATOR_CHANGE_CONTACT_DETAILS_SUBMIT;
    }
    if (this.changeContactDetailsForm.valid && this.isDocumentsSubmitted) {
      this.changeEstablishmentService
        .changeContactDetails(this.registrationNo, {
          ...(this.changeContactDetailsForm.get('contactDetail') as FormGroup).getRawValue(),
          comments: this.changeContactDetailsForm.get('comments').value,
          navigationIndicator: this.navigationIndicator,
          contentIds: this.isGol ? [] : getDocumentContentIds(this.contactDetailsDocuments),
          referenceNo: this.referenceNo,
          uuid: this.uuid
        })
        .subscribe(
          res => {
            this.transactionFeedback = new TransactionFeedback();
            this.transactionFeedback = res;
            if (this.isValidator) {
              this.updateBpmTransaction(
                this.estRouterData,
                this.changeContactDetailsForm.get('comments').value
              ).subscribe(() => {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]),
                  this.alertService.showSuccess(this.transactionFeedback.successMessage);
              });
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
            }
          },
          err => this.alertService.showError(err.error.message, err.error.details)
        );
    } else if (!this.changeContactDetailsForm.valid) {
      this.alertService.showMandatoryErrorMessage();
      this.isTransactionSuccess = false;
    } else {
      this.isTransactionSuccess = false;
      this.alertService.showMandatoryDocumentsError();
    }
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
        undefined,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => (document = res));
  }

  /**
   * Method to cancel modal
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelContactDetailsTransaction();
  }

  /**
   * Method to cancel the transaction
   */
  cancelContactDetailsTransaction() {
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
                this.changeEstablishmentService.navigateToContactDetailsValidator();
              }
            }
          },
          err => this.alertService.showError(err?.error?.message)
        );
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
    }
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.changeEstablishmentService.navigateToContactDetailsValidator();
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
