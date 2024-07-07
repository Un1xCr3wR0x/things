import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  StorageService,
  WorkflowService,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  TerminateEstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-re-open-establishment-sc',
  templateUrl: './validate-re-open-establishment-sc.component.html',
  styleUrls: ['./validate-re-open-establishment-sc.component.scss']
})
export class ValidateReOpenEstablishmentScComponent extends ValidatorScBaseComponent implements OnInit {
  reopenDetailsValidatorForm: FormGroup;
  /**
   * Local Variables
   */
  canReject = true;
  // @Input() showComments: boolean;
  // @Input() canEdit = true;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService,
    readonly alertService: AlertService,
    readonly terminateService: TerminateEstablishmentService,
    readonly storageService: StorageService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      lookupService,
      changeEstablishmentService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
    this.documentTransactionKey = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
  }

  ngOnInit() {
    scrollToTop();
    if (this.estRouterData.referenceNo) {
      this.initialiseViewWithReopenDetails(this.estRouterData.referenceNo);
    } else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing the establishment details and comments
   * @param referenceNumber
   */
  initialiseViewWithReopenDetails(referenceNumber: number) {
    this.getComments(this.estRouterData);
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.reopenDetailsValidatorForm = this.createForm();
    this.reopenDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);

    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }

  /**
   * // method to get the establishment details to validate
   * @param referenceNumber
   */
  getValidatingEstablishmentDetails(registrationNo: number, referenceNumber: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(registrationNo, referenceNumber)
      .pipe(
        tap(res => (this.establishmentToValidate = res)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.establishmentToValidate.registrationNo,
            referenceNumber
          );
          this.getEstablishmentDetails(this.establishmentToValidate.registrationNo);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }

  /**
   * Method to navigate to edit re-opening details
   */
  navigateToEditReopeningDetails() {
    this.router.navigate([EstablishmentRoutesEnum.EDIT_REOPENING_DETAILS]);
  }
}
