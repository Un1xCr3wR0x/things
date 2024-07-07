import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  WizardItem,
  DocumentItem,
  DocumentService,
  AlertService,
  scrollToTop,
  RouterData,
  RouterDataToken,
  RouterConstants,
  CoreAdjustmentService,
  greaterThanValidator,
  CoreBenefitService,
  ApplicationTypeToken,
  CoreContributorService
} from '@gosi-ui/core';
import {
  AdjustmentConstants,
  AdjustmentLookupService,
  AdjustmentService,
  AdjustmentDetails,
  BenefitDetails,
  SaveAdjustmentResponse,
  PaymentService,
  BenefitItems
} from '../../../shared';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, Lov, BilingualText } from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdjustmentBaseScComponent } from '../../base';
import { Location, formatNumber } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pmt-adjustment-create-sc',
  templateUrl: './adjustment-create-sc.component.html',
  styleUrls: ['./adjustment-create-sc.component.scss']
})
export class AdjustmentCreateScComponent extends AdjustmentBaseScComponent implements OnInit {
  @ViewChild('adjustmentWizard', { static: false })
  adjustmentWizard: ProgressWizardDcComponent;

  adjustmentWizards: WizardItem[] = [];
  currentTab = 0;
  identifier;
  activeAdjustments: AdjustmentDetails;
  beneficiaries: BenefitDetails[];
  adjustmentSubmitResponse: SaveAdjustmentResponse;
  isEditMode = true;
  transactionId = 201508;
  documents: DocumentItem[];
  isAddAdjustment = true;
  adjustmentAddForm: FormGroup;
  benefitTypeList: LovList = new LovList([]);
  benefitItems: BenefitItems;
  type;
  modalRef: BsModalRef;
  selectedType: Lov;

  constructor(
    readonly activatedRoute: ActivatedRoute,
    readonly adjustmentLookUpService: AdjustmentLookupService,
    readonly adjustmentService: AdjustmentService,
    readonly alertService: AlertService,
    private fb: FormBuilder,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly paymentService: PaymentService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly contributorService: CoreContributorService
  ) {
    super(
      adjustmentLookUpService,
      adjustmentService,
      alertService,
      documentService,
      router,
      paymentService,
      routerData,
      appToken,
      coreBenefitService,
      contributorService
    );
  }

