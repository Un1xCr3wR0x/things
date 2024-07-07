import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import {
  CoreAdjustmentService,
  WizardItem,
  DocumentService,
  AlertService,
  scrollToTop,
  RouterData,
  RouterDataToken,
  RouterConstants,
  CoreActiveBenefits,
  CoreBenefitService,
  Alert,
  BilingualText,
  ApplicationTypeToken,
  CoreContributorService
} from '@gosi-ui/core';
import {
  AdjustmentConstants,
  AdjustmentService,
  AdjustmentDetails,
  BenefitDetails,
  AdjustmentRequest,
  PaymentService,
  AdjustmentLookupService,
  PaymentRoutesEnum
} from '../../../shared';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup } from '@angular/forms';
import { AdjustmentBaseScComponent } from '../../base';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pmt-adjustment-add-modify-sc',
  templateUrl: './adjustment-add-modify-sc.component.html',
  styleUrls: ['./adjustment-add-modify-sc.component.scss']
})
export class AdjustmentAddModifyScComponent extends AdjustmentBaseScComponent implements OnInit, OnDestroy {
  @ViewChild('adjustmentWizard', { static: false })
  adjustmentWizard: ProgressWizardDcComponent;

  adjustmentWizards: WizardItem[] = [];
  adjustmentInfoMessageList: BilingualText[];
  currentTab = 0;
  identifier;
  activeAdjustments: AdjustmentDetails;
  beneficiaries: BenefitDetails[];
  gosiEligibilityInfoMsg: Alert;
  isEditMode = true;
  modalRef: BsModalRef;
  transactionId = 201508;
  type;
  constructor(
    readonly activatedRoute: ActivatedRoute,
    readonly adjustmentLookUpService: AdjustmentLookupService,
    readonly adjustmentService: AdjustmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
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
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['from'] === 'validator') {
        this.isValidator = true;
        this.initialiseView(this.routerData);
        this.adjustmentModificationId = this.adjustmentService.adjModificationId;
        this.referenceNumber = this.adjustmentService.referenceNumber;
        this.getAdjustmentValidator();
      } else {
        this.getActiveAdjustments();
      }
    });
    // Adjustment Reason is populated from below function
    this.getBeneficiaryList();
    this.adjustmentByEligible();
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
    this.currentTab = index;
  }
  getActiveAdjustments() {
    if (this.type) {
      this.adjustmentService
        .getAdjustmentByDualStatusAndType(
          this.identifier,
          { status1: AdjustmentConstants.ACTIVE, status2: AdjustmentConstants.NEW, benefitType: this.type },
          this.sin
        )
        .subscribe(res => {
          this.activeAdjustments = res;
        });
    } else {
      this.adjustmentService
        .getAdjustmentsByDualStatus(this.identifier, AdjustmentConstants.ACTIVE, AdjustmentConstants.NEW, this.sin,this.coreAdjustmentService.benefitRequestId ? this.coreAdjustmentService.benefitRequestId : null)
        .subscribe(adjustmentDetail => {
          this.activeAdjustments = adjustmentDetail;
        });
    }
  }
  getAdjustmentValidator() {
    this.adjustmentService
      .adjustmentValidator(this.identifier, this.adjustmentModificationId, this.sin)
      .subscribe(data => {
        this.activeAdjustments = data;
        this.activeAdjustments = {
          adjustments: this.activeAdjustments.adjustments.map(adjustment => {
            if (adjustment?.actionType?.english === 'Modify' && adjustment?.modificationDetails?.afterModification) {
              return {
                ...adjustment,
                ...adjustment?.modificationDetails?.afterModification,
                notes: adjustment?.modificationDetails?.notes,
                adjustmentId: adjustment?.adjustmentId || this.getAdjustmentId(adjustment)
              };
            } else if (adjustment?.actionType?.english === 'Cancel' && adjustment.cancellationDetails) {
              return {
                ...adjustment,
                ...adjustment.cancellationDetails,
                adjustmentId: adjustment?.adjustmentId || this.getAdjustmentId(adjustment)
              };
            } else {
              return { ...adjustment, adjustmentId: adjustment?.adjustmentId || this.getAdjustmentId(adjustment) };
            }
          }),
          person: this.activeAdjustments.person
        };
      });
  }
  getAdjustmentId(adjustment) {
    const index = this.activeAdjustments.adjustments.map(res => res.actionType.english).indexOf('Cancel');
    if (adjustment?.actionType?.english === 'Recovery') {
      if (index > -1) {
        return this.activeAdjustments.adjustments[index].adjustmentId;
      }
    } else {
      return 1000 + Math.round(Math.random() * 100);
    }
  }
  getBeneficiaryList() {
    this.adjustmentService.getBeneficiaryList(this.identifier, this.sin).subscribe(res => {
      this.beneficiaries = res.beneficiaryBenefitList;
      this.getAdjustmentReasonList();
    });
  }
  addAdjustments(adjustment) {
    if (adjustment?.adjustmentPercentage) {
      adjustment = { ...adjustment, adjustmentPercentage: parseInt(adjustment?.adjustmentPercentage?.english, 10) };
    }
    this.activeAdjustments.adjustments.push(adjustment);
  }
  editAdjustments(adjustment) {
    if (adjustment?.adjustmentPercentage) {
      adjustment = { ...adjustment, adjustmentPercentage: parseInt(adjustment?.adjustmentPercentage?.english, 10) };
    }
    this.activeAdjustments.adjustments.map((res, index) => {
      if (res.adjustmentId === adjustment.adjustmentId) {
        this.activeAdjustments.adjustments[index] = adjustment;
      }
    });
  }
  modifyAdjustments(adjustment) {
    if (adjustment?.adjustmentPercentage) {
      adjustment = { ...adjustment, adjustmentPercentage: parseInt(adjustment?.adjustmentPercentage?.english, 10) };
    }
    const commonAdjustment = this.activeAdjustments.adjustments.filter(x => x.adjustmentId === adjustment.adjustmentId);
    const adjustmentList = commonAdjustment.filter(y => y['actionType'] && y['actionType']['english'] !== 'Recovery');
    if (commonAdjustment.length > 1) {
      this.activeAdjustments.adjustments = [
        ...adjustmentList,
        ...this.activeAdjustments.adjustments.filter(adj => adj.adjustmentId !== adjustment.adjustmentId)
      ];
    }
    this.activeAdjustments.adjustments.map((res, index) => {
      if (res.adjustmentId === adjustment.adjustmentId) {
        this.activeAdjustments.adjustments[index] = adjustment;
      }
    });
  }
  saveAdjustment() {
    const adjustmentRequest = {
      adjustmentModificationList: this.activeAdjustments.adjustments
        .filter(adjustment => adjustment['actionType'])
        .map(adjReq => {
          const transformedReq: AdjustmentRequest = {
            actionType: adjReq?.actionType,
            adjustmentAmount: adjReq?.adjustmentAmount,
            adjustmentId: adjReq?.adjustmentId,
            adjustmentReason: adjReq?.adjustmentReason,
            adjustmentType: adjReq?.adjustmentType,
            benefitType: adjReq?.benefitType,
            beneficiaryId: adjReq?.beneficiaryId,
            notes: adjReq?.notes,
            adjustmentPercentage: adjReq['adjustmentPercentage'],
            rejectionReason: adjReq?.rejectionReason
          };
          return transformedReq;
        })
    };
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
              this.getRequiredDocument('MAINTAIN_ADJUSTMENT', 'MAINTAIN_ADJUSTMENT_REQUEST', true);
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
            this.getRequiredDocument('MAINTAIN_ADJUSTMENT', 'MAINTAIN_ADJUSTMENT_REQUEST', true);
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
    // defect 558405 - issue 1 fix
    if (this.modalRef) this.modalRef.hide();
    this.location.back();
  }
  navigateToAdjustment() {
    this.location.back();
  }
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  /** Wrapper method to scroll to top of modal*/
  goToTop() {
    scrollToTop();
  }
  onSubmitDocuments(docTemplate) {
    if (this.documents.some(doc => doc.documentContent !== null)) {
      this.submitAdjustments();
    } else {
      this.showModal(docTemplate);
    }
  }
  submitAdjustments() {
    this.submitAdjustmentDetails(
      this.identifier,
      this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
      this.adjustmentSubmitResponse?.referenceNo || this.referenceNumber,
      this.parentForm.get('documentsForm').get('comments').value
    );
    if(this.modalRef)
    this.modalRef.hide();
  }
  navigateToPreviousTab() {
    scrollToTop();
    this.currentTab = 0;
    this.adjustmentWizard.setPreviousItem(this.currentTab);
  }
  getSaveNextEligible() {
    if (this.activeAdjustments?.adjustments?.some(x => x['actionType'] !== null)) {
      return false;
    } else {
      return true;
    }
  }
  navigateToBenefitDetails(benefit) {
    this.coreAdjustmentService.benefitType = benefit?.benefitType?.english;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(benefit?.sin, benefit?.benefitRequestId, benefit?.benefitType, null)
    );
    this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
  }
  /**The method to check the adjustment eligible */
  adjustmentByEligible() {
    this.adjustmentService.getAdjustmentByeligible(this.identifier, this.sin).subscribe(data => {
      this.adjustmentInfoMessageList = data.infoMessages;
      this.gosiEligibilityInfoMsg = this.coreAdjustmentService.mapMessagesToAlert({
        details: this.adjustmentInfoMessageList,
        message: null
      });
    });
  }
  ngOnDestroy() {
    if (!this.isSubmit) this.alertService.clearAlerts();
  }
}
