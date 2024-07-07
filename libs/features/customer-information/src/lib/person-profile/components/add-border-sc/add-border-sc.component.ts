/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  borderNoValidator,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  lengthValidator,
  PayloadKeyEnum,
  Role,
  RouterData,
  RouterDataToken,
  TransactionService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangePersonService,
  ManagePersonRoutingService,
  ManagePersonScBaseComponent,
  ManagePersonService
} from '../../../shared';
import { PersonConstants } from '../../../shared/constants/person-constants';
@Component({
  selector: 'cim-add-border-sc',
  templateUrl: './add-border-sc.component.html',
  styleUrls: ['./add-border-sc.component.scss']
})
export class AddBorderScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  documents: DocumentItem[] = [];
  personId;
  referenceNo: number;
  uuid: string;
  borderFormModify: FormGroup;
  bsModalRef: BsModalRef;
  borderMaxLength = IdentifierLengthEnum.BORDER_ID;
  /**
   * Creates an instance of AddBorderScComponent
   * @memberof  AddBorderScComponent
   *
   */
  constructor(
    public documentService: DocumentService,
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    public changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly bsModalService: BsModalService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly transactionService: TransactionService,
    readonly router: Router,
    private fb: FormBuilder
  ) {
    super(
      contributorService,
      manageService,
      changePersonService,
      alertService,
      documentService,
      routerDataToken,
      workflowService,
      appToken,
      managePersonRoutingService,
      uuidService,
      location
    );
  }

  ngOnInit() {
    this.borderFormModify = this.fb.group({
      borderNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            borderNoValidator,
            lengthValidator(this.borderMaxLength)
          ]),
          updateOn: 'blur'
        }
      ],
      type: ['BORDER', Validators.required],
      comments: [null]
    });
    this.initialiseTransaction(true,'')
      .pipe(
        tap(() => {
          if (!this.borderReferenceNo)
            this.iqamaReferenceNo = this.routerDataToken.idParams.get(PayloadKeyEnum.REFERENCE_NO);
          if (this.manageService.isEdit && this.routerDataToken) {
            this.transactionService
              .getTransaction(this.borderReferenceNo)
              .pipe(
                tap(res => {
                  this.routerDataToken.taskId = res?.taskId;
                  this.routerDataToken.assigneeId = res?.assignedTo;
                  this.routerDataToken.transactionId = this.borderReferenceNo;
                }),
                catchError(err => {
                  this.showErrorMessage(err);
                  return of(null);
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
    if (this.borderForm && (this.editTransaction || this.manageService.isEdit)) {
      this.borderForm.addControl('borderAdd', this.borderFormModify);
    }
  }

  /**
   * Method to save border no
   */
  saveBorder() {
    this.alertService.clearAlerts();
    if (this.borderForm.get('borderAdd')) {
      this.borderForm.get('borderAdd').get('borderNo').markAsTouched();
      this.borderForm.get('borderAdd').get('borderNo').updateValueAndValidity();
      this.setNavigationIndicator();
      if (
        this.routerDataToken.taskId !== null &&
        (this.routerDataToken.assignedRole === Role.VALIDATOR_1 ||
          this.routerDataToken.assignedRole === Role.EST_ADMIN_OH)
      ) {
        this.referenceNo = +this.routerDataToken.idParams.get(PayloadKeyEnum.REFERENCE_NO);
      } else {
        this.referenceNo = null;
      }
      this.borderForm.get('borderAdd').markAllAsTouched();
      this.isDocumentUploaded = true;
      this.isDocumentUploaded = this.documentService.checkMandatoryDocuments(this.borderDocuments);
      if (this.borderForm.get('borderAdd').valid && this.isDocumentUploaded) {
        this.manageService
          .patchIdentityDetails(
            PersonConstants.PATCH_IDENTITY_ID,
            {
              personIdentity: {
                idType: IdentityTypeEnum.BORDER,
                id: Number(this.borderForm.get('borderAdd').get('borderNo').value)
              },
              navigationInd: this.revertTransaction.navigationInd,
              comments: this.borderForm.get('borderAdd').get('comments').value,
              transactionTraceId: this.referenceNo,
              uuid: this.uuid
            },
            this.socialInsuranceNo
          )
          .subscribe(
            res => {
              if (res) {
                this.currentTab = 1;
                this.triggerFeedbackOnSave(
                  res,
                  this.socialInsuranceNo,
                  this.borderForm.get('borderAdd').get('comments').value
                );
              }
            },
            err => {
              this.currentTab = 0;
              this.showErrorMessage(err);
            }
          );
      } else if (this.borderForm.get('borderAdd').valid) {
        this.alertService.showMandatoryDocumentsError();
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  /**
   * Method to show modal
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.bsModalRef = this.bsModalService.show(template);
  }
  /**
   * Method to cancel modal
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.bsModalRef.hide();
    this.clearErrorAndHide(this.borderType);
  }
  /**
   * Method to clear modal
   */
  decline() {
    this.bsModalRef.hide();
  }

  //Generic method to navigate to corresponding page corresponding to current transaction
  navigateToPage() {
    this.navigateToInitialPage(this.router, this.manageService.isEdit || !this.editTransaction);
  }
}
