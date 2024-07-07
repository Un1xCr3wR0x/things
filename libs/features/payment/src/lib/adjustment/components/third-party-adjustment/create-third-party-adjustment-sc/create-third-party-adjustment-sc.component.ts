/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  DocumentService,
  LookupService,
  scrollToTop,
  RouterDataToken,
  RouterData,
  CoreAdjustmentService,
  CoreBenefitService
} from '@gosi-ui/core';
import {
  AdjustmentConstants,
  AdjustmentService,
  PaymentRoutesEnum,
  ThirdpartyAdjustmentService,
  getTpaAdjustmentWizard,
  PaymentService,
  CreateTpaRequest,
  AdjustmentMapModel,
  AddData
} from '@gosi-ui/features/payment/lib/shared';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { switchMap } from 'rxjs/operators';
import { ThirdPartyAdjustmentBaseScComponent } from '../../../base';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pmt-create-third-party-adjustment-sc',
  templateUrl: './create-third-party-adjustment-sc.component.html',
  styleUrls: ['./create-third-party-adjustment-sc.component.scss']
})
export class CreateThirdPartyAdjustmentScComponent
  extends ThirdPartyAdjustmentBaseScComponent
  implements OnInit, AfterViewInit
{
  netMonthlyDeductionAmount = 0;
  status: string;
  showBenefitDetails: boolean;
  firstPage = 1;
  transactionId = AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_ID;
  transactionName = AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME;
  transactionType = AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE;

  adjustmentMap: Map<number, AdjustmentMapModel> = new Map([
    [
      0,
      {
        adjustment: null,
        form: new FormGroup({}),
        isAdd: true,
        addData: new AddData(),
        modifyData: null,
        isSaved: true
      }
    ]
  ]);

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

  // Method to initialise the component
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isCreate = true;
    this.initView();
    this.thirdPartyWizardItem = getTpaAdjustmentWizard(this.currentTab);
    const addData = this.adjustmentMap.get(0)?.addData;
    addData.payeeListPageDetails.currentPage = this.firstPage;
    //this.uuid = this.uuidGeneratorService.getUuid();
  }

  ngAfterViewInit() {
    if (this.isValidator) {
      this.loadEditView();
    }
  }
  /**
   * Methos to load the validator edit data
   */
  loadEditView() {
    this.tpaService
      .getThirdPartyAdjustmentValidatorDetails(this.identifier, this.adjustmentModificationId, true, this.sin)
      .pipe(
        switchMap(adjustmentDetails => {
          const addData = this.adjustmentMap.get(0)?.addData;
          addData.csrAdjustmentValues = adjustmentDetails.adjustments[0];
          this.netMonthlyDeductionAmount =
            Math.abs(addData?.csrAdjustmentValues?.benefitAmount) -
            Math.abs(addData?.csrAdjustmentValues?.monthlyDeductionAmount);
          if (addData.csrAdjustmentValues?.payeeId)
            return this.tpaService.getValidatorPayeeDetails(addData.csrAdjustmentValues.payeeId);
          else throwError(new Error('Payee id not found'));
        })
      )
      .subscribe(
        payeeDetails => {
          this.onSelectPayee(payeeDetails, true);
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
   * methos to handle the save ne
   */
  saveTpadjustment(isFinalSubmit: boolean) {
    if (this.validateForm(this.adjustmentMap.get(0)?.form)) {
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
    const mapData = this.adjustmentMap.get(0);
    const tpaRequest = this.createAddTpaRequest(
      mapData.form,
      this.adjustmentModificationId,
      mapData.addData.selectedpayee,
      mapData.addData.payeeCurrentBank,
      this.isValidator,
      mapData.addData.csrAdjustmentValues,
      mapData.addData.csrSelectedpayee
    );
    const adjustmentRequest = new CreateTpaRequest();
    adjustmentRequest.adjustmentModificationList = [tpaRequest];
    adjustmentRequest.referenceNo = this.referenceNumber || null;

    this.getSaveMethod(
      this.identifier,
      adjustmentRequest,
      this.adjustmentModificationId,
      this.isValidator,
      false
    ).subscribe(
      response => {
        if (!this.isValidator) {
          this.referenceNumber = response.referenceNo;
          this.adjustmentModificationId = response.adjustmentModificationId
            ? response.adjustmentModificationId
            : this.adjustmentModificationId;
        }
        this.changeWizard(1);
        this.getTpaRequiredDocument(this.transactionName, this.transactionType);
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
          this.adjustmentMap.get(0)?.form?.get('documentsForm').get('comments').value,
          this.sin
        )
        .subscribe(
          res => {
            this.alertService.clearAlerts();
            this.alertService.showSuccess(res['message']);
            if (this.isValidator) {
              this.saveWorkFlowInEdit(this.adjustmentMap.get(0)?.form?.get('documentsForm').get('comments').value);
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

  /** Method to get required document list. */
  getTpaRequiredDocument(transactionName: string, transactionType: string) {
    this.documentService.getRequiredDocuments(transactionName, transactionType).subscribe(doc => {
      this.documents = doc;
      this.documents.forEach(docItem => {
        this.refreshTpaDocuments(docItem, transactionName, transactionType, true);
      });
    });
  }
  findNetMonthlyDeduction(selectedBenefit) {
    this.netMonthlyDeductionAmount =
      Math.abs(selectedBenefit.benefitAmount) - Math.abs(selectedBenefit.benefitAmountAfterDeduction);
  }
}
