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
  Contributor,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  iqamaValidator,
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
  selector: 'cim-add-iqama-sc',
  templateUrl: './add-iqama-sc.component.html',
  styleUrls: ['./add-iqama-sc.component.scss']
})
export class AddIqamaScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  //Document item
  documents: DocumentItem[] = [];
  personId;
  contributor: Contributor;
  bsModalRef: BsModalRef;
  referenceNo: number;
  iqamaFormModify: FormGroup;
  iqamaMaxLength = IdentifierLengthEnum.IQAMA;
  /**
   * Creates an instance of AddIqamaScComponent
   * @memberof  AddIqamaScComponent
   *
   */
  constructor(
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    public changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    public documentService: DocumentService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly bsModalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location,
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
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.iqamaFormModify = this.fb.group({
      iqamaNo: [
        null,
        {
          validators: Validators.compose([Validators.required, iqamaValidator, lengthValidator(this.iqamaMaxLength)]),
          updateOn: 'blur'
        }
      ],
      type: ['IQAMA', Validators.required],
      comments: [null]
    });
    this.initialiseTransaction(false,'')
      .pipe(
        tap(() => {
          if (!this.iqamaReferenceNo)
            this.iqamaReferenceNo = this.routerDataToken.idParams.get(PayloadKeyEnum.REFERENCE_NO);
          if (this.manageService.isEdit && this.routerDataToken) {
            this.transactionService
              .getTransaction(this.iqamaReferenceNo)
              .pipe(
                tap(res => {
                  this.routerDataToken.taskId = res?.taskId;
                  this.routerDataToken.assigneeId = res?.assignedTo;
                  this.routerDataToken.transactionId = this.iqamaReferenceNo;
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
    if (this.iqamaForm && (this.editTransaction || this.manageService.isEdit)) {
      this.iqamaForm.addControl('iqamaAdd', this.iqamaFormModify);
    }
  }

  /**
   * This method is used to save iqama
   */
  saveIqama() {
    this.alertService.clearAlerts();
    if (this.iqamaForm.get('iqamaAdd')) {
      this.iqamaForm.get('iqamaAdd').get('iqamaNo').markAsTouched();
      this.iqamaForm.get('iqamaAdd').get('iqamaNo').updateValueAndValidity();
      this.isDocumentUploaded = true;
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
      this.isDocumentUploaded = this.documentService.checkMandatoryDocuments(this.iqamaDocuments);
      if (this.iqamaForm.get('iqamaAdd').valid && this.isDocumentUploaded) {
        this.manageService
          .patchIdentityDetails(
            PersonConstants.PATCH_IDENTITY_ID,
            {
              personIdentity: {
                idType: IdentityTypeEnum.IQAMA,
                iqamaNo: Number(this.iqamaForm.get('iqamaAdd').get('iqamaNo').value)
              },
              navigationInd: this.revertTransaction.navigationInd,
              comments: this.iqamaForm.get('iqamaAdd').get('comments').value,
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
                  this.iqamaForm.get('iqamaAdd').get('comments').value
                );
              }
            },
            err => {
              this.currentTab = 0;
              this.showErrorMessage(err);
            }
          );
      } else if (this.iqamaForm.get('iqamaAdd').valid) {
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
    this.clearErrorAndHide(this.iqamaType);
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
