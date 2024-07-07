import { Component, OnInit, Inject } from '@angular/core';
import {
  DocumentItem,
  DocumentService,
  RouterDataToken,
  RouterData,
  Role,
  LanguageToken,
  AlertService,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreActiveBenefits,
  CoreContributorService,
  Transaction,
  TransactionService,
  TransactionStatus
} from '@gosi-ui/core';
import {
  AdjustmentDetails,
  AdjustmentPaymentDetails,
  AdjustmentService,
  PaymentService,
  PaymentRoutesEnum,
  PersonalInformation,
  AdjustmentConstants
} from '../../../shared';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'pmt-maintain-adjustment',
  templateUrl: './maintain-adjustment-sc.component.html',
  styleUrls: ['./maintain-adjustment-sc.component.scss']
})
export class MaintainAdjustmentComponent implements OnInit {
  /**Local Variables */
  activeAdjustments: AdjustmentDetails;
  adjustmentPaymentDetails: AdjustmentPaymentDetails;
  personId: number;
  nin: number;
  adjModificationId: number;
  documents: DocumentItem[];
  checkForm: FormGroup;
  socialInsuranceNo: number;
  channel;
  taskId: string;
  adjustmentId: string;
  adjustmentType: string;
  disableApprove = false;
  isAdustValidPaymenterror = true;
  isAddModify = false;
  lang = 'en';
  personDetails: PersonalInformation;
  form: FormGroup;
  RoleConst = Role;
  referenceNo: number;
  transaction: Transaction;
  validatorCanEdit = false;
  isRejectedTransaction = false;
  constructor(
    readonly alertService: AlertService,
    readonly paymentService: PaymentService,
    readonly adjustmentService: AdjustmentService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly coreBenefitService: CoreBenefitService,
    readonly fb: FormBuilder,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly contributorService: CoreContributorService,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.alertService.clearAllSuccessAlerts();
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.isRejectedTransaction = this.transaction.stepStatus?.english.toUpperCase() === TransactionStatus.REJECTED;
      this.initialiseView(this.transaction);
    }
    this.checkForm = this.createCheckForm();
    this.getContributor();
    this.getAdjustmentValidator();
    this.adjustmentId = 'MAINTAIN_ADJUSTMENT';
    this.adjustmentType = 'MAINTAIN_ADJUSTMENT_REQUEST';
    this.getRequiredDocuments();
    this.getadjustmentValidatorPayment();
  }
  initialiseView(transaction: Transaction) {
    this.personId = parseInt(transaction?.params?.IDENTIFIER, 10);
    this.adjModificationId = parseInt(transaction?.params?.ADJUSTMENT_MODIFICATION_ID, 10);
    this.referenceNo = transaction?.transactionRefNo;
    this.socialInsuranceNo = transaction?.params?.SIN || transaction?.params?.NIN;
    this.channel = transaction?.channel?.english;
    this.taskId = transaction?.taskId;
    this.nin = transaction?.params?.NIN;
  }
  getContributor() {
    this.adjustmentService.getPerson(this.personId).subscribe(res => {
      this.personDetails = res;
    });
  }
  getAdjustmentValidator() {
    const referenceNo = this.isRejectedTransaction ? this.referenceNo : null;
    this.adjustmentService
      .adjustmentValidator(this.personId, this.adjModificationId, this.socialInsuranceNo, referenceNo)
      .subscribe(data => {
        this.activeAdjustments = data;
        if (this.isRejectedTransaction) return;
        this.activeAdjustments = {
          adjustments: this.activeAdjustments.adjustments.map(adjustment => {
            if (adjustment?.actionType?.english === 'Modify' && adjustment?.modificationDetails?.afterModification) {
              return {
                ...adjustment,
                notes: adjustment?.modificationDetails?.notes
              };
            } else if (adjustment?.actionType?.english === 'Cancel' && adjustment.cancellationDetails) {
              return { ...adjustment, ...adjustment?.cancellationDetails };
            } else {
              return adjustment;
            }
          }),
          person: this.activeAdjustments.person
        };
      });
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }]
    });
  }
  getadjustmentValidatorPayment() {
    this.adjustmentService
      .adjustmentValidatorPayment(this.personId, this.adjModificationId, this.socialInsuranceNo)
      .subscribe(
        pay => {
          this.adjustmentPaymentDetails = pay;
          this.checkForm.get('checkBoxFlag').setValue(this.adjustmentPaymentDetails?.directPaymentStatus);
        },
        err => {
          if (err.status === 400) {
            this.isAdustValidPaymenterror = false;
          }
        }
      );
  }
  getRequiredDocuments() {
    this.documentService
      .getRequiredDocuments(this.adjustmentId, this.adjustmentType)
      .pipe(
        switchMap(docs => {
          return this.documentService.getDocuments(
            this.adjustmentId,
            this.adjustmentType,
            null,
            this.referenceNo,
            null,
            null,
            null,
            docs
          );
        })
      )
      .subscribe(res => {
        this.documents = res;
      });
  }
  navigateToEdit() {
    this.coreAdjustmentService.identifier = this.personId;
    this.adjustmentService.adjModificationId = this.adjModificationId;
    this.adjustmentService.referenceNumber = this.referenceNo;
    if (this.isAddModify) {
      this.router.navigate(['home/adjustment/add-modify'], { queryParams: { from: 'validator' } });
    } else {
      this.router.navigate(['home/adjustment/create'], { queryParams: { from: 'validator' } });
    }
  }
  navigateToBenefitDetails(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.benefitType = adjustment?.benefitType?.english;
    this.coreAdjustmentService.benefitDetails = adjustment;
    this.contributorService.personId = this.personId;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(adjustment?.sin, adjustment?.benefitRequestId, adjustment?.benefitType, this.referenceNo)
    );
    this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
  }
  naviagteToAdjustmentView(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: { adjustmentId: adjustment?.adjustmentId }
    });
  }
  /** Method to navigate to Contributor */
  viewContributorInfo() {
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    this.contributorService.personId = +this.transaction?.params?.IDENTIFIER;
    const identifier = this.activeAdjustments?.adjustments[0]?.sin
      ? this.activeAdjustments?.adjustments[0]?.sin
      : this.nin;
    // this.router.navigate([`home/profile/contributor/${this.personId}/info`]);
    this.router.navigate([AdjustmentConstants.ROUTE_BENEFIT_LIST(identifier)], {
      state: { loadPageWithLabel: 'BENEFITS' }
    });
  }
}
