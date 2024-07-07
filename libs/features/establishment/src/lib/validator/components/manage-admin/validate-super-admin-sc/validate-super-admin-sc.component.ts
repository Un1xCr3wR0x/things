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
  Channel,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Admin,
  AdminRoleEnum,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentKeyEnum,
  EstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-super-admin-sc',
  templateUrl: './validate-super-admin-sc.component.html',
  styleUrls: ['./validate-super-admin-sc.component.scss']
})
export class ValidateSuperAdminScComponent extends ValidatorScBaseComponent implements OnInit {
  name = '';
  canReturn = false;
  isReturn: boolean;
  transactionNumber = null;
  admins: Admin[] = [];
  currentAdmin: Admin;
  newAdmin: Admin;
  isReturnToAdmin = false;
  adminDetailsValidationForm: FormGroup;
  transactionHeading = EstablishmentKeyEnum.REPLACE_SUPER_ADMIN;
  currentAdminHeading = '';
  newAdminHeading = '';

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
    this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) {
      this.initialiseView();
    } else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing Owner details and comments
   * @param referenceNumber
   */
  initialiseView() {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;

    this.adminDetailsValidationForm = this.createForm();
    this.adminDetailsValidationForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();

    this.establishmentService
      .getAdminsOfEstablishment(this.estRouterData.registrationNo, this.estRouterData.referenceNo)
      .pipe(
        map(res => res.admins),
        tap(res => {
          this.admins = res;
          this.currentAdmin = this.admins[0];
          this.newAdmin = this.admins[1];
          if (this.currentAdmin.roles[0].english === AdminRoleEnum.GCC_ADMIN) {
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_GCC_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_GCC_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_GCC_ADMIN;
            this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
          } else {
            if (this.estRouterData.channel === Channel.FIELD_OFFICE) {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_FO_TYPE;
            } else {
              this.documentTransactionType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
            }
            this.transactionHeading = EstablishmentKeyEnum.REPLACE_SUPER_ADMIN;
            this.currentAdminHeading = EstablishmentKeyEnum.CURRENT_SUPER_ADMIN;
            this.newAdminHeading = EstablishmentKeyEnum.NEW_SUPER_ADMIN;
            this.documentTransactionKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_KEY;
          }
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.estRouterData?.registrationNo,
            this.estRouterData?.referenceNo
          );
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });

    this.getEstablishmentDetails(this.estRouterData.registrationNo);

    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }
  /**
   * method to navigate to replace super admin
   */
  navigateToReplaceSuperAdmin() {
    this.router.navigate([
      EstablishmentConstants.VALIDATE_REPLACE_SUPER_ADMIN_ROUTE(this.estRouterData?.registrationNo)
    ]);
  }
  goToEstProfile() {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(this.establishment.registrationNo)]);
  }

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.newAdmin.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
