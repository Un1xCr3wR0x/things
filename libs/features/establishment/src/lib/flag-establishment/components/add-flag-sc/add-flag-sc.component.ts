/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  RouterConstants,
  TransactionInterface,
  TransactionMixin,
  WorkflowService,
  markFormGroupTouched,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  AddFlagRequest,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  FlagEstablishmentService,
  FlagQueryParam,
  FlagTypeEnum,
  NavigationIndicatorEnum
} from '../../../shared';
import { FlagEstablishmentBaseScComponent } from '../../../shared/base/flag-establishment-sc.base-component';

@Component({
  selector: 'est-add-flag-sc',
  templateUrl: './add-flag-sc.component.html',
  styleUrls: ['./add-flag-sc.component.scss']
})
export class AddFlagScComponent
  extends TransactionMixin(FlagEstablishmentBaseScComponent)
  implements TransactionInterface, OnInit, OnDestroy
{
  /**
   * Local Variables
   */
  flagForm: FormGroup;
  isMOL: boolean;
  showWarning = false;
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

  /**
   * Method to initialise component
   */
  ngOnInit() {
    this.initialiseTabWizards(this.currentTab);
    if (
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.referenceNo = this.estRouterData.referenceNo;
      this.registrationNo = this.estRouterData.registrationNo;
      this.getEstablishmentDetails(this.registrationNo);
    } else if (this.flagService.registrationNo) {
      this.registrationNo = this.flagService.registrationNo;
      this.flagForm = this.createAddFlagForm();
      this.getEstablishmentDetails(this.registrationNo);
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
  }

  /**
   * Method to get the flag reason o selecting flag type
   */
  onSelectFlagType(flagType) {
    this.flagForm.get('flagReason').reset();
    const index = this.flagTypeList.items.findIndex(item => item.value.english === flagType);
    this.flagReasonList = this.flagTypeList.items[index].items;
    this.showWarning = false;
    this.checkDateValidation();
  }

  /**
   * Method to navigate back
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }

  /**
   * Method to get establishment details
   */
  getEstablishmentDetails(registrationNo) {
    this.establishmentService
      .getEstablishment(registrationNo)
      .pipe(
        tap(res => {
          this.establishment = res;
          if (this.establishment.molEstablishmentIds !== undefined && this.establishment.molEstablishmentIds !== null) {
            this.isMOL = true;
          } else {
            this.isMOL = false;
          }
        }),
        switchMap(() => {
          return this.lookUpService.getFlagTypeList().pipe(
            tap(res => {
              this.flagTypeList = res;
              if (this.flagTypeList) {
                if (!this.isMOL) {
                  this.flagTypeList = new LovList(
                    this.flagTypeList?.items.filter(
                      item =>
                        item.value.english !== FlagTypeEnum.ALLOW_HSRD_SERVICES &&
                        item.value.english !== FlagTypeEnum.STOP_HSRD_SERVICES
                    )
                  );
                }
                this.getFlagDetails();
              }
            })
          );
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      });
  }

  /**
   * Method save and submit flag
   * @param isFinalSubmit
   */
  submitFlagDetails(isFinalSubmit: boolean) {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.flagForm);
    if (this.flagForm.invalid) {
      this.alertService.showMandatoryErrorMessage();
    } else if (isFinalSubmit && !this.documentService.checkMandatoryDocuments(this.flagDocuments)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      const flagDetails = new AddFlagRequest();
      flagDetails.type = this.flagForm.get('flagType').value;
      flagDetails.reason = this.flagForm.get('flagReason').value;
      flagDetails.justification = this.flagForm.get('justification').value;
      flagDetails.startDate.gregorian = startOfDay(this.flagForm.get('startDate').get('gregorian').value);
      if (this.flagForm.get('endDate').get('gregorian').value)
        flagDetails.endDate.gregorian = startOfDay(this.flagForm.get('endDate').get('gregorian').value);
      else flagDetails.endDate = null;
      flagDetails.transactionId = this.flagForm.get('referenceNo').value;
      flagDetails.comments = this.flagForm.get('comments').value;
      if (this.isValidator) {
        flagDetails.navigationIndicator = isFinalSubmit
          ? NavigationIndicatorEnum.CUSTOMER_CARE_FLAG_EST_FINAL_SUBMIT
          : NavigationIndicatorEnum.FLAG_EST_SUBMIT;
      } else {
        flagDetails.navigationIndicator = isFinalSubmit
          ? NavigationIndicatorEnum.FLAG_EST_FINAL_SUBMIT
          : NavigationIndicatorEnum.FLAG_EST_SUBMIT;
      }
      this.flagService
        .saveFlagDetails(this.registrationNo, flagDetails)
        .pipe(
          tap(res => {
            if (isFinalSubmit) {
              this.transactionFeedback = res;
              if (this.isValidator) {
                this.updateBpm(this.estRouterData, this.flagForm.get('comments').value, res.successMessage).subscribe(
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
              this.flagForm.get('referenceNo').setValue(+res?.transactionId);
              this.referenceNo = +res?.transactionId;
              this.getDocuments().subscribe(() => {
                this.selectedWizard(1);
              });
            }
          }),
          catchError(err => {
            this.alertService.showError(err.error?.message, err.error?.details);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /**
   * Method to get all documents
   */
  getDocuments(): Observable<DocumentItem[]> {
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
   * Method to get the flag details on customer care head re enter
   * @param estRouterData
   * @param navigateToValidator
   */
  getFlagDetails() {
    const params = new FlagQueryParam();
    if (this.isValidator) {
      this.registrationNo = this.estRouterData.registrationNo;
      params.transactionTraceId = this.referenceNo;
      params.status = EstablishmentQueryKeysEnum.INITIATE_MODE;
    } else {
      params.status = EstablishmentQueryKeysEnum.ACTIVE;
    }
    this.flagService.getFlagDetails(this.registrationNo, params).subscribe(
      res => {
        if (res !== undefined && res !== null) {
          this.flagDetails = res;
          if (this.isValidator) {
            this.flags = res[0];
            const index = this.flagTypeList?.items.findIndex(
              item => item.value.english === this.flags.flagType.english
            );
            this.flagReasonList = this.flagTypeList?.items[index].items;
            this.flagForm = this.createAddFlagForm();
            this.bindObjectToForm(this.flagForm, this.flags);
            this.fetchComments(this.estRouterData);
          }
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /**
   * Method to cancel the transaction
   */
  cancelTransaction() {
    if (this.referenceNo) {
      this.changeEstablishmentService.revertTransaction(this.registrationNo, this.referenceNo).subscribe(
        () => {
          this.setTransactionComplete();
          if (this.isValidator) {
            this.router.navigate([RouterConstants.ROUTE_INBOX]);
          } else {
            this.location.back();
          }
        },
        err => this.alertService.showError(err?.error?.message)
      );
    } else {
      this.setTransactionComplete();
      this.changeEstablishmentService.navigateToProfile(this.establishment.registrationNo);
    }
  }

  /**
   * Method to check date overlap for stop  and allow mol services  flags
   */
  checkDateValidation() {
    this.alertService.clearAlerts();
    this.showWarning = false;
    const startDate = startOfDay(this.flagForm?.get('startDate').get('gregorian').value);
    const flagType = this.flagForm.get('flagType').value;
    const endDate = startOfDay(this.flagForm?.get('endDate').get('gregorian').value);
    if (this.flagDetails) {
      this.flagDetails.forEach(flag => {
        if (
          startDate &&
          ((flag.flagType.english === FlagTypeEnum.STOP_HSRD_SERVICES &&
            flagType.english === FlagTypeEnum.ALLOW_HSRD_SERVICES) ||
            (flag.flagType.english === FlagTypeEnum.ALLOW_HSRD_SERVICES &&
              flagType.english === FlagTypeEnum.STOP_HSRD_SERVICES) ||
            (flag.flagType.english === FlagTypeEnum.STOP_GOSI_CERTIFICATE &&
              flagType.english === FlagTypeEnum.ALLOW_GOSI_CERTIFICATE) ||
            (flag.flagType.english === FlagTypeEnum.ALLOW_GOSI_CERTIFICATE &&
              flagType.english === FlagTypeEnum.STOP_GOSI_CERTIFICATE))
        ) {
          this.showWarning = true;
          const flagStartDate = startOfDay(flag?.startDate?.gregorian);
          const flagEndDate = startOfDay(flag?.endDate?.gregorian);
          if (endDate) {
            if (flagEndDate) {
              this.showWarning = !(
                (moment(startDate).isBefore(flagStartDate) && moment(endDate).isBefore(flagStartDate)) ||
                (moment(startDate).isAfter(flagEndDate) && moment(endDate).isAfter(flagEndDate))
              );
            } else {
              this.showWarning = !(
                moment(startDate).isBefore(flagStartDate) && moment(endDate).isBefore(flagStartDate)
              );
            }
          } else {
            if (flagEndDate) {
              if (moment(startDate).isAfter(flagEndDate) && moment(startDate).isAfter(flagStartDate)) {
                this.showWarning = false;
              }
            }
          }
        }
      });
      if (this.showWarning) {
        switch (flagType.english) {
          case FlagTypeEnum.ALLOW_HSRD_SERVICES: {
            this.alertService.showWarningByKey('ESTABLISHMENT.WARNING.ALLOW-MOL-SERVICE');
            break;
          }
          case FlagTypeEnum.STOP_HSRD_SERVICES: {
            this.alertService.showWarningByKey('ESTABLISHMENT.WARNING.STOP-MOL-SERVICE');
            break;
          }
          case FlagTypeEnum.ALLOW_GOSI_CERTIFICATE: {
            this.alertService.showWarningByKey('ESTABLISHMENT.WARNING.ALLOW-GOSI_CERTIFICATE');
            break;
          }
          case FlagTypeEnum.STOP_GOSI_CERTIFICATE: {
            this.alertService.showWarningByKey('ESTABLISHMENT.WARNING.STOP-GOSI_CERTIFICATE');
            break;
          }
        }
      }
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