  ngOnInit(): void {
    this.initializeWizard();
    this.parentForm = new FormGroup({});
    this.identifier = this.coreAdjustmentService.identifier;
    this.type = this.coreAdjustmentService.benefitType;
    this.sin = this.coreAdjustmentService?.sin;
    this.adjustmentAddForm = this.createAdjustmentAddForm();
    this.getBeneficiaryList();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['from'] === 'validator') {
        this.initialiseView(this.routerData);
        this.isValidator = true;
        this.adjustmentModificationId = this.adjustmentService.adjModificationId;
        this.referenceNumber = this.adjustmentService.referenceNumber;
        this.getAdjustmentValidator();
      } else {
        this.getActiveAdjustments();
      }
    });
    this.getAdjustmentReasonList();
  }
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(AdjustmentConstants.ADJUSTMENT_DETAILS, 'file-invoice-dollar')); //TODO: change icon
    wizardItems.push(new WizardItem(AdjustmentConstants.DOCUMENTS, 'file-alt'));
    this.adjustmentWizards = wizardItems;
    this.adjustmentWizards[this.currentTab].isActive = true;
    this.adjustmentWizards[this.currentTab].isDisabled = false;
  }
  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  createAdjustmentAddForm() {
    return this.fb.group({
      actionType: this.fb.group({
        english: ['Add'],
        arabic: ['Add']
      }),
      benefitType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentAmount: [null, { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }],
      notes: [null, { validators: Validators.required }]
    });
  }
  patchAdjustmentAddForm(adjustment) {
    this.adjustmentAddForm.patchValue({
      actionType: adjustment['actionType'],
      benefitType: adjustment?.benefitType,
      adjustmentReason: adjustment?.adjustmentReason,
      adjustmentType: adjustment?.adjustmentType,
      adjustmentAmount: adjustment?.adjustmentAmount,
      notes: adjustment?.notes
    });
    if (adjustment?.adjustmentType?.english === 'Debit') {
      this.adjustmentAddForm.addControl(
        'adjustmentPercentage',
        this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
      );
      this.adjustmentAddForm.get('adjustmentPercentage').setValue({
        english: adjustment?.adjustmentPercentage?.toString(),
        arabic: adjustment?.adjustmentPercentage?.toString()
      });
    } else if (adjustment?.adjustmentType?.english === 'Credit' && this.adjustmentAddForm.get('adjustmentPercentage')) {
      this.adjustmentAddForm.removeControl('adjustmentPercentage');
    }
    this.type = adjustment?.benefitType?.english;
    if (this.beneficiaries) {
      const benefitIndex = this.beneficiaries.map(res => res.benefitType.english).indexOf(this.type);
      this.getBenefits({ sequence: benefitIndex });
    }
  }
  getBenefits(item) {
    if (item && item.sequence >= 0) {
      this.benefitItems = {
        benefitAmount: {
          english: formatNumber(this.beneficiaries[item.sequence]?.benefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(this.beneficiaries[item.sequence]?.benefitAmount, 'en-US', '1.0-2')}`
        },
        beneficiaryId: this.beneficiaries[item.sequence]?.beneficiaryId,
        benefitRequestStatus: this.beneficiaries[item.sequence]?.benefitRequestStatus,
        benefitStatus: this.beneficiaries[item.sequence]?.benefitStatus,
        benefitStartDate: this.beneficiaries[item.sequence]?.startDate?.gregorian,
        benefitEndDate: this.beneficiaries[item.sequence]?.stopDate?.gregorian,
        benefitRequestDate: this.beneficiaries[item.sequence]?.benefitRequestDate?.gregorian,
        initialBenefitAmount: {
          english:
            formatNumber(this.beneficiaries[item.sequence]?.initialBenefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(this.beneficiaries[item.sequence]?.initialBenefitAmount, 'en-US', '1.0-2')}`
        },
        subsequentBenefitAmount: {
          english:
            formatNumber(this.beneficiaries[item.sequence]?.subsequentBenefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(
            this.beneficiaries[item.sequence]?.subsequentBenefitAmount,
            'en-US',
            '1.0-2'
          )}`
        },
        isBenefitTypeSaned: item?.value?.english
          ? item?.value?.english?.toLowerCase().includes(AdjustmentConstants.SANED) ||
            item?.value?.english?.includes(AdjustmentConstants.UI)
          : false
      };
    }
  }
  getActiveAdjustments() {
    this.adjustmentService.getAdjustmentsByStatus(this.identifier, 'Active', this.sin).subscribe(res => {
      this.activeAdjustments = res;
    });
  }
  getAdjustmentValidator() {
    this.adjustmentService
      .adjustmentValidator(this.identifier, this.adjustmentModificationId, this.sin)
      .subscribe(data => {
        this.activeAdjustments = data;
        this.patchAdjustmentAddForm(this.activeAdjustments.adjustments[0]);
      });
  }
  getBeneficiaryList() {
    this.adjustmentService.getBeneficiaryList(this.identifier, this.sin).subscribe(res => {
      this.beneficiaries = res.beneficiaryBenefitList;
      if (this.beneficiaries) {
        this.beneficiaries.map((data, index) => {
          this.benefitTypeList.items.push({ ...new Lov(), value: data.benefitType, sequence: index });
          if (this.type && data.benefitType.english === this.type) {
            this.selectedType = { ...new Lov(), value: data.benefitType, sequence: index };
          }
        });
      }
    });
  }
  addAdjustment(flag) {
    this.isAddAdjustment = flag;
  }
  saveAdjustment() {
    let adjustmentRequest = {
      adjustmentModificationList: [this.adjustmentAddForm.getRawValue()]
    };
    if (adjustmentRequest?.adjustmentModificationList[0]?.adjustmentPercentage) {
      adjustmentRequest = {
        adjustmentModificationList: [
          {
            ...adjustmentRequest.adjustmentModificationList[0],
            adjustmentPercentage: parseInt(
              adjustmentRequest?.adjustmentModificationList[0]?.adjustmentPercentage?.english,
              10
            ),
            beneficiaryId: this.benefitItems?.beneficiaryId
          }
        ]
      };
    }
    if (this.adjustmentSubmitResponse || this.adjustmentModificationId) {
      this.adjustmentService
        .modifyAdjustments(
          this.identifier,
          adjustmentRequest,
          this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
          this.sin
        )
        .subscribe(
          res => {
            if (res) {
              this.getRequiredDocument('MAINTAIN_ADJUSTMENT', 'MAINTAIN_ADJUSTMENT_REQUEST', true, true);
              this.setNextTab();
            }
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.adjustmentService.saveAdjustments(this.identifier, adjustmentRequest, this.sin).subscribe(
        res => {
          if (res) {
            this.adjustmentSubmitResponse = res;
            this.getRequiredDocument('MAINTAIN_ADJUSTMENT', 'MAINTAIN_ADJUSTMENT_REQUEST', true, true);
            this.setNextTab();
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }
  setNextTab() {
    scrollToTop();
    this.currentTab = 1;
    this.adjustmentWizard.setNextItem(this.currentTab);
  }
  cancelAdjustment() {
    this.adjustmentService
      .cancelAdjustment(
        this.identifier,
        this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
        this.adjustmentSubmitResponse?.referenceNo || this.referenceNumber,
        this.sin
      )
      .subscribe(() => {
        this.cancelConfirmed();
      });
  }
  cancelConfirmed() {
    if (this.isValidator) {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
      this.modalRef.hide();
    } else {
      this.location.back();
    }
  }
  navigateToAdjustment() {
    this.location.back();
  }
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  onSubmitDocuments() {
    this.submitAdjustments();
  }
  submitAdjustments() {
    this.submitAdjustmentDetails(
      this.identifier,
      this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
      this.adjustmentSubmitResponse?.referenceNo || this.referenceNumber,
      this.parentForm.get('documentsForm').get('comments').value
    );
  }
  navigateToPreviousTab() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 0;
    this.adjustmentWizard.setPreviousItem(this.currentTab);
  }
}
