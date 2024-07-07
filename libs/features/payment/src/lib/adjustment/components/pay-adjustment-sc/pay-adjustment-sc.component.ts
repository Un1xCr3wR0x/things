import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef, OnDestroy, Inject } from '@angular/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { Location } from '@angular/common';
import {
  WizardItem,
  AlertService,
  lessThanValidator,
  greaterThanValidator,
  CoreAdjustmentService,
  LanguageToken,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  AdjustmentConstants,
  AdjustmentService,
  AdjustmentRepay,
  AdjustmentRepaySetValues,
  AdjustmentDetails,
  WizardService,
  BenefitDetails,
  AdjustmentRepayValidatorSetValues,
  PaymentConstants
} from '../../../shared';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdjustmentRepaySetItems } from '../../../shared/models/adjustment-repay-setItems';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pmt-pay-adjustment-sc',
  templateUrl: './pay-adjustment-sc.component.html',
  styleUrls: ['./pay-adjustment-sc.component.scss']
})
export class PayAdjustmentScComponent implements OnInit, OnDestroy {
  @ViewChild('adjustmentWizard', { static: false })
  adjustmentWizard: ProgressWizardDcComponent;
  adjustmentWizards: WizardItem[] = [];
  currentTab = 0;
  separatorLimit = 10000000000000;
  adjustmentsDetails: AdjustmentDetails;
  totalAmountForm: FormControl = new FormControl();
  adjDtlsForm: FormGroup;
  totalAmountToBePaid: number;
  parseFloat = parseFloat;
  isNaN = isNaN;
  lang = 'en';
  identifier;
  inEditMode = false;
  isNew = false;
  referenceNo: number;
  modalRef: BsModalRef;
  repayItemValues: AdjustmentRepaySetItems;
  beneficiaryList: BenefitDetails[];
  adjustmentRepayValidatorDetails: AdjustmentRepayValidatorSetValues;
  sin: number;
  constructor(
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    private fb: FormBuilder,
    readonly location: Location,
    public route: ActivatedRoute,
    readonly router: Router,
    readonly modalService: BsModalService,
    private wizardService: WizardService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.inEditMode = params.edit === 'true';
      this.isNew = params.isNew === 'true';
    });
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initializeWizard();
    this.identifier = this.coreAdjustmentService.identifier;
    this.sin = this.coreAdjustmentService?.sin;
    this.getActiveAdjustments();
  }

  getActiveAdjustments() {
    this.adjustmentService
      .getActiveDebitAdjustments(this.identifier, 'Debit', 'Active', 'New', this.sin)
      .subscribe(res => {
        this.adjustmentsDetails = res;
        this.adjDtlsForm = this.createAmtRefundedForm();
        this.setAmountToBePaid();
        if (this.inEditMode && this.adjustmentService.getPageName() !== 'PAYMENT_DETAILS') {
          this.setValidatorAdjustmentValues();
        } else if (!this.isNew) {
          this.setValuesOnPreviousSection();
        }
      });
  }

  setValidatorAdjustmentValues() {
    this.adjustmentRepayValidatorDetails = this.adjustmentService.getAdjustmentRepaymentValidatorDetails();
    this.referenceNo = this.adjustmentRepayValidatorDetails.referenceNo;
    this.adjDtlsForm
      .get('totalAmountToBePaid')
      .patchValue(parseFloat(this.adjustmentRepayValidatorDetails.totalPaidAmount.toString()).toFixed(2));
    this.adjustmentRepayValidatorDetails.repayItems.forEach(x => {
      this.amountToBePaid.controls.forEach(control => {
        if (x.adjustmentId === control.get('adjustmentId').value) {
          control.get('adjustmentAmount').setValue(x.paidAmount.toFixed(2));
        }
      });
    });
    this.amountToBePaid.controls.forEach(control => {
      if (!control.get('adjustmentAmount').value) {
        const noValue = 0;
        control.get('adjustmentAmount').setValue(noValue.toFixed(2));
      }
    });
  }

  setValuesOnPreviousSection() {
    this.repayItemValues = this.adjustmentService.getAdjustmentRepayItems();
    if (this.repayItemValues) {
      this.adjDtlsForm
        .get('totalAmountToBePaid')
        .patchValue(parseFloat(this.repayItemValues.totalAmount.toString()).toFixed(2));
      this.repayItemValues.repayItems.forEach(x => {
        this.amountToBePaid.controls.forEach(control => {
          if (x.adjustmentId === control.get('adjustmentId').value) {
            control.get('adjustmentAmount').setValue(x.adjustmentAmount.toFixed(2));
          }
        });
      });
    }
  }

  createAmtRefundedForm(): FormGroup {
    return this.fb.group({
      totalAmountToBePaid: [
        '',
        {
          validators: [
            Validators.required,
            greaterThanValidator(0),
            lessThanValidator(this.adjustmentsDetails?.netAdjustmentAmount)
          ],
          updateOn: 'change'
        }
      ],
      amountToBePaid: this.fb.array([])
    });
  }

  get amountToBePaid(): FormArray {
    return this.adjDtlsForm?.controls['amountToBePaid'] as FormArray;
  }

  setAmountToBePaid() {
    this.adjustmentsDetails.adjustments.forEach(adjustment => {
      const amount = this.fb.group({
        adjustmentId: [adjustment.adjustmentId],
        adjustmentAmount: [
          '',
          { validators: [Validators.required, lessThanValidator(adjustment.adjustmentBalance)], updateOn: 'change' }
        ]
      });
      this.amountToBePaid.push(amount);
    });
  }

  onTotalAmountEntered() {
    this.totalAmountToBePaid = parseFloat(this.adjDtlsForm.controls['totalAmountToBePaid'].value);
    if (isNaN(this.totalAmountToBePaid)) this.totalAmountToBePaid = 0;
    this.amountToBePaid.controls.forEach((val, index) => {
      const adjustmentBalance: number = Math.abs(this.adjustmentsDetails.adjustments[index].adjustmentBalance);
      if (adjustmentBalance <= this.totalAmountToBePaid) {
        this.totalAmountToBePaid = this.totalAmountToBePaid - adjustmentBalance;
        val.get('adjustmentAmount').setValue(adjustmentBalance.toFixed(2));
      } else {
        val.get('adjustmentAmount').setValue(this.totalAmountToBePaid.toFixed(2));
        if (this.totalAmountToBePaid !== 0) this.totalAmountToBePaid = 0;
      }
    });
  }

  onAmountToBePaid() {
    this.totalAmountToBePaid = 0;
    this.amountToBePaid?.controls?.forEach(control => {
      let amount = parseFloat(control.get('adjustmentAmount').value);
      if (isNaN(amount)) {
        control.setValue(parseFloat('0').toFixed(2));
        amount = 0;
      }
      this.totalAmountToBePaid += amount;
    });
    this.adjDtlsForm.controls['totalAmountToBePaid'].setValue(this.totalAmountToBePaid.toFixed(2));
  }

  initializeWizard() {
    // const wizardItems: WizardItem[] = [];
    // wizardItems.push(new WizardItem(AdjustmentConstants.ADJUSTMENT_DETAILS, 'file-invoice-dollar')); //TODO: change icon
    // wizardItems.push(new WizardItem(AdjustmentConstants.PAYMENT_DETAILS, 'money-bill-alt'));
    // this.adjustmentWizards = wizardItems;
    // this.adjustmentWizards[this.currentTab].isActive = true;
    // this.adjustmentWizards[this.currentTab].isDisabled = false;

    this.adjustmentWizards = [];
    this.adjustmentWizards = this.wizardService.getAdjustmentWizradItems();
    this.adjustmentWizards[0].isActive = true;
    this.adjustmentWizards[0].isDisabled = false;
  }

  selectedWizard(index: number) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }

  navigateToPaymentMethod() {
    if (this.adjDtlsForm.valid) {
      this.totalAmountToBePaid = parseFloat(this.adjDtlsForm.controls['totalAmountToBePaid'].value);
      this.beneficiaryList = this.adjustmentService.getSourceId();

      const adjustmentRequest = {
        repayItems: this.adjustmentsDetails.adjustments
          .filter(adjustment => adjustment['adjustmentId'])
          .map(adjReq => {
            const transformedReq: AdjustmentRepay = {
              // adjustmentAmount: this.amountToBePaid.value[i],
              // adjustmentAmount: adjReq?.adjustmentAmount, // need to get the input values
              adjustmentId: adjReq?.adjustmentId,
              benefitType: adjReq?.benefitType
            };
            return transformedReq;
          }),
        totalAmount: this.totalAmountToBePaid,
        referenceNo: this.referenceNo,
        adjustmentRepayId: this.inEditMode
          ? this.adjustmentRepayValidatorDetails?.adjustmentRepayId
          : this.repayItemValues?.adjustmentRepayId
      };

      for (let i = 0; i < adjustmentRequest.repayItems.length; i++) {
        // merge objects into one with multiple props
        adjustmentRequest.repayItems[i] = Object.assign(adjustmentRequest.repayItems[i], {
          adjustmentAmount: parseFloat(this.amountToBePaid.controls[i].get('adjustmentAmount').value)
        });
      }
      // for (let i = 0; i < this.beneficiaryList.length; i++) {
      //   adjustmentRequest.repayItems[i].beneficiaryBenefitId = Object.assign(this.beneficiaryList[i]?.sourceId, []);
      // }
      if (this.inEditMode) {
        this.updateAdjustmentRepayDetails(adjustmentRequest);
      } else {
        this.saveAdjustmentRepayDetails(adjustmentRequest);
      }
    }
  }

  saveAdjustmentRepayDetails(adjustmentRequest) {
    this.adjustmentService.saveAndNextAdjustmentsRepay(this.identifier, adjustmentRequest, this.sin).subscribe(
      res => {
        const data = new AdjustmentRepaySetValues(
          this.identifier,
          res.adjustmentRepayId,
          res.referenceNo,
          this.totalAmountToBePaid
        );
        this.adjustmentService.setAdjustmentRepayDetails(data);
        this.adjustmentService.setAdjustmentRepayItems(adjustmentRequest);
        this.router.navigate(['/home/adjustment/adjustment-payment-method']);
      },
      err => {
        if (err.status === 500 || err.status === 422 || err.status === 400) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  updateAdjustmentRepayDetails(adjustmentRequest) {
    this.adjustmentService.saveAndUpdateAdjustmentRepay(this.identifier, adjustmentRequest, this.sin).subscribe(
      res => {
        const data = new AdjustmentRepaySetValues(
          this.identifier,
          res.adjustmentRepayId,
          res.referenceNo,
          this.totalAmountToBePaid
        );
        this.adjustmentService.setAdjustmentRepayDetails(data);
        this.adjustmentService.setAdjustmentRepayItems(adjustmentRequest);
        this.adjustmentService.adjFormModified = this.adjDtlsForm.dirty;
        this.router.navigate(['/home/adjustment/adjustment-payment-method'], {
          queryParams: {
            edit: true
          }
        });
      },
      err => {
        if (err.status === 500 || err.status === 422 || err.status === 400) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  routeBack() {
    if (!this.inEditMode) {
      this.location.back();
    } else {
      this.router.navigate([PaymentConstants.APPROVE_ADJUSTMENT_REPAYMENT]);
    }
  }

  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmCancel() {
    this.modalRef.hide();
    // this.router.navigate(['/home/adjustment/adjustment-details']);
    this.location.back();
  }

  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }
  ngOnDestroy() {
    this.adjustmentService.setPageName(undefined);
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
