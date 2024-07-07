import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterDataToken,
  RouterData,
  RouterConstants,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError, Observable } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ValidatorMemberBaseScComponent } from '../../../../shared/components';
import { DocumentTransactionId } from '../../../../shared/enums';
import { DocumentTransactionType } from '../../../../shared/enums';
import { MemberDetails } from '../../../../shared/models';
import { DoctorService, MemberService, MedicalBoardService } from '../../../../shared/services';
import { MbRouteConstants } from '../../../../shared';

@Component({
  selector: 'mb-validate-modify-contract-sc',
  templateUrl: './validate-modify-contract-sc.component.html',
  styleUrls: ['./validate-modify-contract-sc.component.scss']
})
export class ValidateModifyContractScComponent extends ValidatorMemberBaseScComponent implements OnInit {
  /**Local variables */
  contractId: number;
  professionalId: number;
  memberDetails: MemberDetails;
  transactionNo: number;

  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly doctorService: DoctorService,
    readonly modalService: BsModalService,
    readonly medicalBoardService: MedicalBoardService,
    readonly memberService: MemberService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    private fb: FormBuilder,
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
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    super.getLookupValues();
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
    this.getDataForView();
    this.transactionNo = this.referenceNo;
  }

  /** Method to retrieve data for view. */
  getDataForView(): void {
    this.getMemberDetails()
      .pipe(
        switchMap(() => {
          return super.getTransactionDocuments(
            DocumentTransactionId.MTN_MB_DOCTOR,
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

  /** Method to handle workflow action events. */
  TrackWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to fetch member details. */
  getMemberDetails(): Observable<MemberDetails> {
    return this.memberService
      .getMemberDetails(this.professionalId, this.contractId)
      .pipe(tap(res => (this.memberDetails = res)));
  }

  /**Method to return to inbox */
  confirmCancelModal() {
    this.modalRef.hide();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }
  profileNavigate(identity) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identity)]);
  }
}
