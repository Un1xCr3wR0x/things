/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  AppConstants,
  AuthTokenService,
  BPMTask,
  BilingualText,
  Environment,
  EnvironmentToken,
  RouterService,
  Transaction,
  TransactionService,
  WorkflowService,
  removeEscapeChar
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { TabProps, TransactionModalTypeEnum } from '../../enums';
import { ActiveReporteeItem } from '../../models';
import { TeamManagementService } from '../../services';
import { TransactionsBaseScComponent } from '../base/transactions-base-sc.component';
import { TeamTransactionsEntriesDcComponent } from '../team-transactions-entries-dc/team-transactions-entries-dc.component';

interface ReassignResponse {
  bulkOperationOutput: string;
}
const commentLength = AppConstants.BPM_MAXLENGTH_COMMENTS;
const commentByteLength = AppConstants.BPM_BYTE_MAXLENGTH_COMMENTS;
@Component({
  selector: 'tm-team-transactions-view-sc',
  templateUrl: './team-transactions-view-sc.component.html',
  styleUrls: ['./team-transactions-view-sc.component.scss']
})
export class TeamTransactionsViewScComponent extends TransactionsBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  selectedTransactions: BPMTask[];
  modalRef: BsModalRef;
  tabProps = TabProps;
  selectedTab: string = this.tabProps.ALL_TRANSACTIONS;
  reassignForm: FormGroup;
  commentForm: FormGroup;
  teamMemberList: ActiveReporteeItem[] = [];
  modalSubscription: Subscription;
  selectedTransactionsSubscription: Subscription;
  modalType: String;
  formArray: FormArray;
  activeReportees: ActiveReporteeItem[] = [];
  workflowUser: string;
  noOfTransactons = 0;
  @ViewChild('reassignModal') reassignModal: TemplateRef<HTMLElement>;
  @ViewChild('unholdReassignModal') unholdReassignModal: TemplateRef<HTMLElement>;
  @ViewChild('holdModal') holdModal: TemplateRef<HTMLElement>;
  @ViewChild('unholdModal') unholdModal: TemplateRef<HTMLElement>;
  @ViewChild('entries') entries: TeamTransactionsEntriesDcComponent;
  @ViewChild('navbar') filterBtnRef: ElementRef;

  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly tmService: TeamManagementService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {
    super(tmService, workflowService, environment, transactionService, routerService, authTokenService);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.fromTeam = true;
    this.showCount = false;
    this.alertService.clearAlerts();
    super.ngOnInit();
    if (this.tmService.selectedTab) {
      this.sideMenuChange(this.tmService.selectedTab, false);
    } else this.getList(null, true);

    this.formInitialization();
    this.modalSubscription = this.tmService.openModal$.subscribe(modal => {
      this.modalType = modal;
      this.openModal(this.modalType);
    });
    this.selectedTransactionsSubscription = this.tmService.selectedTransactions$.subscribe(res => {
      this.selectedTransactions = res;
      if (this.selectedTransactions.length === 0 && this.entries) this.entries.uncheckAll();
    });
    this.tmService.selectedTransactions$.subscribe(res => (this.noOfTransactons = res.length));
  }
  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy(): void {
    this.tmService.openModal.next(null);
    this.modalSubscription?.unsubscribe();
    this.tmService.selectedTransactions.next([]);
    if (this.selectedTransactionsSubscription !== undefined) this.selectedTransactionsSubscription.unsubscribe();
  }
  /**
   * method to initialise form group
   */
  formInitialization() {
    this.formArray = this.fb.array([]);
    this.reassignForm = this.fb.group({
      teamMember: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      userId: [null, { validators: Validators.required }],
      comments: [null, { validators: Validators.compose([Validators.required, Validators.maxLength(commentLength)]) }]
    });
    this.commentForm = this.fb.group({
      comments: [null, { validators: Validators.required }]
    });
  }

  /**
   *
   * @param key method to change modal
   */
  modalChange(key) {
    this.tmService.openModal.next(key);
  }
  /**
   * method to clear selected transactions
   */
  clearSelectedTransactions() {
    this.tmService.selectedTransactions.next([]);
  }
  /**
   *
   * @param filterItem method to filter transactions
   */
  onFilterTransactions(filterItem) {
    if (this.selectedTab === TabProps.ALL_TRANSACTIONS || this.selectedTab === TabProps.ONHOLD_TRANSACTIONS) {
      this.filterTransactions(filterItem, true);
    } else this.filterTransactions(filterItem, false);
  }
  // slaOlaFilter(value: BilingualText[]){
  //   if(value && value.length > 0){
  //     this.olaSlaFilters = value;
  //   }else{
  //     this.olaSlaFilters = [];
  //   }
  // }
  /**
   *
   * @param id method for side menu changes
   */
  sideMenuChange(id, modifyRequest = true) {
    this.tmService.selectedTab = id;
    this.navbar?.filter?.filterbutton.onHidden();
    if (this.selectedTab !== id) {
      if (modifyRequest) this.workflowService.teamRequest = null;
      this.selectedTab = id;
      this.getTransactionsAndStats(id);
    }
  }
  /**
   * method to reassign task
   */
  actionEvent() {
    this.alertService.clearAlerts();
    let taskIdList: BPMTask[] = this.tmService.selectedTransactions.getValue();
    taskIdList = [...this.getFilteredTransactions(taskIdList, this.reassignForm?.value?.userId)];
    this.tmService
      .reassignTask(
        [...taskIdList.map(task => task.taskId)],
        'admin',
        this.reassignForm?.value?.userId,
        'user',
        removeEscapeChar(this.reassignForm?.get('comments')?.value, commentByteLength)
      )
      .subscribe(
        () => {
          this.alertService.showSuccessByKey('TEAM-MANAGEMENT.TRANSACTION_REASSIGNED');
          this.getTransactionCountAndState();
        },
        error => {
          if (error?.status === 422) this.alertService.showError(error.error.message);
          else this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
        }
      );
    this.resetAndHideModel();
  }
  /**
   * Method to get the selected transactions
   * @param transactions
   * @param userId
   */
  private getFilteredTransactions(transactions: BPMTask[], userId: string): BPMTask[] {
    return transactions.filter(item => item.assigneeId !== userId);
  }

  /**
   * method to hold task
   */
  holdEvent() {
    this.alertService.clearAlerts();
    const taskIdList = this.tmService.selectedTransactions.getValue();
    this.tmService
      .holdTask(
        [...taskIdList?.map(task => task.taskId)],
        removeEscapeChar(this.commentForm?.get('comments')?.value, commentByteLength)
      )
      .subscribe(
        () => {
          this.alertService.showSuccessByKey('TEAM-MANAGEMENT.TRANSACTION_HOLD');
          this.getTransactionCountAndState();
        },
        () => {
          this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
        }
      );
    this.resetAndHideModel();
  }

  /**
   * method to unhold task
   */
  unHoldEvent() {
    this.alertService.clearAlerts();
    const taskIdList = this.tmService.selectedTransactions.getValue();
    this.tmService.unHoldTask([...taskIdList?.map(task => task.taskId)]).subscribe(
      () => {
        this.alertService.showSuccessByKey('TEAM-MANAGEMENT.TRANSACTION_UNHOLD');
        this.getTransactionCountAndState();
      },
      () => {
        this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
      }
    );
    this.resetAndHideModel();
  }

  /**
   * method to unhold and reassign task
   */
  unholdAndReassignEvent() {
    this.alertService.clearAlerts();
    const taskIdList = this.tmService.selectedTransactions.getValue();
    this.tmService
      .unholdAndReassignnTask(
        [...taskIdList?.map(task => task.taskId)],
        'admin',
        this.reassignForm?.value?.userId,
        'user',
        removeEscapeChar(this.reassignForm?.get('comments')?.value, commentByteLength)
      )
      .subscribe(
        () => {
          this.getTransactionCountAndState();
          this.alertService.showSuccessByKey('TEAM-MANAGEMENT.TRANSACTION_UNHOLD_REASSIGNED');
        },
        () => {
          this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
        }
      );
    this.resetAndHideModel();
  }

  /**
   * method to call getcounttransaction and getTransactionsAndStats
   */
  getTransactionCountAndState() {
    if (this.showCount) this.getCountTransactionsForAll();
    if (this.reporteesList) {
      this.reporteesList.forEach(item => {
        item = this.setResponse(item, true);
      });
    }
    this.getTransactionsAndStats(this.selectedTab);
    this.tmService.selectedTransactions.next([]);
  }

  /**
   *
   * @param template mthod to show modal
   * @param size
   */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    if (this.tmService && (template === this.reassignModal || template === this.unholdReassignModal))
      this.tmService.getActiveReportees(this.selectedTransactions).subscribe(res => {
        this.activeReportees = res;
        this.teamMemberList = this.getTeamMembers(res);
      });
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   *
   * @param reportees method to get team members
   */
  getTeamMembers(reportees: ActiveReporteeItem[] = []) {
    if (this.selectedTab === this.tabProps.ALL_TRANSACTIONS || this.selectedTab === this.tabProps.ONHOLD_TRANSACTIONS) {
      return reportees;
    } else {
      return reportees?.filter(member => member?.userId !== this.selectedTab);
      // this.bpmTaskResponse.tasks[0].swimlaneRole
    }
  }
  /**
   *
   * @param modal method to open modal
   */
  openModal(modal) {
    if (this.tmService.selectedTransactions.getValue().length > 0) {
      if (modal === TransactionModalTypeEnum.REASSIGN) {
        this.reassignForm?.get('comments').clearValidators();
        this.reassignForm?.get('comments').setValidators([Validators.required, Validators.maxLength(commentLength)]);
        this.reassignForm?.get('comments').updateValueAndValidity();
        this.showModal(this.reassignModal, 'lg');
      } else if (modal === TransactionModalTypeEnum.UNHOLD_AND_REASSIGN) {
        this.reassignForm?.get('comments').clearValidators();
        this.reassignForm?.get('comments').setValidators([Validators.maxLength(commentLength)]);
        this.reassignForm?.get('comments').updateValueAndValidity();
        this.showModal(this.unholdReassignModal, 'lg');
      } else if (modal === TransactionModalTypeEnum.HOLD) {
        this.showModal(this.holdModal, 'lg');
      } else if (modal === TransactionModalTypeEnum.UNHOLD) {
        this.showModal(this.unholdModal, 'lg');
      } else {
        this.hideModal();
      }
    }
  }

  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
  }
  /** Method to reset form and hide modal. */
  resetAndHideModel() {
    this.hideModal();
    this.reassignForm?.reset();
    this.commentForm?.reset();
  }
  /**
   *
   * @param param0 method to set transactionList
   */
  transactionInObservableArray({ type, transaction }) {
    const val = this.tmService.selectedTransactions.getValue();
    const transactionList = type === 'ADD' ? [...val, transaction] : val?.filter(t => t.taskId !== transaction.taskId);
    this.tmService.selectedTransactions.next(transactionList);
  }
  /**
   *
   * @param value method to search transactions
   */
  searchTransactionsWithId(value) {
    const isSupervisor =
      this.selectedTab === this.tabProps.ALL_TRANSACTIONS || this.selectedTab === this.tabProps.ONHOLD_TRANSACTIONS;
    // this.searchTransactions(value, isSupervisor);
    this.searchTransactions({searchKey: value, type:""}, isSupervisor);
  }

  navigateToTransaction(referenceNo: string) {
    this.transactionService.getTransaction(referenceNo).subscribe((transaction: Transaction) => {
      this.transactionService.navigate(transaction);
    });
  }
}
