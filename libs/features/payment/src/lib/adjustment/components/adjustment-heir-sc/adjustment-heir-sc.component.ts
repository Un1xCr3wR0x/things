import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
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
  ApplicationTypeToken,
  CoreBenefitService,
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
  BenefitItems,
  HeirAdjustments
} from '../../../shared';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LovList, Lov, BilingualText } from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdjustmentBaseScComponent } from '../../base';
import { Location, formatNumber } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'pmt-adjustment-heir-sc',
  templateUrl: './adjustment-heir-sc.component.html',
  styleUrls: ['./adjustment-heir-sc.component.scss']
})
export class AdjustmentHeirScComponent extends AdjustmentBaseScComponent implements OnInit, OnDestroy {
  @ViewChild('adjustmentWizard', { static: false })
  adjustmentWizard: ProgressWizardDcComponent;

  adjustmentWizards: WizardItem[] = [];
  currentTab = 0;
  identifier;
  activeAdjustments: AdjustmentDetails;
  beneficiaries: BenefitDetails[];
  adjustmentSubmitResponse: SaveAdjustmentResponse;
  isEditMode = true;
  transactionId = 302046;
  documents: DocumentItem[];
  isAddAdjustment = true;
  adjustmentAddForm: FormGroup;
  benefitTypeList: LovList = new LovList([]);
  benefitItems: BenefitItems;
  type;
  modalRef: BsModalRef;
  selectedType: Lov;
  benefitRequestId: number;
  activeHeirAdjustments: HeirAdjustments;
  heirAdjustments: HeirAdjustments;
  sin: number;

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
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly coreBenefitService: CoreBenefitService,
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
    this.sin = this.coreAdjustmentService.sin;
    this.benefitRequestId = this.coreAdjustmentService.benefitRequestId;
    this.type = this.coreAdjustmentService.benefitType;
    this.adjustmentAddForm = this.createAdjustmentAddForm();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['from'] === 'validator') {
        this.initialiseView(this.routerData);
        this.isValidator = true;
        const payload = JSON.parse(this.routerData.payload);
        this.adjustmentModificationId = payload.adjustmentModificationId;
        this.referenceNumber = payload.referenceNo;
        this.sin = payload.socialInsuranceNo;
        this.benefitRequestId = payload.id;
        this.getHeirs$()
          .pipe(
            map(adjustment => {
              this.heirAdjustments = adjustment;
              adjustment.heirList.forEach(heir => {
                this.getHeirById$().subscribe(activeAdjustment => {
                  this.patchAdjustmentAddForm(activeAdjustment);
                  if (activeAdjustment?.heirList?.map(data => data.heirPersonId).indexOf(heir.heirPersonId) > -1) {
                    (this.adjustmentAddForm.controls.heirPersonIdList as FormArray).push(
                      this.fb.group({ heirPersonId: [heir?.heirPersonId], isChecked: true })
                    );
                  } else {
                    (this.adjustmentAddForm.controls.heirPersonIdList as FormArray).push(
                      this.fb.group({ heirPersonId: [heir?.heirPersonId], isChecked: false })
                    );
                  }
                });
              });
            })
          )
          .subscribe();
      } else {
        this.getHeirList();
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
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentAmount: [null, { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }],
      notes: [null, { validators: Validators.required }],
      heirPersonIdList: this.fb.array([])
    });
  }
  patchAdjustmentAddForm(adjustment) {
    this.adjustmentAddForm.patchValue({
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
  }
  addAdjustment(flag) {
    this.isAddAdjustment = flag;
  }
  saveAdjustment() {
    let adjustmentRequest = this.adjustmentAddForm.getRawValue();
    if (adjustmentRequest?.adjustmentPercentage) {
      adjustmentRequest = {
        ...adjustmentRequest,
        adjustmentAmount: parseFloat(adjustmentRequest?.adjustmentAmount),
        adjustmentPercentage: parseInt(adjustmentRequest?.adjustmentPercentage?.english, 10),
        heirPersonIdList: this.adjustmentAddForm
          .get('heirPersonIdList')
          .value.filter(result => result.isChecked)
          .map(person => person.heirPersonId)
      };
    } else {
      adjustmentRequest = {
        ...adjustmentRequest,
        adjustmentAmount: parseFloat(adjustmentRequest?.adjustmentAmount),
        heirPersonIdList: this.adjustmentAddForm
          .get('heirPersonIdList')
          .value.filter(result => result.isChecked)
          .map(person => person.heirPersonId)
      };
    }
    if (this.adjustmentSubmitResponse || this.adjustmentModificationId) {
      adjustmentRequest = {
        ...adjustmentRequest,
        adjustmentModificationId:
          this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId
      };
      this.adjustmentService
        .editHeirAdjustment(
          this.sin,
          this.benefitRequestId,
          adjustmentRequest,
          adjustmentRequest.adjustmentModificationId
        )
        .subscribe(
          res => {
            if (res) {
              this.getHeirRequiredDocument(
                AdjustmentConstants.HEIR_ADJUSTMENT_ID,
                AdjustmentConstants.HEIR_ADJUSTMENT_TYPE,
                true,
                false
              );
              this.setNextTab();
            }
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.adjustmentService.saveHeirAdjustment(this.sin, this.benefitRequestId, adjustmentRequest).subscribe(
        res => {
          if (res) {
            this.adjustmentSubmitResponse = res;
            this.getHeirRequiredDocument(
              AdjustmentConstants.HEIR_ADJUSTMENT_ID,
              AdjustmentConstants.HEIR_ADJUSTMENT_TYPE,
              true,
              false
            );
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
    // if (this.isValidator) {
    //   this.router.navigate([RouterConstants.ROUTE_INBOX]);
    if (this.modalRef) this.modalRef.hide();
    // } else {
    this.location.back();
    // }
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
    this.submitHeirAdjustmentDetails(
      this.sin,
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
  getHeirById() {
    this.getHeirById$().subscribe(adjustments => {
      this.activeHeirAdjustments = adjustments;
    });
  }
  getHeirs$() {
    return this.adjustmentService.getHeirAdjustments(this.sin, this.benefitRequestId);
  }
  getHeirById$() {
    if(this.sin && this.benefitRequestId && this.adjustmentModificationId){
      return this.adjustmentService.getHeirAdjustmentById(this.sin, this.benefitRequestId, this.adjustmentModificationId);
    }
  }
  getHeirList() {
    this.getHeirs$().subscribe(heirAdjustments => {
      this.heirAdjustments = heirAdjustments;
      this.heirAdjustments.heirList.forEach(heir => {
        (this.adjustmentAddForm.controls.heirPersonIdList as FormArray).push(
          this.fb.group({ heirPersonId: [heir?.heirPersonId], isChecked: false })
        );
      });
    });
  }
  /** Method to get required document list. */
  getHeirRequiredDocument(transactionId: string, transactionType: string, isRefreshRequired = false, isAdd = false) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(doc => {
      if (isAdd) {
        this.documents = doc.filter(res => res.name.english === 'Adjustment Document');
      } else {
        this.documents = doc;
      }
      if (isRefreshRequired)
        this.documents.forEach(docItem => {
          this.refreshHeirDocument(docItem);
        });
    });
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshHeirDocument(doc: DocumentItem, isScan = false) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
          AdjustmentConstants.HEIR_ADJUSTMENT_ID,
          AdjustmentConstants.HEIR_ADJUSTMENT_TYPE,
          this.adjustmentSubmitResponse?.referenceNo || this.referenceNumber
        )
        .subscribe(res => {
          doc = res;
          if (isScan && doc?.name?.english === 'Benefit Application Form') {
            scrollToTop();
            this.alertService.showInfo(
              {
                english: 'Notification will be sent to the beneficiary upon submitting the request',
                arabic: 'سيتم إحاطة المستفيد عند تقديم الطلب.'
              },
              null
            );
          }
        });
    }
  }
  submitHeirAdjustmentDetails(identifier, adjustmentModificationId, referenceNumber, comments) {
    if (this.documentService.checkMandatoryDocuments(this.documents)) {
      this.isDocError = false;
      this.adjustmentService
        .submitHeirAdjustmentDetails(
          identifier,
          this.benefitRequestId,
          adjustmentModificationId,
          referenceNumber,
          comments
        )
        .subscribe(
          res => {
            this.alertService.clearAlerts();
            this.isSubmit = true;
            if (this.isValidator) {
              this.saveWorkFlowInEdit();
            } else {
              this.alertService.showSuccess(res['message']);
              this.router.navigate([RouterConstants.ROUTE_INBOX]);
            }
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.isDocError = true;
      this.alertService.showMandatoryDocumentsError();
    }
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
