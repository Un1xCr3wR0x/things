import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  BilingualText,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  TransactionInterface,
  TransactionMixin,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, noop, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  getDocumentContentIds,
  isDocumentsValid,
  isEstablishmentTokenValid,
  LateFeeRequest,
  NavigationIndicatorEnum
} from '../../../shared';

@Component({
  selector: 'est-modify-late-fee-sc',
  templateUrl: './modify-late-fee-sc.component.html',
  styleUrls: ['./modify-late-fee-sc.component.scss']
})
export class ModifyLateFeeScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit {
  isValidator: boolean;
  uuid: string;
  changeLateFeeForm: FormGroup;
  referenceNo: number;
  documents$: Observable<DocumentItem[]> = of([]);
  documents: DocumentItem[];
  yesOrNoList: LovList;

  documentTransactionId = DocumentTransactionIdEnum.MODIFY_LATE_FEE;
  documentTransactionType = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
  documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_LATE_FEE;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly router: Router,
    readonly uuidService: UuidGeneratorService,
    readonly lookupService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: ApplicationTypeEnum,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    private fb: FormBuilder
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.lookupService.getYesOrNoList().subscribe(res => (this.yesOrNoList = res));
  }

  ngOnInit(): void {
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_LATE_FEE)) {
      this.isValidator = true;
      this.referenceNo = this.estRouterData.referenceNo;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialise, () => {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LATE_FEE]);
      });
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      this.intialise();
    } else {
      this.location.back();
    }
  }

  @Autobind
  intialise() {
    if (!this.isValidator) {
      this.uuid = this.uuidService.getUuid();
    }
    this.changeLateFeeForm = this.createLateFeeForm();
    this.bindToForm(this.changeLateFeeForm, this.establishmentToChange?.establishmentAccount?.lateFeeIndicator);
    this.documents$ = this.getDocs();
  }

  getDocs() {
    return this.documentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.establishmentToChange?.registrationNo,
        this.referenceNo,
        null,
        this.referenceNo ? null : this.uuid
      )
      .pipe(
        tap(res => (this.documents = res)),
        catchError(() => [])
      );
  }

  refreshDoc(document: DocumentItem) {
    this.refreshDocumentContent(
      document,
      this.establishmentToChange?.registrationNo,
      this.documentTransactionType,
      this.referenceNo,
      this.referenceNo ? undefined : this.uuid
    );
  }

  createLateFeeForm() {
    return this.fb.group({
      lateFeeIndicator: this.fb.group({
        english: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      }),
      comments: [null]
    });
  }

  bindToForm(form: FormGroup, lateFeeIndicator: BilingualText) {
    form
      .get('lateFeeIndicator')
      .setValue({ english: lateFeeIndicator?.english || null, arabic: lateFeeIndicator?.arabic || null });
    form.updateValueAndValidity();
  }

  submitTransaction() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.changeLateFeeForm);
    if (!this.changeLateFeeForm?.valid) {
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    if (!isDocumentsValid(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return;
    }
    this.changeEstablishmentService
      .changeLateFeeIndicator(this.assembleRequest(), this.establishmentToChange.registrationNo)
      .pipe(
        switchMap(res => {
          return iif(
            () => this.isValidator === true,
            this.updateBpm(this.estRouterData, this.changeLateFeeForm.get('comments').value, res?.successMessage).pipe(
              tap(() => {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
              })
            ),
            of(res?.successMessage).pipe(
              tap(message => {
                this.setTransactionComplete();
                this.alertService.showSuccess(message);
                this.location.back();
              })
            )
          );
        }),
        catchError(err => of(null).pipe(tap(() => this.alertService.showError(err?.error?.message))))
      )
      .subscribe();
  }

  assembleRequest(): LateFeeRequest {
    const lateFeeRequest = new LateFeeRequest();
    lateFeeRequest.lateFeeIndicator = this.changeLateFeeForm.get('lateFeeIndicator').get('english').value === 'Yes';
    lateFeeRequest.contentIds = getDocumentContentIds(this.documents);
    lateFeeRequest.navigationIndicator = this.getNavInd();
    lateFeeRequest.comments = this.changeLateFeeForm.get('comments').value;
    lateFeeRequest.uuid = this.uuid;
    if (this.isValidator) {
      lateFeeRequest.referenceNo = this.referenceNo;
    }
    return lateFeeRequest;
  }

  getNavInd() {
    if (this.isValidator) {
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        return NavigationIndicatorEnum.CSR_CHANGE_LATE_FEE_DETAILS_SUBMIT;
      }
      return NavigationIndicatorEnum.VALIDATOR_CHANGE_LATE_FEE_DETAILS_SUBMIT;
    } else {
      return NavigationIndicatorEnum.CSR_CHANGE_LATE_FEE_DETAILS_SUBMIT;
    }
  }

  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelLateFee();
  }

  cancelLateFee() {
    if (this.isValidator) {
      this.changeEstablishmentService
        .revertTransaction(this.establishmentToChange?.registrationNo, this.estRouterData?.referenceNo)
        .pipe(
          tap(() => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
              } else {
                this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LATE_FEE]);
              }
            }
          })
        )
        .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
    }
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
