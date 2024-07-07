import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  Contributor,
  DocumentItem,
  DocumentService,
  IdentityTypeEnum,
  LanguageToken,
  LookupService,
  LovList,
  Person,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  checkNull,
  getPersonArabicName,
  getPersonEnglishName
} from '@gosi-ui/core';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { BillingRoutingService } from '@gosi-ui/features/collection/billing/lib/shared/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChangePersonService, DocumentTransactionTypeEnum, ManagePersonService } from '../../../shared';
import { ModifyRequestList } from '../../../shared/models/modify-nationality-details-info';
import { PersonalInformation } from '../../../shared/models/benefits';
import moment from 'moment-timezone';

@Component({
  selector: 'cim-modify-person-details-sc',
  templateUrl: './modify-person-details-sc.component.html',
  styleUrls: ['./modify-person-details-sc.component.scss']
})
export class ModifyPersonDetailsScComponent implements OnInit {
  personNumber: any;
  referenceNo: any;
  person: PersonalInformation;
  profileDetails: Person;
  modalRef: BsModalRef;
  personForm: FormGroup;
  documents: DocumentItem[] = [];
  rejectReasonList$: Observable<LovList>;
  transactionID: number;
  resourceId: string;
  personDetailsList: ModifyRequestList[] = [];
  comments: TransactionReferenceData[] = [];
  isPassport = true;
  contributor: Contributor;
  lang: any;
  name;
  nameEnglish;
  isChangePassport: boolean=false;
  returnReasonList$: Observable<LovList>;
  canReturn = true;
  passportNumber: any;
  passportExpiryDetails: any;
  passportIssueDetails: any;
  dobInfo: any;
  passport: any;
  isReturnToAdmin = false;
  transactionNumber = null;
  estRegistrationNo: number;
  socialInsuranceNo: number;
  personDetails: any;
  ageHij: string;
  ageGreg: string;
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  transactionType: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public changePersonService: ChangePersonService,
    readonly validatorService: ManagePersonService,
    readonly modalService: BsModalService,
    readonly router: Router,
    private fb: FormBuilder,
    @Inject(RouterDataToken) readonly validatorDataToken: RouterData,
    public documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    let req: any = this.routerDataToken.content;
    this.personForm = this.createForm();
    this.getComments(this.routerDataToken);
    this.transactionID = this.routerDataToken.transactionId;
    this.resourceId = this.routerDataToken.payload?.resourceId;
    this.transactionNumber = this.routerDataToken.payload?.referenceNo;
    this.referenceNo = req.Request.Body.referenceNo;

    this.personNumber = req.Request.Body.resourceId;
    this.changePersonService.getPersonDetails(this.personNumber).subscribe((res: any) => {
      this.person = res;
      this.name = getPersonArabicName(this.person?.name?.arabic);
      this.nameEnglish = getPersonEnglishName(this.person?.name?.english);
      this.language.subscribe(language => {
      this.lang = language;
      if (this.person?.birthDate) {
        if (this.lang == 'en') {
          this.ageHij = "(Age:" + this.person.ageInHijiri + ")";
          const ageValue = moment(new Date()).diff(moment(this.person.birthDate.gregorian), 'year');
          this.ageGreg = "(Age:" + ageValue + ")";
  
        } else {
          this.ageHij = "(العمر:" + this.person.ageInHijiri + ")";
          const ageValue = moment(new Date()).diff(moment(this.person.birthDate.gregorian), 'year');
          this.ageGreg = "(العمر:" + ageValue + ")";
        }
      }
      else {
        this.ageHij = null
        this.ageGreg = null
      }
    });
    });
      
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_2) {
      this.isReturnToAdmin = false;
    } else {
      this.isReturnToAdmin = true;
    }
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.getModifiedDetails();
  }

  getModifiedDetails() {
    this.changePersonService
      .getNewChangeRequestDetails(this.personNumber,this.referenceNo)
      .pipe(
        tap(res => {
          this.personDetailsList = res;
          this.setData(this.personDetailsList);
          res?.changeRequestList?.find(transaction => transaction.parameter ===  'Passport Number') ? this.transactionType.push(DocumentTransactionTypeEnum.MODIFY_PASSPORT_DETAILS_NON_SAUDI) : null;
          res?.changeRequestList?.find(transaction => transaction.parameter ===  'Date Of Birth') ? this.transactionType.push(DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS_DATE_OF_BIRTH_NON_SAUDI) : null;
         
        }),
        switchMap(() => {
          return this.getDocuments(
            DocumentTransactionTypeEnum.MODIFY_PERSONAL_DETAILS,
            this.transactionType,
            null,
            this.routerDataToken.transactionId
          );
        }),
      )
      .subscribe(noop, noop);
  }
  setData(res: any) {
    this.passportIssueDetails = res?.changeRequestList?.find(data => data.parameter == 'Passport Issue Date');
    this.passportExpiryDetails = res?.changeRequestList?.find(data => data.parameter == 'Passport Expiry Date');
    this.dobInfo = res?.changeRequestList?.find(data => data.parameter == 'Date Of Birth');
    this.passport = res?.changeRequestList?.find(data => data.parameter == 'Passport Number');
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
  getComments(routerDataToken: RouterData) {
    this.getAllComments(routerDataToken).subscribe(
      res => (this.comments = res),
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }
  getAllComments(routerDataToken: RouterData): Observable<TransactionReferenceData[]> {
    return of(routerDataToken.comments);
  }
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.personForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.personForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.personForm.updateValueAndValidity();
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
    if (this.personForm.get('rejectionReason'))
      data.rejectionReason = this.personForm.get('rejectionReason').value;
    if (this.personForm.get('returnReason')) data.returnReason = this.personForm.get('returnReason').value;
    if (this.personForm.get('comments')) data.comments = this.personForm.get('comments').value;
    data.outcome = action;
    data.user = this.routerDataToken.assigneeId;
    data.taskId = this.routerDataToken.taskId;
    data.isExternalComment=true;
    return data; 
  }
  saveWorkflow(updateData: BPMUpdateRequest, outcome) {
    const bpmUpdateDataRequest = new BPMUpdateRequest();
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateDataRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.commentScope = 'BPM';
    bpmUpdateDataRequest.payload = this.routerDataToken.content;
    bpmUpdateDataRequest.isExternalComment = updateData.isExternalComment;
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
    if(updateData.returnReason){
      bpmUpdateDataRequest.returnReason=updateData.returnReason;
    }
    if (updateData.comments) bpmUpdateDataRequest.comments = updateData.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateDataRequest, outcome).subscribe(
      () => {
        const successMessage = this.getSuccessMessage(updateData.outcome);
        this.alertService.showSuccessByKey(successMessage, null, 5);
        this.billingRoutingService.navigateToInbox();
      },
      
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
    this.modalRef.hide();
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
  checkNull(value) {
    return checkNull(value);
  }
}
