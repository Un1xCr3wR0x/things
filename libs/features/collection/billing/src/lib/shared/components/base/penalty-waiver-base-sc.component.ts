/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BillingConstants } from '../../constants';
import { PenaltyWaiverRequest } from '../../models';
import { BillingRoutingService, PenalityWavierService } from '../../services';
import { Location } from '@angular/common';
@Directive()
export abstract class PenaltyWaiverBaseScComponent extends BaseComponent {
  /**
   * Local variables
   */
  csrFlag = true;
  documents: DocumentItem[] = [];
  exceptionalSocietyFlag = false;
  idNumber: number;
  isAppPrivate: boolean;
  isValidator = false;
  modalFlag = true;
  modalRef: BsModalRef;
  penaltyWaiveId: number;
  searchResult = true;
  success = false;
  uuid: string;
  wavierDetailsReq: PenaltyWaiverRequest;
  successMessage: BilingualText;
  comments: string;
  isValid = false;
  wavierPenalityMainForm: FormGroup = new FormGroup({});
  gracePeriodFlag = false;
  validatorOneFlag = false;
  isSubmit = false;
  warningMessageListOne = false;
  warningMessageListTwo = false;
  warningMessageListThree = false;
  warningMessageListFour = false;
  warningMessageListFive = false;
  warningMessageListSix = false;
  warningMessageListSeven = false;
  warningMessageListEight  =false;
  warningMessageListNine = false;
  warningMessageListTen = false;
  warningMessageListEleven = false;
  warningMessageListTwelve = false;
  warningMessageListThirteen = false;
  isError = false;
  isGDIC = false;
  isGracePeriodExtended = false;
  isEstRegistered = false;
  referenceNumber: number;


  /**
   *
   * @param alertService
   * @param documentService
   * @param route
   * @param routerToken
   * @param modalService
   * @param penalityWavierService
   * @param router
   * @param routingService
   */
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerToken: RouterData,
    readonly modalService: BsModalService,
    readonly penalityWavierService: PenalityWavierService,
    readonly router: Router,
    readonly routingService: BillingRoutingService,
    readonly location: Location
  ) {
    super();
  }

  /**
   * Method to handle error
   * @param error
   */
  handleError(error) {
    this.alertService.showError(error.error.message);
  }

  /**
   * Method to identify the mode of transaction.
   * */
  identifyModeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[0] && res[0].path === 'edit') this.csrFlag = false;
    }, noop);
  }
  /**
   * Method to show error alert
   * @param error
   */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  /**
   * Method to get required documents
   */
  getRequiredDocument() {
    return this.documentService
      .getRequiredDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        this.isAppPrivate
          ? this.exceptionalSocietyFlag
            ? BillingConstants.PENALTY_WAVIER_SPCL_GOL_FO_DOC_TRANSACTION_TYPE
            : BillingConstants.PENALTY_WAVIER_FO_DOC_TRANSACTION_TYPE
          : BillingConstants.PENALTY_WAVIER_GOL_DOC_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error))
      )
      .subscribe(res => {
        this.documents = res;
        if (this.isValidator) this.documents.forEach(doc => this.refreshDocuments(doc, false));
      });
  }

  /**
   * Method to navigate back to home page.
   * */
  navigateBackToHome() {
    if (this.isAppPrivate) {
      this.location.back();
      this.searchResult = true;
      this.csrFlag = true;
    } else this.router.navigate(['/home/contributor']);
  }
  /**
   * Method to check form validity
   * @param form form control
   * */
  checkFormValidity(form: AbstractControl) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (form) return form.valid;
    else return true;
  }
  /**
   * Method to refresh documents after scan.
   * @param doc
   * @param newUpload
   */
  refreshDocuments(doc: DocumentItem, newUpload: boolean): void {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.idNumber,
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          this.isAppPrivate
            ? this.exceptionalSocietyFlag
              ? BillingConstants.PENALTY_WAVIER_SPCL_GOL_FO_DOC_TRANSACTION_TYPE
              : BillingConstants.PENALTY_WAVIER_FO_DOC_TRANSACTION_TYPE
            : BillingConstants.PENALTY_WAVIER_GOL_DOC_TRANSACTION_TYPE,
          this.isValidator && !newUpload ? this.routerToken.transactionId : null,
          null,
          this.uuid
        )
        .pipe(
          tap(res => {
            doc = res;
          }),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /**
   * Method to hide modal.
   * */
  hideModal(): void {
    if (this.modalRef !== undefined) this.modalRef.hide();
  }
  /**
   * Method to show modal reference
   * @param template
   * @param size
   */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    /**
     *     if (this.csrFlag && this.modalFlag) this.navigateBack();
     */
  }

  /**
   * Method to navigate back.
   * */
  navigateBack(): void {
    this.hideModal();
    if (this.isValidator) {
      this.penalityWavierService.penaltyWaiverRevert(this.idNumber, this.penaltyWaiveId).subscribe(
        () => this.navigateBackToValidator(),
        err => this.alertService.showError(err.error.message)
      );
    } else this.cancelDetails();
  }

  /**
   * Method to navigate back to home screen
   * */
  cancelDetails() {
    if (!this.isAppPrivate) this.router.navigate(['/home/contributor']);
    else this.location.back();
  }

  /**
   * Method to navigate back to validator
   * */
  navigateBackToValidator() {
    if (this.isAppPrivate) this.routingService.navigateToValidator();
    else this.routingService.navigateToPublicInbox();
  }
}
