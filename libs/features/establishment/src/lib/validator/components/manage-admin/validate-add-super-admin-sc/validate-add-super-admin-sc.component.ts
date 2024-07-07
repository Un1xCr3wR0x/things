/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  WorkflowService
} from '@gosi-ui/core';
import {
  Admin,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService
} from '@gosi-ui/features/establishment';
import { isGccEstablishment } from '@gosi-ui/features/establishment/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, noop, of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-add-super-admin-sc',
  templateUrl: './validate-add-super-admin-sc.component.html',
  styleUrls: ['./validate-add-super-admin-sc.component.scss']
})
export class ValidateAddSuperAdminScComponent extends ValidatorScBaseComponent implements OnInit {
  //Local variables
  transactionNumber = null;
  admins: Admin[] = [];
  superAdmin: Admin;
  name = '';
  canReturn = false;
  isReturn: boolean;
  superAdminValidationForm: FormGroup;
  estData: boolean;
  heading = 'ESTABLISHMENT.REGISTER-BRANCH-MANAGER';

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
  ) {
    super(
      lookupService,
      changeEstablishmentService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
    this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
    this.documentTransactionType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
  }

  ngOnInit() {
    if (this.estRouterData.registrationNo) {
      this.initialiseView();
    } else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }
  /**
   *  Method to initialise the view
   *
   */
  initialiseView() {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn = this.estRouterData.assignedRole === Role.VALIDATOR_2;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.canEdit = this.estRouterData.assignedRole === Role.VALIDATOR_1;
    this.superAdminValidationForm = this.createForm();
    this.superAdminValidationForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getEstDetails(this.estRouterData.registrationNo);
    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }
  getEstDetails(registrationNo: number) {
    this.getEstablishmentData(registrationNo)
      .pipe(
        tap(
          res => {
            this.establishment = res;
            this.estData = true;
            this.isGcc = isGccEstablishment(this.establishment);
            this.hasInitialisedSubject.next(true);
            if (this.isGcc) {
              this.heading = 'ESTABLISHMENT.REGISTER-GCC-ADMIN';
              this.documentTransactionKey = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
              this.documentTransactionType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
            }
          },
          err => {
            this.alertService.showError(err.error.message);
            this.hasInitialisedSubject.next(false);
          }
        ),
        switchMap(() => iif(() => this.estData, this.getDocuments(), of(true))),
        takeUntil(this.destroy$)
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getDocuments() {
    return this.establishmentService
      .getAdminsOfEstablishment(this.estRouterData.registrationNo, this.estRouterData.referenceNo)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.superAdmin = this.admins[0];
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.estRouterData?.registrationNo,
            this.estRouterData?.referenceNo
          );
        })
      );
  }
  /**
   * method to navigate to register super admin
   */
  navigateToRegisterSuperAdmin() {
    this.router.navigate([
      EstablishmentConstants.ROUTE_VALIDATE_REGISTER_SUPER_ADMIN(this.estRouterData?.registrationNo)
    ]);
  }
  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix(): string {
    let prefix;
    if (!this.superAdmin?.person?.contactDetail?.mobileNo?.primary) {
      prefix = null;
    } else if (this.superAdmin.person.contactDetail.mobileNo.isdCodePrimary === null) {
      prefix = EstablishmentConstants.ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (key === this.superAdmin.person.contactDetail.mobileNo.isdCodePrimary) {
          prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }
}
