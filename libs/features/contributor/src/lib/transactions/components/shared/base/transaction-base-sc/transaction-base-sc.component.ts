import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  Channel,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterConstants,
  RouterData,
  Transaction,
  TransactionService,
  WorkFlowActions,
  getPersonNameAsBilingual
} from '@gosi-ui/core';
import { ValidatorRoles } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import {
  Contributor,
  ContributorBPMRequest,
  ContributorService,
  EngagementService,
  Establishment,
  EstablishmentService,
  SystemParameter
} from '@gosi-ui/features/contributor';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/lib/shared/models';
import moment from 'moment-timezone';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Directive()
export class TransactionBaseScComponent extends BaseComponent {
  transaction: Transaction;
  registrationNo: number;
  refNo: number;
  transactionId: number;
  header: BilingualText;
  referenceNo: number;
  resourceType: string;
  socialInsuranceNo: number;
  engagementId: number;
  establishment: Establishment;
  contributor: Contributor;
  documents: DocumentItem[];
  isBeneficiary: boolean;
  channel: BilingualText;
  Channel: string;
  age: number;
  modalRef: BsModalRef;
  validatorForm: FormGroup = new FormGroup({});
  systemParams: SystemParameter;
  isBillBatch = false;
  contractId: number;
  RequestId: number;
  NIN: number;
  nin: number;
  iqama: number;
  personIdentifier: number;
  searchRequest: SearchRequest = new SearchRequest();
  isIndividualApp = false;
  tRequestId: number;
  isPPA = false;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router
  ) {
    super();
  }

  getTransactionDetails() {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNo = this.transaction?.params?.REGISTRATION_NO;
      this.transactionId = this.transaction?.transactionId;
      this.header = this.transaction?.title;
      this.channel = this.transaction?.channel;
      this.referenceNo = this.transaction?.transactionRefNo;
      this.socialInsuranceNo = !this.isIndividualApp ? this.transaction?.params?.SIN : this.transaction?.params?.NIN;
      this.contractId = this.transaction?.params?.CONTRACT_ID;
      this.nin = this.transaction?.params?.NIN;
      this.iqama = this.transaction?.params?.IQAMA;
      this.RequestId = this.transaction?.params?.VIOLATION_REQUEST_ID;
      this.NIN = this.transaction?.params?.NIN;
      this.tRequestId = this.transaction?.params?.TRANSFER_REQUEST_ID;
      if (this.transaction?.params?.ENGAGEMENT_ID) this.engagementId = this.transaction?.params?.ENGAGEMENT_ID;
      // this.resourceType = 'OH Rejection Injury TPA';
    }
  }
  /** Method to get basic details. */
  getBasicDetails(options?: Map<string, boolean>) {
    return this.establishmentService.getEstablishmentDetails(this.registrationNo).pipe(
      tap(res => ((this.establishment = res), (this.isPPA = res?.ppaEstablishment))),
      switchMap(() => {
        return this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo, options).pipe(
          tap(res => {
            this.contributor = res;
            this.isBeneficiary = this.contributor.isBeneficiary;
            this.age = moment(new Date()).diff(moment(this.contributor.person.birthDate.gregorian), 'year');
          })
        );
      })
    );
  }

  /** Method to get documents for the transaction. */
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

  getAllDocuments(referenceNo: number): Observable<DocumentItem[]> {
    return this.documentService.getAllDocuments(null, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /** Method to navigate to inbox on error during view initialization. */
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.navigateToTransactions();
  }

  /** Method to navigate to inbox. */
  navigateToTransactions(): void {
    this.router.navigate([RouterConstants.ROUTE_MY_TRANSACTIONS]);
  }

  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }

  /** Method to navigate to inbox. */
  navigateToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to get workflow action. */
  getWorkflowAction(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
      case 2:
        action = WorkFlowActions.RETURN;
        break;
    }
    return action;
  }

  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const data = new ContributorBPMRequest();
    if (this.validatorForm.get('rejectionReason'))
      data.rejectionReason = this.validatorForm.get('rejectionReason').value;
    if (this.validatorForm.get('comments')) data.comments = this.validatorForm.get('comments').value;
    if (this.validatorForm.get('returnReason')) data.returnReason = this.validatorForm.get('returnReason').value;
    if (this.validatorForm.get('penalty')) {
      if (this.validatorForm.get('penalty.english').value === 'No') data.penaltyIndicator = 0;
      else data.penaltyIndicator = 1;
    }
    data.taskId = routerData.taskId;
    data.user = routerData.assigneeId;
    data.outcome = action;
    data.isExternalComment =
      this.Channel === Channel.GOSI_ONLINE && routerData.assignedRole === ValidatorRoles.VALIDATOR;
    return data;
  }

  /** Method to get success message. */
  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-RETURN-MESSAGE';
        break;
    }
    return messageKey;
  }

  /** Method to get person name. */
  getPersonName() {
    const personName = getPersonNameAsBilingual(this.contributor.person.name);
    if (!personName.english) personName.english = personName.arabic;
    return personName;
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
      if (this.systemParams.BILL_BATCH_INDICATOR === 1) {
        this.alertService.setInfoByKey('CONTRIBUTOR.SERVICE-MAINTANACE');
        this.isBillBatch = true;
      }
    });
  }
}
