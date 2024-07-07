/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  bindToObject,
  DocumentItem,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  AddData,
  Adjustment,
  AdjustmentConstants,
  AdjustmentMapModel,
  AdjustmentPaymentMethodEnum,
  AdjustmentStatus,
  CreateTpaRequest,
  getTpaAdjustmentWizard,
  ModifyData,
  PayeeDetails,
  PaymentRoutesEnum,
  PaymentService,
  ThirdpartyAdjustmentService
} from '@gosi-ui/features/payment/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ThirdPartyAdjustmentBaseScComponent } from '../../../base';
import {
  bindAddFormValuesToAdjustmentModel,
  bindManageFormValuesToAdjustmentModel,
  checkForModification,
  createModifyTpaRequest,
  getTpaRequiredDocument
} from './manage-third-party-adjustment-helper';

@Component({
  selector: 'pmt-manage-third-party-adjustment-sc',
  templateUrl: './manage-third-party-adjustment-sc.component.html',
  styleUrls: ['./manage-third-party-adjustment-sc.component.scss']
})
export class ManageThirdPartyAdjustmentScComponent extends ThirdPartyAdjustmentBaseScComponent implements OnInit {
  benefitAmount = 0;
  status: string;
  isModifyStopHoldFlag: boolean;
  reactivatingHeading: boolean;
  disableSaveAndNext: boolean;
  firstPage = 1;
  tpaAdjustmentDetails: Adjustment[];
  adjustmentMap: Map<number, AdjustmentMapModel> = new Map();
  showAddTpaBtn = true;
  transactionId = AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_ID;
  transactionName = AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME;
  transactionType = AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE;
  actionTYpeModify = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY.english;
  actionTypeHold = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD.english;
  actionTypeStop = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP.english;
  actionTypeReactivate = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english;
  activeStatus = AdjustmentStatus.ACTIVE;
  onHoldStatus = AdjustmentStatus.ON_HOLD;
  newStatus = AdjustmentStatus.NEW;
  netMonthlyDeductionAmount = 0;
  commentForm: FormGroup = new FormGroup({});
  cancelMapIndex: number;
  allDocuments: DocumentItem[] = [];
  addDocuments: DocumentItem[] = [];
  modifyDocuments: DocumentItem[] = [];
  reactivateDocumnets: DocumentItem[] = [];
  holdDocuments: DocumentItem[] = [];
  stopDocuments: DocumentItem[] = [];
  netTpaMonthlyDeductionAmount = 0;
  savedMonthlyDeductionAmount = 0;
  tempMonthlyDeductionAmount = 0;
  tempAddMonthlyDeductionAmount = 0;

  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly paymentService: PaymentService
  ) {
    super(
      alertService,
      documentService,
      router,
      paymentService,
      lookupService,
      tpaService,
      modalService,
      routerDataToken,
      adjustmentService,
      coreBenefitService
    );
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isCreate = false;
    this.initView(true);
    if (this.isValidator) this.showAddTpaBtn = false;
    this.thirdPartyWizardItem = getTpaAdjustmentWizard(this.currentTab);
    this.getTpaAdjustments();
  }

  /**
   * method to get the adjustment values
   */
  getTpaAdjustments() {
    this.tpaService.getTpaAdjustmentsDetails(this.identifier, null, this.sin).subscribe(
      data => {
        this.tpaAdjustmentDetails = data.adjustments;
        this.netTpaMonthlyDeductionAmount = data.netMonthlyDeductionAmount;
        this.netMonthlyDeductionAmount = Math.abs(this.netTpaMonthlyDeductionAmount);
        this.tpaAdjustmentDetails.forEach(adjustment => {
          if (
            adjustment.adjustmentStatus.english === AdjustmentStatus.ACTIVE ||
            adjustment.adjustmentStatus.english === AdjustmentStatus.NEW ||
            adjustment.adjustmentStatus.english === AdjustmentStatus.ON_HOLD
          ) {
            const index = this.adjustmentMap?.size || 0;
            const modifyData = new ModifyData();
            modifyData.enableReactivate = adjustment.adjustmentStatus.english === AdjustmentStatus.ON_HOLD;
            modifyData.adjustment = adjustment;
            if (modifyData.adjustment.adjustmentStatus.english === AdjustmentStatus.ON_HOLD) {
              modifyData.adjustment.statusChange = true;
            } else {
              modifyData.adjustment.statusChange = false;
            }
            this.adjustmentMap.set(index, {
              isAdd: false,
              form: new FormGroup({}),
              modifyData: modifyData,
              addData: null,
              isSaved: true,
              hasModified: false
            });
          }
        });
        this.disableSaveAndNext = true;
        if (this.isValidator) {
          this.disableSaveAndNext = false;
          this.loadEditView();
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   * Methos to load the validator edit data
   */
  loadEditView() {
    this.tpaService
      .getThirdPartyAdjustmentValidatorDetails(this.identifier, this.adjustmentModificationId, true, this.sin)
      .pipe(
        switchMap(adjustmentDetails => {
          const modifiedAdjustments = adjustmentDetails?.adjustments;
          this.netTpaMonthlyDeductionAmount = adjustmentDetails.newMonthlyDeductionAmount;
          this.netMonthlyDeductionAmount = Math.abs(this.netTpaMonthlyDeductionAmount);
          this.adjustmentMap?.forEach((value, key) => {
            const mapValue = this.adjustmentMap?.get(key);
            const modifiedAdjustment = modifiedAdjustments.find(
              modifiedAdjustmentValue =>
                modifiedAdjustmentValue?.adjustmentId === value?.modifyData?.adjustment?.adjustmentId
            );
            if (modifiedAdjustment) {
              mapValue.modifyData.csrAdjustmentValues = bindToObject(value?.modifyData?.adjustment, modifiedAdjustment);
              mapValue.savedAdjustmentData = bindToObject(value?.modifyData?.adjustment, modifiedAdjustment);
              mapValue.hasModified = true;
              mapValue.isAdd = false;
              if (
                modifiedAdjustment?.adjustmentStatus?.english === AdjustmentStatus.ON_HOLD &&
                modifiedAdjustment?.actionType?.english === this.actionTypeStop
              )
                mapValue.modifyData.adjustment.isStop = true;
              mapValue.modifyData.adjustment.statusChange = modifiedAdjustment.statusChange;
            }
          });
          const newlyAddedAdjustemnts = modifiedAdjustments?.filter(
            modifiedAdjustment =>
              modifiedAdjustment?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD?.english
          );
          const payeeDetailsApi: Observable<PayeeDetails>[] = [];
          if (newlyAddedAdjustemnts?.length > 0) {
            newlyAddedAdjustemnts.forEach(newAdjustment => {
              this.showAddTpaBtn = false;
              const index = Math.max(...this.adjustmentMap.keys()) + 1;
              const addData = new AddData();
              addData.csrAdjustmentValues = newAdjustment;
              this.adjustmentMap.set(index, {
                isAdd: true,
                form: new FormGroup({}),
                modifyData: null,
                addData: addData,
                savedAdjustmentData: { ...newAdjustment },
                isSaved: true,
                hasModified: true
              });
              if (addData.csrAdjustmentValues?.payeeId)
                payeeDetailsApi.push(this.tpaService.getValidatorPayeeDetails(addData.csrAdjustmentValues.payeeId));
              else throwError(new Error('Payee id not found'));
              this.getOldAddValue(newAdjustment);
            });
          }
          if (payeeDetailsApi.length > 0) return forkJoin(payeeDetailsApi);
          else return of([]);
        })
      )
      .subscribe(
        payeeDetails => {
          if (payeeDetails) {
            this.adjustmentMap?.forEach((value, key) => {
              if (value?.isAdd) {
                this.onSelectPayee(
                  payeeDetails.find(payee => payee.payeeId === value?.addData?.csrAdjustmentValues?.payeeId),
                  true,
                  key
                );
              }
            });
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
  }

  /*
   * This method is to select wizard
   */
  selectWizard(tabIndex: number) {
    if (this.currentTab === 0) {
      this.saveTpadjustment(false);
    } else {
      this.changeWizard(tabIndex);
    }
  }

  /**
   * methos to handle the save next
   */
  saveTpadjustment(isFinalSubmit: boolean) {
    if (this.checkActiveStatus()) {
      this.alertService.showErrorByKey('ADJUSTMENT.ERR_ACTIVE_STATUS');
    } else {
      if (isFinalSubmit) {
        this.submitAdjustmentDetails();
      } else {
        this.saveTransaction();
      }
    }
  }

  /**
   * method to save the transaction
   */
  saveTransaction() {
    const adjustmentRequest = new CreateTpaRequest();
    this.adjustmentMap.forEach((mapValue, mapKey) => {
      if (mapValue.isAdd) {
        const tpaRequest = this.createAddTpaRequest(
          mapValue?.form,
          this.adjustmentModificationId,
          mapValue.addData?.selectedpayee,
          mapValue.addData?.payeeCurrentBank,
          this.isValidator,
          mapValue.addData?.csrAdjustmentValues,
          mapValue.addData?.csrSelectedpayee,
          mapKey
        );
        adjustmentRequest.adjustmentModificationList.push(tpaRequest);
      } else if (mapValue.hasModified) {
        const tpaRequest = createModifyTpaRequest(
          mapValue?.form,
          mapValue.modifyData?.adjustment,
          mapValue.modifyData?.csrAdjustmentValues
        );
        tpaRequest.statusChange = mapValue.modifyData.adjustment.statusChange;
        adjustmentRequest.adjustmentModificationList.push(tpaRequest);
      }
    });

    adjustmentRequest.referenceNo = this.referenceNumber || null;
    adjustmentRequest.newMonthlyDeductionAmount = Number(Number(this.netMonthlyDeductionAmount).toFixed(2));
    this.getSaveMethod(
      this.identifier,
      adjustmentRequest,
      this.adjustmentModificationId,
      this.isValidator,
      true
    ).subscribe(
      response => {
        if (!this.isValidator) {
          this.referenceNumber = response.referenceNo;
          this.adjustmentModificationId = response.adjustmentModificationId
            ? response.adjustmentModificationId
            : this.adjustmentModificationId;
        }
        this.changeWizard(1);
        getTpaRequiredDocument(
          this.transactionName,
          this.transactionType,
          adjustmentRequest.adjustmentModificationList,
          this.adjustmentModificationId,
          this
        );
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  submitAdjustmentDetails() {
    if (this.documentService.checkMandatoryDocuments(this.documents)) {
      this.tpaService
        .submitAdjustmentDetails(
          this.identifier,
          this.adjustmentModificationId,
          this.referenceNumber,
          this.commentForm.get('documentsForm').get('comments').value,
          this.sin
        )
        .subscribe(
          res => {
            this.alertService.clearAlerts();
            this.alertService.showSuccess(res['message']);
            if (this.isValidator) {
              this.saveWorkFlowInEdit(this.commentForm.get('documentsForm').get('comments').value);
            } else {
              this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_DETAIL]);
            }
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      scrollToTop();
      this.alertService.showMandatoryDocumentsError();
    }
  }

  addThirdParty() {
    if (this.checkActiveStatus()) {
      this.alertService.showErrorByKey('ADJUSTMENT.ERR_ACTIVE_STATUS');
    } else {
      this.showAddTpaBtn = false;
      const index = Math.max(...this.adjustmentMap.keys()) + 1;
      this.adjustmentMap.set(index, {
        isAdd: true,
        form: new FormGroup({}),
        modifyData: null,
        addData: new AddData(),
        isSaved: false,
        hasModified: false
      });
    }
  }

  // Method to display modify/hold/stop fields
  onModify(mapIndex: number, isNewAdjustment = false) {
    if (this.checkActiveStatus()) {
      this.alertService.showErrorByKey('ADJUSTMENT.ERR_ACTIVE_STATUS');
    } else {
      const selectedMapData = this.adjustmentMap.get(mapIndex);
      selectedMapData.form = new FormGroup({});
      if (isNewAdjustment && (selectedMapData?.savedAdjustmentData || selectedMapData?.addData?.csrAdjustmentValues)) {
        selectedMapData.addData.payeeCurrentBank = null; //To remove the already selected data
        selectedMapData.addData.payeebankName = null; //To remove the already selected data
        this.fetchPayeedetails(
          selectedMapData?.hasSavedData
            ? selectedMapData?.savedAdjustmentData?.payeeId
            : selectedMapData?.addData?.csrAdjustmentValues?.payeeId,
          mapIndex,
          selectedMapData?.hasSavedData
        );
        this.revertNewMonthlyDeduction(selectedMapData);
      } else {
        this.revertMonthlyDeductionAmount(selectedMapData);
      }
      selectedMapData.isSaved = false;
    }
  }
  onStop(adjustment) {
    adjustment.value.modifyData.adjustment.isStop = true;
    this.onModify(adjustment.key);
  }
  fetchPayeedetails(payeeId: number, mapIndex: number, isFromSavedData: boolean) {
    this.tpaService.getValidatorPayeeDetails(payeeId).subscribe(
      payeeDetails => {
        this.onSelectPayee(payeeDetails, !isFromSavedData, mapIndex, isFromSavedData);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  /**
   * method to check whether any adjustment in edit mode
   */
  checkActiveStatus(): boolean {
    let hasActive = false;
    this.adjustmentMap.forEach(mapValue => {
      if (mapValue.isSaved === false) {
        hasActive = true;
      }
    });
    return hasActive;
  }

  /**
   * method to check whether any adjustment has been mnodified
   */
  checkModidfyStatus() {
    let hasModified = false;
    this.adjustmentMap.forEach(mapValue => {
      if (mapValue.hasModified === true) {
        hasModified = true;
      }
    });
    this.disableSaveAndNext = !hasModified;
  }

  setCancelMapIndex(mapIndex: number) {
    this.cancelMapIndex = mapIndex;
  }

  cancelModifyTpa(mapIndex: number) {
    const selectedMapData = this.adjustmentMap.get(mapIndex);
    if (selectedMapData?.savedAdjustmentData?.actionType)
      selectedMapData.form
        ?.get('maintainTpaForm')
        ?.get('manageType')
        ?.setValue(selectedMapData?.savedAdjustmentData?.actionType);
    selectedMapData.form
      ?.get('maintainTpaForm')
      ?.get('newMonthlyDeductionAmount')
      ?.setValue(selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount);
    selectedMapData.form
      ?.get('maintainTpaForm')
      ?.get('newDebitPercentage')
      ?.get('english')
      ?.setValue(selectedMapData?.savedAdjustmentData?.adjustmentPercentage);
    selectedMapData.form
      ?.get('maintainTpaForm')
      ?.get('newDebitPercentage')
      ?.get('arabic')
      ?.setValue(selectedMapData?.savedAdjustmentData?.adjustmentPercentage);
    selectedMapData.form?.get('maintainTpaForm')?.get('notes')?.setValue(selectedMapData?.savedAdjustmentData?.notes);
    selectedMapData.isSaved = true;
    this.checkModidfyStatus();
  }

  cancelAddTpa() {
    const selectedMapData = this.adjustmentMap.get(this.cancelMapIndex);
    if (this.cancelMapIndex && this.adjustmentMap.get(this.cancelMapIndex).hasModified === false) {
      this.adjustmentMap.delete(this.cancelMapIndex);
    } else if (this.cancelMapIndex) {
      selectedMapData.isSaved = true;
    }
    this.checkModidfyStatus();
    this.showAddTpaBtn = selectedMapData?.savedAdjustmentData ? false : true;
    this.modalRef?.hide();
  }

  onAddModifySave(mapIndex: number, isAdd: boolean) {
    const selectedMapData = this.adjustmentMap.get(mapIndex);
    this.alertService.clearAlerts();
    if (this.validateForm(selectedMapData?.form, false, mapIndex)) {
      const formValues = selectedMapData?.form.getRawValue();
      if (
        !isAdd &&
        !selectedMapData.modifyData.adjustment.statusChange &&
        formValues?.maintainTpaForm?.manageType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english &&
        ((selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount &&
          +selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount ===
            +formValues?.maintainTpaForm?.newMonthlyDeductionAmount) ||
          (!selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount &&
            +selectedMapData?.modifyData?.adjustment?.adjustmentPercentage ===
              +formValues?.maintainTpaForm?.newDebitPercentage?.english))
      ) {
        this.alertService.showErrorByKey('ADJUSTMENT.ERR_SAME_DEDUCTION');
      } else if (
        selectedMapData?.form?.value?.maintainTpaForm?.manageType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english &&
        selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount &&
        selectedMapData?.modifyData?.adjustment?.benefitAmount - this.netMonthlyDeductionAmount <
          selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount
      ) {
        this.alertService.showErrorByKey('ADJUSTMENT.ERR_REJECTION');
      } else if (
        selectedMapData?.form?.value?.maintainTpaForm?.manageType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english &&
        selectedMapData?.modifyData?.adjustment?.adjustmentPercentage &&
        selectedMapData?.modifyData?.adjustment?.benefitAmount &&
        selectedMapData?.modifyData?.adjustment?.benefitAmount - this.netMonthlyDeductionAmount <
          this.getPercentageAmount(
            selectedMapData?.modifyData?.adjustment?.adjustmentPercentage,
            selectedMapData?.modifyData?.adjustment?.benefitAmount
          )
      ) {
        this.alertService.showErrorByKey('ADJUSTMENT.ERR_REJECTION');
      } else {
        if (isAdd) {
          selectedMapData.hasModified = true;
          selectedMapData.hasSavedData = true;

          selectedMapData.addData.savedBankData =
            formValues?.paymentMethod?.transferMode?.english === AdjustmentPaymentMethodEnum.BANK
              ? selectedMapData?.addData?.payeeCurrentBank
                ? { ...selectedMapData?.addData?.payeeCurrentBank }
                : {
                    bankName: formValues?.paymentMethod?.bankName,
                    ibanAccountNo: formValues?.paymentMethod?.ibanAccountNo
                  }
              : null;
          selectedMapData.savedAdjustmentData = bindAddFormValuesToAdjustmentModel(
            selectedMapData?.form,
            selectedMapData?.addData?.selectedpayee
          );
          this.findNetAmount(selectedMapData);
        } else {
          selectedMapData.hasSavedData = true;
          selectedMapData.savedAdjustmentData = bindManageFormValuesToAdjustmentModel(
            selectedMapData?.form,
            selectedMapData?.modifyData?.adjustment
          );
          if (selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount) {
            selectedMapData.modifyData.adjustment.monthlyDeductionAmount =
              selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount;
          }
          if (selectedMapData?.savedAdjustmentData?.adjustmentPercentage) {
            selectedMapData.modifyData.adjustment.adjustmentPercentage =
              selectedMapData?.savedAdjustmentData?.adjustmentPercentage;
          }
          selectedMapData.hasModified = checkForModification(
            selectedMapData?.modifyData?.adjustment,
            selectedMapData.savedAdjustmentData
          );
          this.findSumAtIndex(mapIndex);
        }
        selectedMapData.isSaved = true;
        this.checkModidfyStatus();
      }
    }
  }
  findSumAtIndex(mapIndex: number) {
    this.adjustmentMap.forEach((adjustment, key) => {
      if (
        key === mapIndex &&
        adjustment?.savedAdjustmentData?.actionType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY.english
      ) {
        if (parseFloat(adjustment?.savedAdjustmentData?.monthlyDeductionAmount?.toString())) {
          this.netMonthlyDeductionAmount += parseFloat(
            adjustment.savedAdjustmentData.monthlyDeductionAmount.toString()
          );
        } else if (
          adjustment?.modifyData?.adjustment?.adjustmentPercentage &&
          adjustment?.modifyData?.adjustment?.benefitAmount
        ) {
          this.netMonthlyDeductionAmount += this.getPercentageAmount(
            adjustment?.modifyData?.adjustment?.adjustmentPercentage,
            adjustment?.modifyData?.adjustment?.benefitAmount
          );
        }
        if (adjustment.modifyData.adjustment.statusChange) {
          adjustment.modifyData.adjustment.statusChange = false;
        } else {
          if (this.netMonthlyDeductionAmount >= this.tempMonthlyDeductionAmount) {
            this.netMonthlyDeductionAmount -= this.tempMonthlyDeductionAmount;
          }
        }
      } else if (
        key === mapIndex &&
        (adjustment?.savedAdjustmentData?.actionType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD.english ||
          adjustment?.savedAdjustmentData?.actionType?.english ===
            AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP.english)
      ) {
        if (!adjustment.modifyData.adjustment.statusChange) {
          if (
            adjustment.modifyData.adjustment.monthlyDeductionAmount &&
            this.netMonthlyDeductionAmount >= adjustment.modifyData.adjustment.monthlyDeductionAmount
          ) {
            this.netMonthlyDeductionAmount -= adjustment.modifyData.adjustment.monthlyDeductionAmount;
          } else if (
            adjustment.modifyData.adjustment.benefitAmount &&
            adjustment.modifyData.adjustment.adjustmentPercentage &&
            this.netMonthlyDeductionAmount >=
              this.getPercentageAmount(
                adjustment.modifyData.adjustment.benefitAmount,
                adjustment.modifyData.adjustment.adjustmentPercentage
              )
          ) {
            this.netMonthlyDeductionAmount -= this.getPercentageAmount(
              adjustment.modifyData.adjustment.benefitAmount,
              adjustment.modifyData.adjustment.adjustmentPercentage
            );
          }
          adjustment.modifyData.adjustment.statusChange = true;
          this.tempMonthlyDeductionAmount = 0;
        }
      } else if (
        key === mapIndex &&
        adjustment?.savedAdjustmentData?.actionType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE.english
      ) {
        if (
          adjustment.modifyData.adjustment.monthlyDeductionAmount &&
          adjustment?.modifyData?.adjustment?.benefitAmount - this.netMonthlyDeductionAmount >=
            adjustment.modifyData.adjustment.monthlyDeductionAmount
        ) {
          this.netMonthlyDeductionAmount += adjustment.modifyData.adjustment.monthlyDeductionAmount;
          adjustment.modifyData.adjustment.statusChange = false;
        } else if (
          adjustment?.modifyData?.adjustment?.adjustmentPercentage &&
          adjustment?.modifyData?.adjustment?.benefitAmount &&
          adjustment?.modifyData?.adjustment?.benefitAmount - this.netMonthlyDeductionAmount >=
            this.getPercentageAmount(
              adjustment?.modifyData?.adjustment?.adjustmentPercentage,
              adjustment?.modifyData?.adjustment?.benefitAmount
            )
        ) {
          this.netMonthlyDeductionAmount += this.getPercentageAmount(
            adjustment?.modifyData?.adjustment?.adjustmentPercentage,
            adjustment?.modifyData?.adjustment?.benefitAmount
          );
          adjustment.modifyData.adjustment.statusChange = false;
        }
      }
    });
  }
  findNetAmount(selectedMapData) {
    if (
      parseFloat(selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount?.toString()) &&
      !selectedMapData?.savedAdjustmentData?.holdAdjustment
    ) {
      this.netMonthlyDeductionAmount += parseFloat(
        selectedMapData.savedAdjustmentData.monthlyDeductionAmount.toString()
      );
      this.savedMonthlyDeductionAmount = parseFloat(
        selectedMapData.savedAdjustmentData.monthlyDeductionAmount.toString()
      );
    } else if (
      parseFloat(
        selectedMapData?.form?.get('continousDeductionForm')?.get('monthlyDeductionPercentageAmount')?.value
      ) &&
      !selectedMapData?.savedAdjustmentData?.holdAdjustment
    ) {
      this.netMonthlyDeductionAmount += parseFloat(
        selectedMapData.form.get('continousDeductionForm').get('monthlyDeductionPercentageAmount').value
      );
      this.savedMonthlyDeductionAmount = parseFloat(
        selectedMapData.form.get('continousDeductionForm').get('monthlyDeductionPercentageAmount').value
      );
    }
    if (this.tempAddMonthlyDeductionAmount && this.netMonthlyDeductionAmount >= this.tempAddMonthlyDeductionAmount) {
      this.netMonthlyDeductionAmount -= this.tempAddMonthlyDeductionAmount;
    }
  }
  revertMonthlyDeductionAmount(selectedMapData) {
    if (
      selectedMapData?.modifyData?.adjustment?.monthlyDeductionAmount &&
      !selectedMapData?.modifyData?.adjustment?.statusChange
    ) {
      this.tempMonthlyDeductionAmount = selectedMapData.modifyData.adjustment.monthlyDeductionAmount;
    } else if (
      selectedMapData?.modifyData?.adjustment?.benefitAmount &&
      selectedMapData?.modifyData?.adjustment?.adjustmentPercentage &&
      !selectedMapData?.modifyData?.adjustment?.statusChange
    ) {
      this.tempMonthlyDeductionAmount = this.getPercentageAmount(
        selectedMapData.modifyData.adjustment.benefitAmount,
        selectedMapData.modifyData.adjustment.adjustmentPercentage
      );
    }
  }
  revertNewMonthlyDeduction(selectedMapData) {
    this.tempAddMonthlyDeductionAmount = 0;
    if (
      parseFloat(selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount?.toString()) &&
      !selectedMapData?.savedAdjustmentData?.holdAdjustment
    ) {
      this.tempAddMonthlyDeductionAmount = parseFloat(
        selectedMapData?.savedAdjustmentData?.monthlyDeductionAmount?.toString()
      );
    } else if (
      selectedMapData?.savedAdjustmentData?.adjustmentPercentage &&
      (selectedMapData?.savedAdjustmentData?.benefitAmount || this.benefitAmount) &&
      !selectedMapData?.savedAdjustmentData?.holdAdjustment
    ) {
      this.tempAddMonthlyDeductionAmount = this.getPercentageAmount(
        selectedMapData?.savedAdjustmentData?.benefitAmount || this.benefitAmount,
        selectedMapData?.savedAdjustmentData?.adjustmentPercentage
      );
    }
  }
  getOldAddValue(newAdjustment) {
    if (newAdjustment?.monthlyDeductionAmount && !newAdjustment?.holdAdjustment) {
      this.savedMonthlyDeductionAmount = newAdjustment.monthlyDeductionAmount;
    } else if (newAdjustment?.benefitAmount && newAdjustment?.adjustmentPercentage && !newAdjustment?.holdAdjustment) {
      this.savedMonthlyDeductionAmount = this.getPercentageAmount(
        newAdjustment.benefitAmount,
        newAdjustment.adjustmentPercentage
      );
    }
  }
  getPercentageAmount(benefitAmount, adjustmentPercentage) {
    return parseFloat(((benefitAmount * adjustmentPercentage) / 100).toFixed(2));
  }
  getSelectedBenefit(benefit) {
    this.benefitAmount = benefit?.benefitAmount;
  }
}
