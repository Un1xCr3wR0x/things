import { Component, OnInit, Inject } from '@angular/core';
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
import { DocumentTransactionId } from '../../../../shared/enums';
import { DocumentTransactionType } from '../../../../shared/enums';
import { MemberDetails } from '../../../../shared/models';
import { ValidatorMemberBaseScComponent } from '../../../../shared/components';
import { DoctorService, MemberService, MedicalBoardService } from '../../../../shared/services';

@Component({
  selector: 'mb-validate-add-member-sc',
  templateUrl: './validate-add-member-sc.component.html',
  styleUrls: ['./validate-add-member-sc.component.scss']
})
export class ValidateAddMemberScComponent extends ValidatorMemberBaseScComponent implements OnInit {
  /**Local variables */
  contractId: number;
  professionalId: number;
  memberDetails: MemberDetails;
  transactionNumber: number;

  /** Method to initialize AddMemberScComponent*/
  constructor(
    readonly alertService: AlertService,
    readonly doctorService: DoctorService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly medicalBoardService: MedicalBoardService,
    readonly memberService: MemberService,
    readonly lookupService: LookupService,
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
    this.initializeParameters();
    super.getLookupValues();
    this.transactionNumber = this.referenceNo;
  }

  /**
   * Metod to initialize data
   */
  initializeParameters() {
    super.getDataFromToken(this.routerDataToken);
    super.getRolesForView(this.routerDataToken);
    //Set validator types
    this.initializeDataForView();
  }

  /** Method to retrieve data for view. */
  initializeDataForView(): void {
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
          this.alertService.showErrorByKey(err.error.message.english);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to fetch member details. */
  getMemberDetails(): Observable<MemberDetails> {
    return this.memberService
      .getMemberDetails(this.professionalId, this.contractId)
      .pipe(tap(res => (this.memberDetails = res)));
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  /** Method to handle workflow events. */
  ManageWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
}
