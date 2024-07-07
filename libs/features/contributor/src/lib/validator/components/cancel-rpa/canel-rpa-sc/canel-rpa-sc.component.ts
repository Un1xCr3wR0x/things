import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BPMUpdateRequest,
  DocumentService,
  LookupService,
  Lov,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ValidatorBaseScComponent } from '@gosi-ui/features/contributor/lib/shared';
import { SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared/models';
import {
  AddAuthorizationService,
  ContributorService,
  EstablishmentService,
  RpaServices
} from '@gosi-ui/features/contributor/lib/shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'cnt-canel-rpa-sc',
  templateUrl: './canel-rpa-sc.component.html',
  styleUrls: ['./canel-rpa-sc.component.scss']
})
export class CanelRpaScComponent extends ValidatorBaseScComponent implements OnInit {
  sin: number;
  cancelEngagment: SearchEngagementResponse;

  engagementDetails: SearchEngagementResponse;
  //Lov Lists
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  cancelReasonList$: Observable<LovList>;
  isFirstScheme: boolean = false;
  showReject: boolean = false;
  isValidator1: boolean = false;
  booleanList: LovList;
  isAggreed: boolean = false;
  lastSchemeForm: boolean = false;
  list: LovList = null;
  items: Lov[];
  RejectionReasonCode: any;
  cancelReasonForm: FormGroup = new FormGroup({});
  reasonCode: number;
  rpaRequestId: number;
  cancellationRequestId: number;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly rpaService: RpaServices,
    private fb: FormBuilder,
    @Inject(RouterDataToken) private routerData: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  ngOnInit(): void {
    this.checkButtonList();
    this.comments = this.routerData.comments;
    this.cancelReasonForm = this.createCancelReasonForm();
    this.getLov();

    let resource: string = this.routerData.resourceType;
    if (resource == 'Cancel Rpa First Scheme') {
      this.isFirstScheme = true;
    } else {
      this.isFirstScheme = false;
    }
    if (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR__1) {
      this.isValidator1 = true;
    }
    this.sin = this.routerData.idParams.get('socialInsuranceNo');
    this.getCancelRpaDetails();
    this.getIndividualContributorDetails();
  }

