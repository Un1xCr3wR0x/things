import { Component, OnInit, Inject } from '@angular/core';
import { ValidatorMemberBaseScComponent } from '../../../../shared/components';
import {
  AlertService,
  LookupService,
  DocumentService,
  WorkflowService,
  RouterDataToken,
  RouterData,
  RouterConstants
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { noop, throwError, Observable } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType, MemberDetails, MbRouteConstants, DoctorService, MemberService, MedicalBoardService } from '../../../../shared';

@Component({
  selector: 'mb-validate-terminate-contract-sc',
  templateUrl: './validate-terminate-contract-sc.component.html',
  styleUrls: ['./validate-terminate-contract-sc.component.scss']
})
export class ValidateTerminateContractScComponent extends ValidatorMemberBaseScComponent implements OnInit {
  /**Local variables */
  memberDetails: MemberDetails;
  contractId: number;
  professionalId: number;
  transactionNum: number;

  constructor(
    readonly alertService: AlertService,
    readonly doctorService: DoctorService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly medicalBoardService: MedicalBoardService,
    readonly memberService: MemberService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      doctorService,
      medicalBoardService,
      memberService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      routerDataToken
    );
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  AddMemberScComponent
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    super.getLookupValues();
    this.initializeParameters();
    this.transactionNum = this.referenceNo;
  }

  /**
   * Metod to initialize data
   */
  initializeParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
    //Set validator types
    this.initializeView();
  }

  /** Method to retrieve data for view. */
  initializeView(): void {
    this.getBoardMemberDetails()
      .pipe(
        switchMap(() => {
          return super.getTransactionDocuments(
            DocumentTransactionId.MTN_MB_DOCTOR_TERMINATE,
            DocumentTransactionType.MEDICAL_BOARD,
            this.contractId
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to fetch member details. */
  getBoardMemberDetails(): Observable<MemberDetails> {
    return this.memberService
      .getMemberDetails(this.professionalId, this.contractId)
      .pipe(tap(res => (this.memberDetails = res)));
  }

  /** Method to handle workflow events. */
  getWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /**Method to return to inbox */
  confirmCancelTemplate() {
    this.modalRef.hide();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  navigateToProfile(identity) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identity)]);
  }
}
