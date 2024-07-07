import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePersonService, ManagePersonService, Person, PersonDetails, ProfileWrapper } from '../../../shared';
import { TemplateRef } from '@angular/core/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService, BPMMergeUpdateParamEnum, BPMUpdateRequest, DocumentItem, DocumentService, LookupService, LovList, RouterConstants, RouterData, RouterDataToken, WorkFlowActions, WorkflowService } from '@gosi-ui/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NationalityConstants } from '../../../shared/constants/nationality-constants';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, noop, of } from 'rxjs';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { ChangeRequestList } from '../../../shared/models/modify-nationality-details-info';
import { BillingRoutingService } from '@gosi-ui/features/collection/billing/lib/shared/services';

@Component({
  selector: 'cim-validate-modify-nationality-sc',
  templateUrl: './validate-modify-nationality.component.html',
  styleUrls: ['./validate-modify-nationality.component.scss']
})
export class ValidateModifyNationalityComponentsc implements OnInit {
  personNumber: any;
  profileDetails: Person;
  modalRef: BsModalRef;
  nationalityForm: FormGroup;
  documents: DocumentItem[] = [];
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  transactionID: number;
  resourceId: string;
  personNationalityDetails: ChangeRequestList
  iqamaNumber: any;
  isEnableEdit: boolean;
  customActions: WorkFlowActions[] = [];
  isReturn: boolean = false;
  referenceNo: number;
  isInprogressTransaction: Object;
  personNo: number;
  sin: number;
  constructor(private activatedRoute: ActivatedRoute,
    public changePersonService: ChangePersonService,
    readonly modalService: BsModalService,
    readonly validatorService: ManagePersonService,
    readonly router: Router,
    private fb: FormBuilder,
    public documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) { }

  ngOnInit(): void {

    let req: any = this.routerDataToken.content;
    this.nationalityForm = this.createForm()
    this.transactionID = this.routerDataToken.transactionId
    this.resourceId = this.routerDataToken.payload?.resourceId


    this.personNumber = req.Request.Body.resourceId
    this.changePersonService.getPersonDetails(this.personNumber).subscribe((res: any) => {
      this.profileDetails = res
          });
    
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.getChangeNationalityDetails(req.Request.Body.resourceId);
    this.iqamaNumber = req.Request.Body.iqamaNo;
    this.sin = req.Request.Body.sin
    const validatorActions = this.routerDataToken.customActions;
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.UPDATE) {
        this.isEnableEdit = true;
      }
      if(action === WorkFlowActions.RETURN)
      this.isReturn = true;
    })
    this.validatorService.getInprogressNinTransactions(this.personNumber, this.transactionID).subscribe(res => {
      this.isInprogressTransaction = res;
      const value = {
        english: 'Unable to create request, An active request is already available.',
        arabic: 'عذرا لا يمكن تنفيذ طلبك لوجود طلب آخر في مسار العمل'
      };
      if(this.isInprogressTransaction === true){
        this.alertService.showError(value);
      }
    })
    
  }
  getChangeNationalityDetails(personId) {
    this.changePersonService.getChangeRequestDetails(personId).pipe(
      tap(res => {
        this.personNationalityDetails = res
        this.getScannedDocument(this.transactionID);
      }),
    ).subscribe(noop, noop);
  }

  getScannedDocument(referenceNo) {
    this.documentService.getAllDocuments(null, referenceNo)?.subscribe(
      res => {
        this.documents = res;
      },
      err => {
        //this.showErrorMessage(err);
      }
    );
  }
  getDocuments(
    transactionId: string,
    transactionType: string | string[],
    identifier: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(transactionId, transactionType, identifier, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.nationalityForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.nationalityForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.nationalityForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  confirmApproveTransaction() {
    const workflowData = this.setWorkFlowDetails(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData, outcome);
    this.decline();
  }
  confirmRejectTransaction() {
    const workflowData = this.setWorkFlowDetails(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    // console.log(workflowData)
    this.saveWorkflow(workflowData, outcome);
    this.hideModal();

  }
  confirmReturn() {
    const workflowData = this.setWorkFlowDetails(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData, outcome);
    this.hideModal();
  }
  setWorkFlowDetails(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.nationalityForm.get('rejectionReason'))
      data.rejectionReason = this.nationalityForm.get('rejectionReason').value;
    if (this.nationalityForm.get('comments')) data.comments = this.nationalityForm.get('comments').value;
    data.outcome = action;
    data.user = this.routerDataToken.assigneeId;
    data.taskId = this.routerDataToken.taskId;
    return data;

  }
  saveWorkflow(updateData: BPMUpdateRequest, outcome) {
    const bpmUpdateDataRequest = new BPMUpdateRequest();
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateDataRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateDataRequest.outcome = outcome;
    //  bpmUpdateDataRequest.isExternalComment = this.isGOL && this.validatorRole === ValidatorRoles.VALIDATOR_ONE;
    bpmUpdateDataRequest.commentScope = 'BPM';
    bpmUpdateDataRequest.payload = this.routerDataToken.content;
    if (updateData.rejectionReason) {
      bpmUpdateDataRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ARB,
        updateData.rejectionReason.arabic
      );
      bpmUpdateDataRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
        updateData.rejectionReason.english
      );
    }
    if (updateData.comments) bpmUpdateDataRequest.comments = updateData.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateDataRequest, outcome).subscribe(
      () => {
        const successMessage = this.getSuccessMessage(updateData.outcome);
        this.alertService.showSuccessByKey(successMessage, null, 5);
        this.billingRoutingService.navigateToInbox();
      },
      err => {
        // this.alertService.showError(err.error.message);
      }
    );

  }
  getSuccessMessage(actions: string) {
    let message: string;
    switch (actions) {
      case TransactionOutcome.REJECT:
        message = BillingConstants.TRANSACTION_REJECTED;
        break;
      case TransactionOutcome.APPROVE:
        message = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.RETURN:
       message = BillingConstants.TRANSACTION_RETURNED;
       break;

    }
    return message;
  }

  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  hideModal() {
    this.modalRef.hide()
  }

  decline(): void {
    this.modalRef.hide();
  }

  createForm() {
    return this.fb.group({
      transactionNo: [null],
      user: [null],
      type: [null],
      taskId: [null]
    });
  }
  navigateToModifypage(){
  const nin: any =  this.profileDetails?.identity.find(id => id.idType === 'NIN');
  this.personNo = nin ? nin : this.sin;
  if(this.iqamaNumber !=='NULL'){
  this.router.navigate([`home/profile/modify-nationality/${this.iqamaNumber}/${this.personNumber }`]);
  }
  else{
    this.router.navigate([`home/profile/modify-nationality/${this.personNo}/${this.personNumber}`]);
  }
  }
}
