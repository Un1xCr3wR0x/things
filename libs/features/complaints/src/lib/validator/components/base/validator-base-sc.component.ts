/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Directive, HostListener, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeToken,
  AuthTokenService,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  ChannelConstants,
  DocumentService,
  Environment,
  EnvironmentToken,
  JWTPayload,
  LookupService,
  LovList,
  MenuService,
  Role,
  RouterData,
  RouterDataToken,
  RouterService,
  TransactionInterface,
  TransactionService,
  UuidGeneratorService,
  WorkFlowActions,
  WorkFlowPriority,
  WorkFlowPriorityType,
  WorkflowService,
  markFormGroupTouched,
  markFormGroupUntouched,
  removeEscapeChar
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ContactBaseScComponent } from '../../../shared/components';
import {
  ActionItemListConstants,
  ComplaintConstants,
  ConfirmationMessageConstants,
  RouterConstants as ContactRouterConstants,
  LovListConstants,
  PriorityListConstants
} from '../../../shared/constants';
import { CategoryEnum, PriorityEnum } from '../../../shared/enums';
import { ComplaintTypeUpdateRequest } from '../../../shared/models';
import { ValidatorRoutingService, ValidatorService } from '../../../shared/services';
const commentByteLength = AppConstants.BPM_BYTE_MAXLENGTH_COMMENTS;
@Directive()
export class ValidatorBaseScComponent
  extends ContactBaseScComponent
  implements OnInit, OnDestroy, TransactionInterface {
  /**
   * Local variables
   */
  isNavigateToItsm = false;
  hasCompleted: boolean;
  reRoute: string;
  isWorkflowCompleted = false;
  isEstAdminOrOwner: any;
  
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
    readonly alertService: AlertService,
    readonly validatorService: ValidatorService,
    readonly workflowService: WorkflowService,
    readonly uuidService: UuidGeneratorService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) public routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly pLocation: PlatformLocation,
    readonly routerService: RouterService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly location: Location,
    readonly menuService: MenuService,
    readonly transactionService: TransactionService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      formBuilder,
      modalService,
      validatorService,
      documentService,
      uuidService,
      alertService,
      router,
      workflowService,
      route,
      routerData,
      appToken,
      routerService,
      lookUpService,
      validatorRoutingService,
      location,
      menuService,
      environment,
      transactionService,
      authTokenService
    );
  }
  @HostListener('window:beforeunload')
  onWindowUnload() {
    if (this.uploadDocuments.length === 0) return;
    else this.documentService.deleteDocuments(null, this.uploadDocuments).subscribe();
  }
  /**
   * Method to intialise tasks
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.sequenceNumber = 1;
    
  }
  /**
   * Method to get category details
   * @param action
   */
  getInfoDetails(action: string) {
    if (this.category === CategoryEnum.SUGGESTION)
      this.buttonLabel = ActionItemListConstants.ACTION_ITEMS.find(item => item.action === action).buttonLabel;
    this.message = ConfirmationMessageConstants.CONFIRMATION_MESSAGE.find(
      item => item.category === this.category && item.action === action
    )?.message;
    if (this.currentAction !== action) {
      this.removeAllDocuments(true);
      if (
        action !== WorkFlowActions.RESOLVE &&
        action !== WorkFlowActions.RETURN_TO_CUSTOMER &&
        action !== WorkFlowActions.ACKNOWLEDGE
      )
        this.customerIdentity = null;
      else this.customerIdentity = this.validatorRoutingService.complaintRouterData.complainant;
      this.currentAction = action;
      if (
        action === WorkFlowActions.REQUEST_INFORMATION ||
        action === WorkFlowActions.DELEGATE ||
        action === WorkFlowActions.RE_ASSIGN_DEPARTMENT
      ) {
        if (this.assignedRole === Role.CUSTOMER_CARE_SENIOR_OFFICER || this.assignedRole === Role.CUSTOMER_CARE_OFFICER)
          this.locationList$ = this.lookUpService.getContactLists(
            LovListConstants.REGISTRATION,
            LovListConstants.GOSILOCATION
          );
        else if (this.assignedRole === Role.DEPARTMENT_HEAD) {
          // this.clerkList$ = this.validatorService.getClerkDetails(
          //   this.validatorRoutingService.complaintRouterData.departmentId
          // );
          const token: JWTPayload = this.authTokenService.decodeToken(this.authTokenService.getAuthToken());
          this.clerkList$ = this.validatorService.getEmployeesByHeadDepartmentId(parseInt(token.userreferenceid));
        }
      }
      this.generateUuid();
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to confirm update request details
   */
  confirmEvent() {
    this.alertService.clearAlerts();
    markFormGroupUntouched(this.actionForm);
    this.actionForm.updateValueAndValidity();
    if (this.actionForm.valid) {
      if (this.currentAction) {
        const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
        bpmUpdateRequest.taskId = this.validatorRoutingService.complaintRouterData.taskId;
        bpmUpdateRequest.user = this.validatorRoutingService.complaintRouterData.assigneeId;
        if (this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER_CARE)
          bpmUpdateRequest.outcome = WorkFlowActions.RETURN_TO_CUSTOMER;
        else bpmUpdateRequest.outcome = this.currentAction;
        if (this.actionForm.get('head')) {
          bpmUpdateRequest.organizationUser = this.actionForm.value.head;
          bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ORGANIZATIONUSER, this.actionForm.value.head);
        }
        if (this.actionForm.get('clerkId')) {
          bpmUpdateRequest.organizationUser = this.actionForm.value.clerkId;
          bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ORGANIZATIONUSER, this.actionForm.value.clerkId);
          bpmUpdateRequest.updateMap.set(
            BPMMergeUpdateParamEnum.ORGANIZATION,
            this.validatorRoutingService.complaintRouterData.departmentId
          );
        }
        if (this.actionForm.get('departmentId')) {
          bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ORGANIZATION, this.actionForm.value.departmentId);
        }
        if (this.actionForm.get('comments')) {
          bpmUpdateRequest.comments = removeEscapeChar(
            this.actionForm.value.comments,
            this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER ||
              this.currentAction === WorkFlowActions.RESOLVE ||
              this.currentAction === WorkFlowActions.ACKNOWLEDGE
              ? commentByteLength
              : null
          );
          const newComment = removeEscapeChar(this.actionForm.value.comments);
          if (this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER)
            bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURNCOMMENT, newComment);
          else if (this.currentAction === WorkFlowActions.RESOLVE)
            bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RESOLVECOMMENT, newComment);
          else if (this.currentAction === WorkFlowActions.ACKNOWLEDGE)
            bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.ACKCOMMENT, newComment);
          if (
            this.currentAction === WorkFlowActions.RESOLVE ||
            this.currentAction === WorkFlowActions.ACKNOWLEDGE ||
            this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER
          )
            bpmUpdateRequest.isExternalComment = true;
        }
        this.workflowUpdate(bpmUpdateRequest);
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
      markFormGroupTouched(this.actionForm);
    }
  }

  /**
   * Method to update bpm request
   * @param bpmUpdateRequest
   */
  workflowUpdate(bpmUpdateRequest: BPMUpdateRequest) {
    if (
      this.currentAction === WorkFlowActions.REQUEST_INFORMATION ||
      this.currentAction === WorkFlowActions.DELEGATE ||
      this.currentAction === WorkFlowActions.RE_ASSIGN_DEPARTMENT ||
      this.currentAction === WorkFlowActions.RESOLVE ||
      this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER ||
      this.currentAction === WorkFlowActions.ACKNOWLEDGE
    ) {
      bpmUpdateRequest.payload = this.validatorRoutingService?.complaintRouterData?.content;
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          this.completeWorkflow();
        },
        error => {
          if (this.modalRef) this.modalRef.hide();
          this.alertService.showError(error.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
        () => {
          this.completeWorkflow();
        },
        error => {
          this.modalRef.hide();
          this.alertService.showError(error.error.message);
        }
      );
    }
  }
  /**
   * navigate to itsm page
   */
  navigateTo() {
    if (this.transactionTraceId) {
      this.isNavigateToItsm = true;
      this.router.navigate([ContactRouterConstants.ROUTE_CONTACT_ITSM]);
    }
  }

  /** method to show modify txn details modal
   * @param templateRef
   */
  showPopUp(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    this.isTypeSelected = false;
    let contentInfo: any=this.validatorRoutingService?.complaintRouterData?.content;
    this.isEstAdminOrOwner= contentInfo?.Request?.Body?.isEstAdminOrOwner;
    this.priorityList = new LovList(PriorityListConstants.PRIORITY_LIST);
    if (
      this.category === CategoryEnum.ENQUIRY ||
      this.category === CategoryEnum.COMPLAINT ||
      this.category === CategoryEnum.SUGGESTION
    ) {
      this.canEditPriorityOnly = false;
      if (this.category === CategoryEnum.ENQUIRY || this.category === CategoryEnum.COMPLAINT) {
  

        if (this.transactionSummary.entryChannel.english == 'Taminaty Business') {
          const category = `${this.category}${'GOL'}`;
          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
        } else if(this.transactionSummary.entryChannel.english == 'Field Office' && this.isEstAdminOrOwner=== true){
          const category = `${this.category}${'GOL'}`;
          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
        }
        else {
          const category = `${
            this.category === CategoryEnum.ENQUIRY
              ? this.transactionSummary.registrationNo
                ? LovListConstants.LOVLIST_ESTABLISHMENT
                : LovListConstants.LOVLIST_CONTRIBUTOR
              : ''
          }${this.category}`;
          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
        }
      } else if (this.category === CategoryEnum.SUGGESTION) {
        if (this.transactionSummary.entryChannel.english == 'Taminaty Business') {
          const category = `${this.category}${'GOL'}`;

          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
        } else if(this.transactionSummary.entryChannel.english == 'Field Office' && this.isEstAdminOrOwner=== true){
          const category = `${this.category}${'GOL'}`;

          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
        }
         else {
          this.typeList$ = this.lookUpService.getContactLists(
            LovListConstants.CATEGORY,
            LovListConstants.SUGGESTION_CATEGORY
          );
        }
      }
    } else {
      this.canEditPriorityOnly = true;
    }
    if (LovListConstants.LABELS.filter(item => item.value)) {
      const constantItem = LovListConstants.LABELS.find(
        item => item.value?.toLowerCase() === this.category?.toLowerCase()
      );
      this.typeLabel = constantItem?.typeLabel;
      this.subTypeLabel = constantItem?.subTypeLabel;
      this.heading = constantItem?.modalHeader;
    }
  }

  /**
   * Method to select corresponding type of category
   * @param category
   */
  onTypeSelect(type: string) {
    if (type === null) {
      if (this.transactionTypeForm.get('subType') && this.transactionTypeForm.get('subType').get('english')) {
        this.transactionTypeForm.updateValueAndValidity();
        this.transactionTypeForm.get('subType').get('english').setValue(null);
      }
      this.isTypeSelected = false;
      this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
      this.subTypeList$ = this.subTypeList.asObservable();
    } else {
      this.isTypeSelected = true;
      if (this.transactionSummary.entryChannel.english == 'Taminaty Business') {
        const domainName = `${this.category}${'GOL'}${type}`.replace(/\s+/g, '');
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      } else if(this.transactionSummary.entryChannel.english == 'Field Office' && this.isEstAdminOrOwner=== true){
        const domainName = `${this.category}${'GOL'}${type}`.replace(/\s+/g, '');
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      }
      else {
        const domainName = `${
          this.category === CategoryEnum.ENQUIRY
            ? this.transactionSummary.registrationNo
              ? LovListConstants.LOVLIST_ESTABLISHMENT
              : LovListConstants.LOVLIST_CONTRIBUTOR
            : ''
        }${this.category}${type}`.replace(/\s+/g, '');
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      }
    }
  }
  /**
   * Method to modify the complaint details
   */
  modifyAction() {
    this.alertService.clearAlerts();
    if (this.transactionTypeForm.valid && this.transactionSummary) {
      if (
        this.transactionTypeForm.value.priority &&
        this.transactionTypeForm.value.type &&
        ((this.transactionSummary.type && this.transactionSummary.type.english) !==
          this.transactionTypeForm.value.type.english ||
          (this.transactionSummary.subtype && this.transactionSummary.subtype.english) !==
            this.transactionTypeForm.value.subType.english) &&
        (this.transactionSummary.priority && this.transactionSummary.priority?.english) !==
          this.transactionTypeForm.value.priority?.english
      ) {
        forkJoin([this.updateSummaryDetails(), this.updateTaskPriority()]).subscribe(
          () => {
            this.getTaskDetails(false);
            this.completeUpdation();
          },
          error => {
            this.alertService.showError(error.error.message);
          }
        );
      } else if (
        this.transactionTypeForm.value.type !== undefined &&
        ((this.transactionSummary.type && this.transactionSummary.type.english) !==
          this.transactionTypeForm.value.type.english ||
          this.transactionSummary.type === null ||
          (this.transactionSummary.subtype && this.transactionSummary.subtype.english) !==
            this.transactionTypeForm.value.subType.english ||
          this.transactionSummary.subtype === null)
      ) {
        this.updateSummaryDetails().subscribe(() => {
          this.completeUpdation();
        });
      } else if (
        (this.transactionSummary.priority && this.transactionSummary.priority?.english) !==
        this.transactionTypeForm.value.priority?.english
      ) {
        this.updateTaskPriority().subscribe(() => {
          this.getTaskDetails(false);
          this.completeUpdation(false);
        });
      } else {
        this.completeUpdation(false);
      }
    }
    this.hideModal();
  }
  /**
   * method to update priority
   */
  updateTaskPriority() {
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.validatorRoutingService.complaintRouterData.taskId;
    bpmUpdateRequest.updateType = WorkFlowPriorityType.UPDATE;
    bpmUpdateRequest.priority =
      this.transactionTypeForm.value.priority?.english === PriorityEnum.HIGH
        ? WorkFlowPriority.HIGH
        : this.transactionTypeForm.value.priority?.english === PriorityEnum.MEDIUM
        ? WorkFlowPriority.MEDIUM
        : WorkFlowPriority.LOW;
    return this.workflowService.updateTaskPriority(bpmUpdateRequest);
  }
  /** method to execute after updation of txn summary details@param isUpdated*/
  completeUpdation(isUpdated = true) {
    this.alertService.showSuccessByKey(ComplaintConstants.MODIFY_SUMMARY_SUCCESS_MESSAGE);
    this.transactionTypeForm.reset();
    if (isUpdated) this.getTransactionDetails(false);
  }
  /**This method is to perform cleanup activities when an instance of component is destroyed.*/
  ngOnDestroy() {
    if (this.isNavigateToItsm === false && this.isNavigateToTracking === false)
      this.validatorRoutingService.removeRouterToken();
  }
  /* method to update type and subtype of transaction*/
  updateSummaryDetails(isSuggestion = false) {
    const updateRequest: ComplaintTypeUpdateRequest = new ComplaintTypeUpdateRequest();
    if (isSuggestion && this.actionForm?.value?.category?.english && this.actionForm.value.subCategory?.english) {
      updateRequest.subType = this.actionForm.value.subCategory.english;
      updateRequest.type = this.actionForm.value.category.english;
      updateRequest.isEstAdminOrOwner = this.isEstAdminOrOwner;
    } else {
      if (this.transactionTypeForm?.value?.type?.english && this.transactionTypeForm?.value?.subType?.english) {
        updateRequest.subType = this.transactionTypeForm.value.subType.english;
        updateRequest.type = this.transactionTypeForm.value.type.english;
        updateRequest.isEstAdminOrOwner = this.isEstAdminOrOwner;
      }
    }
    return this.validatorService.updateComplaintType(this.businessKey, updateRequest);
  }
  /** method to show confirmation modal @param templateRef @param value*/
  submitComplaint(templateRef: TemplateRef<HTMLElement>, value: string) {
    this.alertService.clearAlerts();
    if (this.actionForm.valid) {
      this.showModal(templateRef, value);
    } else {
      markFormGroupTouched(this.actionForm);
      this.alertService.showMandatoryErrorMessage();
    }
  }
  setTransactionComplete() {}
  askForCancel() {
    this.hasCompleted = true;
    if (!this.isWorkflowCompleted) this.removeAllDocuments();
    this.router.navigate([this.reRoute]);
  }
  /** method to be called after modify txn summary details*/
  completeWorkflow() {
    this.isWorkflowCompleted = true;
    if (
      this.currentAction === WorkFlowActions.RESOLVE ||
      this.currentAction === WorkFlowActions.RETURN_TO_CUSTOMER ||
      this.currentAction === WorkFlowActions.ACKNOWLEDGE
    ) {
      var isvalid = this.actionForm.value?.rightCategory?.isValid?.english == 'Valid' ? 1 : 0;
      this.validatorService.updateTransactionType(
        this.businessKey,
        isvalid,
        this.actionForm.value.rightCategory.category.english,
        this.actionForm.value.rightCategory.type.english,
        this.actionForm.value.rightCategory.subtype.english
      );
    }
    this.actionForm.reset();
    this.alertService.showSuccessByKey(
      `${ComplaintConstants.COMPLAINTS}${this.setMessage(this.currentAction, this.assignedRole)}`
    );
    if (this.modalRef) this.modalRef.hide();
    this.navigateToInbox();
  }
}
