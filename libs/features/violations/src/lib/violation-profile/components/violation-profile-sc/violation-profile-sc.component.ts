/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  RoleIdEnum,
  MenuService,
  RouterConstants,
  TransactionService,
  AppealRequest,
  AuthTokenService, AppealResponse, AppealDetailsResponse
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ViolationsValidatorService } from '../../../shared/services';
import { ViolationsBaseScComponent } from '../../../shared/components';
import { ViolationRouteConstants, EligibleRoleConstants } from '../../../shared/constants';
import { DocumentTransactionType, ViolationStatusEnum, ViolationClassEnum } from '../../../shared';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";
import { AppealResourceTypeEnum } from '../../../shared/enums/appeal-resource-type-enum';

@Component({
  selector: 'vol-violation-profile-sc',
  templateUrl: './violation-profile-sc.component.html',
  styleUrls: ['./violation-profile-sc.component.scss']
})
export class ViolationProfileScComponent extends ViolationsBaseScComponent implements OnInit {
  /**
   *
   * @param lookupService
   * @param modalService
   * @param documentService
   * @param router
   * @param workflowService
   * @param alertService
   * @param routerData
   * @param language
   * @param location
   * @param activatedroute
   * @param validatorService
   */
  modalHeading = '';
  dismissible = false;
  warningMessage = '';
  doNoImposePenalty: String;
  @ViewChild('warningTemplate', { static: true })
  warningTemplate: TemplateRef<HTMLElement>;
  bsModalRef: BsModalRef;
  accessInternalRoles = EligibleRoleConstants.ELIGIBLE_INTERNAL_ROLES;
  accessExternalRoles = EligibleRoleConstants.ELIGIBLE_EXTERNAL_ROLES;
  accessCsrOnly = EligibleRoleConstants.ELIGIBLE_CSR_ROLES;
  showAppealForm = false;
  userId: number;
  violationStatusApproved = ViolationStatusEnum.APPROVED;


  constructor(
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly activatedroute: ActivatedRoute,
    readonly validatorService: ViolationsValidatorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private menuService: MenuService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerData,
      activatedroute,
      appToken,
      location,
      transactionService,
      appealVlcService,
      authService
    );
  }

  ngOnInit(): void {
    this.alertService.clearAllErrorAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.userId = this.authTokenService.getEstablishmentUID();
    super.initializeData();
    this.initializeView();
    this.checkIfAuthorized();
    this.doNoImposePenalty = ViolationClassEnum.DO_NOT_IMPOSE_PENALTY;
  }

  checkIfAuthorized() {
    const isEntitled = this.menuService.isUserEntitled(this.accessExternalRoles, this.regNo);
    if (!this.isAppPrivate && !isEntitled) {
      this.router.navigate([RouterConstants.ROUTE_NOT_FOUND]);
    }
  }

  modifyPenaltyAmount() {
    if (
      this.transactionDetails.existingTransactionAvailable === null &&
      this.transactionDetails.existingTransactionId === null
    ) {
      this.router.navigate([ViolationRouteConstants.ROUTE_MODIFY_VIOLATIONS_PROFILE(this.violationId, this.regNo)], {
        skipLocationChange: true
      });
    } else {
      const type = this.transactionDetails.existingTransactionAvailable;
      this.showModal(this.warningTemplate, 'lg');
      if (type === DocumentTransactionType.MODIFY_TRANSACTION_TYPE) {
        this.warningMessage = 'VIOLATIONS.MODIFY-WARNING';
      } else if (type === DocumentTransactionType.CANCEL_TRANSACTION_TYPE) {
        this.warningMessage = 'VIOLATIONS.CANCEL-WARNING';
      }
      this.modalHeading = 'VIOLATIONS.MODIFY';
    }
  }

  cancelViolation() {
    if (
      this.transactionDetails.existingTransactionAvailable === null &&
      this.transactionDetails.existingTransactionId === null
    ) {
      this.router.navigate([ViolationRouteConstants.ROUTE_CANCEL_VIOLATIONS_PROFILE(this.violationId, this.regNo)], {
        skipLocationChange: true
      });
    } else {
      const type = this.transactionDetails.existingTransactionAvailable;
      this.showModal(this.warningTemplate, 'lg');
      if (type === DocumentTransactionType.MODIFY_TRANSACTION_TYPE) {
        this.warningMessage = 'VIOLATIONS.MODIFY-WARNING';
      } else if (type === DocumentTransactionType.CANCEL_TRANSACTION_TYPE) {
        this.warningMessage = 'VIOLATIONS.CANCEL-WARNING';
      }
      this.modalHeading = 'VIOLATIONS.CANCEL-VIOLATIONS';
    }
  }

  // This is toggler method to show Appeal Form
  navigateToAppealOnViolation(transactionRefNo: number, type: boolean, previousRequest: AppealDetailsResponse){
    let route = ViolationRouteConstants.ROUTE_APPEAL_ON_VIOLATION(this.regNo, this.violationId);
    route += `?traceId=${transactionRefNo}&type=${type ? AppealResourceTypeEnum.REQUEST_VIEW : AppealResourceTypeEnum.APPEAL}&appeal=${!previousRequest}`;
    this.router.navigateByUrl(route);
  }
  // This would hide the appeal form
  deactivateAppealForm() {
    this.showAppealForm = false;
  }

  submitAppeal(appealRequest: AppealRequest) {
    this.transactionService.submitAppeal(appealRequest).subscribe(
      response => {
        this.alertService.showSuccess(response.message);
        setTimeout(() => this.navigateBack(), 2000);
      },
      err => {
        this.alertService.showError(err.error.message);
      },
      () => {}
    );
  }

  navigateBack() {
    this.location.back();
  }
  /**
   * Method to show modal
   * @param template
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.modalService.show(modalRef, config);
  }

  /**
   * Method to cancel the transaction
   */
  closeModal() {
    this.bsModalRef.hide();
  }
}
