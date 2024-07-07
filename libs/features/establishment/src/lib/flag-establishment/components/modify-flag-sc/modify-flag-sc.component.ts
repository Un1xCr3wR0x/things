/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  RouterConstants,
  TransactionInterface,
  TransactionMixin,
  WorkflowService,
  markFormGroupTouched,
  startOfDay
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  FlagEstablishmentService,
  FlagQueryParam,
  FlagRequest,
  NavigationIndicatorEnum
} from '../../../shared';
import { FlagEstablishmentBaseScComponent } from '../../../shared/base/flag-establishment-sc.base-component';

@Component({
  selector: 'est-modify-flag-sc',
  templateUrl: './modify-flag-sc.component.html',
  styleUrls: ['./modify-flag-sc.component.scss']
})
export class ModifyFlagScComponent
  extends TransactionMixin(FlagEstablishmentBaseScComponent)
  implements TransactionInterface, OnInit, OnDestroy
{
  /**
   * Local Variables
   */
  modifyFlagForm: FormGroup;
  flagId: number;
  disableSubmitBtn: boolean = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly flagService: FlagEstablishmentService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly location: Location,
    readonly route: ActivatedRoute,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData
  ) {
    super(
      fb,
      alertService,
      bsModalService,
      documentService,
      establishmentService,
      changeEstablishmentService,
      workflowService,
      location
    );
  }

  ngOnInit(): void {
    this.documentTransactionId = DocumentTransactionIdEnum.MODIFY_FLAG;
    this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_FLAG_ESTABLISHMENT;
    this.initialiseTabWizards(this.currentTab);
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('registrationNo') && params.get('flagId')) {
            this.registrationNo = +params.get('registrationNo');
            this.flagId = +params.get('flagId');
          }
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    if (
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.referenceNo = this.estRouterData.referenceNo;
      this.fetchComments(this.estRouterData);
    }
    this.lookUpService.getFlagTypeList().subscribe(res => {
      this.flagTypeList = res;
    });
    this.getFlags();
  }
  /**
   * Method to get flags
   */
  getFlags() {
    const params = new FlagQueryParam();
    params.flagId = this.flagId;
    if (this.isValidator) {
      params.transactionTraceId = this.referenceNo;
      params.getTransient = true;
    }
    this.flagService.getFlagDetails(this.registrationNo, params).subscribe(
      res => {
        if (res !== undefined && res !== null) {
          this.flags = res[0];
          const index = this.flagTypeList?.items.findIndex(item => item.value.english === this.flags.flagType.english);
          this.flagReasonList = this.flagTypeList?.items[index].items;
          this.modifyFlagForm = this.createAddFlagForm();
          this.bindObjectToForm(this.modifyFlagForm, this.flags);
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /**
   * Method to navigate back
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction(this.registrationNo, this.referenceNo);
  }

  /**
   * Method save and submit flag
   * @param isFinalSubmit
   */
  submitFlagDetails(isFinalSubmit: boolean) {
    this.disableSubmitBtn = true;

    this.alertService.clearAlerts();
    markFormGroupTouched(this.modifyFlagForm);
    if (this.modifyFlagForm.invalid) {
      this.alertService.showMandatoryErrorMessage();
    } else if (isFinalSubmit && !this.documentService.checkMandatoryDocuments(this.flagDocuments)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      const flagDetails = new FlagRequest();
      flagDetails.justification = this.modifyFlagForm.get('justification').value;
      if (this.modifyFlagForm.get('endDate').get('gregorian').value)
        flagDetails.endDate.gregorian = startOfDay(this.modifyFlagForm.get('endDate').get('gregorian').value);
      else flagDetails.endDate = null;
      if (isFinalSubmit) {
        flagDetails.transactionId = this.isValidator ? this.referenceNo : this.modifyFlagForm.get('referenceNo').value;
      } else {
        flagDetails.transactionId = this.isValidator ? this.referenceNo : 0;
      }

      flagDetails.comments = this.modifyFlagForm.get('comments').value;
      if (this.isValidator) {
        flagDetails.navigationIndicator = isFinalSubmit
          ? NavigationIndicatorEnum.CUSTOMER_CARE_REENTER_MODIFY_FLAG_SUBMIT
          : NavigationIndicatorEnum.CUSTOMER_CARE_MODIFY_FLAG;
      } else {
        flagDetails.navigationIndicator = isFinalSubmit
          ? NavigationIndicatorEnum.CUSTOMER_CARE_MODIFY_FLAG_SUBMIT
          : NavigationIndicatorEnum.CUSTOMER_CARE_MODIFY_FLAG;
      }
      this.flagService
        .saveModifiedFlagDetails(this.registrationNo, flagDetails, this.flags.flagId)
        .pipe(
          catchError(err => {
            this.alertService.showError(err.error?.message, err.error?.details);
            this.disableSubmitBtn = false;
            return throwError(err);
          }),
          tap(res => {
            if (isFinalSubmit) {
              this.transactionFeedback = res;
              if (this.isValidator) {
                this.updateBpm(
                  this.estRouterData,
                  this.modifyFlagForm.get('comments').value,
                  res.successMessage
                ).subscribe(
                  () => {
                    this.setTransactionComplete();
                    this.router.navigate([RouterConstants.ROUTE_INBOX]);
                  },
                  err => {
                    this.alertService.showError(err?.error?.message);
                  }
                );
              } else {
                this.setTransactionComplete();
                this.location.back();
              }
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
            } else {
              this.modifyFlagForm.get('referenceNo').setValue(+res?.transactionId);
              this.referenceNo = +res?.transactionId;
              this.getModifyDocuments().subscribe(() => {
                this.selectedWizard(1);
              });
            }

            this.disableSubmitBtn = false;
          })
        )
        .subscribe(noop, noop);
    }
  }
  /**
   * Method to get all documents
   */
  getModifyDocuments(): Observable<DocumentItem[]> {
    return this.changeGrpEstablishmentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.registrationNo,
        this.referenceNo,
        null
      )
      .pipe(
        tap(res => (this.flagDocuments = res)),
        catchError(err => {
          this.alertService.showError(err.error?.message, err.error?.details);
          return throwError(err);
        })
      );
  }

  /**
   * Method to cancel the transaction
   */
  cancelTransaction(registrationNo: number, referenceNo: number) {
    if (referenceNo) {
      this.changeEstablishmentService.revertTransaction(registrationNo, referenceNo).subscribe(
        () => {
          this.setTransactionComplete();
          this.isValidator ? this.router.navigate([RouterConstants.ROUTE_INBOX]) : this.location.back();
        },
        err => this.alertService.showError(err?.error?.message)
      );
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.alertService.clearAllErrorAlerts();
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