  createCancelReasonForm() {
    return this.fb.group({
      cancelReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      })
    });
  }

  async getLov() {
    try {
       this.items = [];
      while (this.items.length === 0) {
        this.cancelReasonList$ = this.lookupService.getCancelRpaReasons();
        this.rejectReasonList$ = this.lookupService.getCancelRPARejectReasonList();
        this.returnReasonList$ = this.lookupService.getEstablishmentRejectReasonList();

        this.rejectReasonList$.subscribe(res => {
          this.items = res.items;
          console.log(this.items, 'items');
        });

        await this.delay(1000);
      }
    } catch (error) {
      console.error('Error fetching LOV:', error);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkFormValid() {
    this.validatorForm.markAllAsTouched();
    this.alertService.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS');
  }

  setCancellationReason() {
    if (this.cancelEngagment?.cancellationReason?.english)
      this.cancelReasonForm.get('cancelReason').setValue(this.cancelEngagment?.cancellationReason);
  }

  checkButtonList() {
    this.canReject = false;
    this.canReturn = false;
    if (this.routerData.customActions) {
      let hasReject = false;
      let hasReturn = false;
      this.routerData.customActions.forEach(element => {
        if (element === 'REJECT') {
          hasReject = true;
        } else if (element === 'RETURN') {
          hasReturn = true;
        }
      });
      this.canReject = hasReject;
      this.canReturn = hasReturn;
    }
  }

  getCancelRpaDetails() {
    this.rpaService.getEngagementFullDetailsCancelRpa(this.sin, true).subscribe(res => {
      this.cancelEngagment = res;
      this.setCancellationReason();
      console.log(this.cancelEngagment, 'cancel');
    });
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.hideModal();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  locationBack(){
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  /** Method to decline reject / return pop up. */
  decline(): void {
    this.modalRef.hide();
    this.validatorForm.markAsUntouched();
    this.validatorForm.markAsPristine();
  }

  handleEInspectionActions(key: number) {
    if (key == 0) {
      this.approveTXN();
    } else if (key == 1) {
      let rejectReason = this.validatorForm.get('rejectionReason').value.english;
      let RejectionReasonCode = this.getRejectionReason(rejectReason);
      const bpmRequest = new BPMUpdateRequest();
      bpmRequest.outcome = WorkFlowActions.REJECT;
      bpmRequest.payload = this.routerData.content;
      if (bpmRequest.payload) {
        Object.keys(bpmRequest.payload).forEach(key => {
          this.setRejectionReason(bpmRequest.payload[key], RejectionReasonCode);
        });
      }
      bpmRequest.commentScope = 'BPM';
      bpmRequest.isExternalComment = false;
      if (this.validatorForm.get('comments')) bpmRequest.comments = this.validatorForm.get('comments').value;
      bpmRequest.taskId = this.routerData.taskId;
      bpmRequest.user = this.routerData.assigneeId;
      this.workflowService.mergeAndUpdateTask(bpmRequest).subscribe(
        (data: any) => {
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE');
          this.navigateToInbox();
        },
        err => {
          this.hideModal();
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.saveWorkflow(this.setWorkflowData(this.routerData, this.getWorkflowAction(key)));
      this.hideModal();
    }
  }

  approveTXN() {
    this.cancelReasonForm.markAllAsTouched();
    if (this.cancelReasonForm.invalid && this.isValidator1) {
      this.alertService.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS');
      this.hideModal();
    } else if (
      this.cancelReasonForm.get('cancelReason').get('english').value !==
      this.cancelEngagment?.cancellationReason?.english
    ) {
      const payload = {
        identifier: this.sin,
        rpaRequestId: this.cancelEngagment?.aggregationRequestId,
        cancellationReason: this.reasonCode,
        editFlow: true,
        cancellationRequestId: this.cancelEngagment?.cancellationRequestId
      };
      this.rpaService.submitCancellationReason(payload).subscribe(
        res => {
          //this.alertService.showSuccess(res.message);
          this.saveWorkflow(this.setWorkflowData(this.routerData, WorkFlowActions.UPDATE));
          this.hideModal();
        },
        err => {
          if (err.error) {
            this.hideModal();
            this.alertService.showError(err?.error?.message);
          }
        }
      );
    } else if (
      this.cancelReasonForm.get('cancelReason').get('english').value ==
      this.cancelEngagment?.cancellationReason?.english
    ) {
      this.saveWorkflow(this.setWorkflowData(this.routerData, this.getWorkflowAction(0)));
      this.hideModal();
    } else {
      throw new Error('Something went wrong');
    }
  }

  getRejectionReason(value: any): any | null {
    const foundElement = this.items?.find(element => element.value.english === value || element.value.arabic === value);
    return foundElement ? foundElement.code : null;
  }

  // method to set registration number to payload for approval
  setRejectionReason(obj: any, code: any) {
    for (const key in obj) {
      if (key === 'rejectionReason') {
        obj[key] = code;
        return;
      }
      if (typeof obj[key] === 'object') {
        this.setRejectionReason(obj[key], code);
      }
    }
  }

  /** Method to get contributor details. */
  getIndividualContributorDetails() {
    this.contributorService.getIndividualContDetails(this.sin).subscribe(
      res => {
        this.contributor = res;
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error);
        }
      }
    );
  }

  selectedValue(val) {
    this.lookupService.getCancelRpaReasons().subscribe(cancelReasonList => {
      const selectedItem = cancelReasonList.items.find(item => item.value.english === val || item.value.arabic === val);
      if (selectedItem) {
        this.reasonCode = selectedItem.code;
      } else {
        console.error('No item found with English value:', val);
      }
    });
  }
}
