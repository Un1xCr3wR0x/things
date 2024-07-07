/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  LookupService,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  RouterService,
  UuidGeneratorService,
  WorkflowService,
  MenuService,
  Environment,
  EnvironmentToken,
  TransactionService,
  ApplicationTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorService, ValidatorRoutingService } from '../../../shared/services';
import { ValidatorBaseScComponent } from '../base/validator-base-sc.component';
import { PlatformLocation, Location } from '@angular/common';
import { TransactionSummary } from '../../../shared/models';
import { CategoryEnum } from '../../../shared/enums';
declare const require;
@Component({
  selector: 'ces-complaint-sc',
  templateUrl: './complaint-sc.component.html',
  styleUrls: ['./complaint-sc.component.scss']
})
export class ComplaintScComponent extends ValidatorBaseScComponent implements OnInit {
  @ViewChild('previousTxnTemplate') previousTemplate: TemplateRef<HTMLElement>;
  /**
   * Local variables
   */

  transactionId: number = null;
  selectedCategory: string;
  priority: BilingualText;
  parentForm: FormGroup;
  modalRef: BsModalRef;
  isDepHeadDelegated = false;
  departmentItemList = [];
  departmentId: number;
  businessKey: number = null;
  previousTransactions: TransactionSummary[] = [];
  allTransactions: TransactionSummary[] = [];
  presentPreviousTransactions: TransactionSummary[] = [];
  currentPage = 0;
  isLoading = false;
  isIndividualApp = false;

  /**
   *
   * @param modalService
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   * @param router
   * @param workflowService
   * @param route
   * @param routerData
   * @param appToken
   * @param routerService
   * @param fb
   * @param lookUpService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) public routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly pLocation: PlatformLocation,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      formBuilder,
      alertService,
      validatorService,
      workflowService,
      uuidService,
      fb,
      router,
      modalService,
      lookUpService,
      route,
      documentService,
      routerData,
      appToken,
      pLocation,
      routerService,
      validatorRoutingService,
      location,
      menuService,
      transactionService,
      environment,
      authTokenService
    );
  }
  /**
   * Method to initialise variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }

  /**
   * method to show modal
   * @param modal
   */
  openModal(modal: BsModalRef) {
    this.modalRef = modal;
  }
  /**
   * Method to handle cancel operation
   */
  onCancel(): void {
    this.navigateToInbox();
  }
  /**
   * Method to handle actions
   * @param action
   */
  onAction(action: string): void {
    this.currentAction = action;
  }
  /**
   * method to assign selected priority
   * @param value
   */
  selectPriority(value: BilingualText) {
    this.alertService.clearAlerts();
    this.priority = value;
  }
  /**
   * Method to show error
   */
  showError() {
    markFormGroupTouched(this.transactionTypeForm);
    this.alertService.showMandatoryErrorMessage();
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }
  /**
   * method to show previous transaction
   */
  onShowPreviousTransactions() {
    this.allTransactions = [];
    this.presentPreviousTransactions = [];
    this.previousTransactions = [];
    this.isLoading = true;
    this.validatorService.getTransactionList(this.customerIdentifier).subscribe(
      (response: TransactionSummary[]) => {
        const resp: TransactionSummary[] = [];
        resp.push(...response);
        this.previousTransactions = resp
          .filter(item => item?.transactionTraceId?.toString() !== this.transactionTraceId?.toString())
          .sort(
            (v1, v2) => Number(new Date(v2?.createdDate?.gregorian)) - Number(new Date(v1?.createdDate?.gregorian))
          );
        this.currentPage = 0;
        this.getTransactions();
        this.allTransactions = this.previousTransactions;
        this.isLoading = false;
        this.openPopupWindow(this.previousTemplate, 'lg');
      },
      () => {
        this.isLoading = false;
        this.openPopupWindow(this.previousTemplate, 'lg');
      }
    );
  }
  /**
   * method to get transactions
   */
  getTransactions() {
    this.currentPage++;
    this.presentPreviousTransactions = this.previousTransactions.slice(0, this.currentPage * 5);
  }
  /**
   *
   * @param category method to filter transactions
   */
  filterCategory(category) {
    this.previousTransactions = [];
    this.presentPreviousTransactions = [];
    this.currentPage = 0;
    if (category !== CategoryEnum.ALL_CATEGORY) {
      const previousTxn = this.allTransactions?.filter(item => item?.category?.english?.includes(category));
      this.previousTransactions = previousTxn;
      this.getTransactions();
    } else if (category === CategoryEnum.ALL_CATEGORY) {
      this.previousTransactions = this.allTransactions;
      this.getTransactions();
    }
  }
}
