/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, TemplateRef, Input, SimpleChanges, OnChanges } from '@angular/core';

import {
  Lov,
  LovList,
  RoleIdEnum,
  RouterConstants,
  SamaVerificationStatus,
  RouterData,
  Transaction,
  TransactionStatus,
  ApplicationTypeEnum,
  CommonIdentity,
  checkIqamaOrBorderOrPassport
} from '@gosi-ui/core';
import {
  ActiveBenefits,
  AdjustmentDetailsDto,
  AnnuityResponseDto,
  DependentDetails,
  EachHeirDetail,
  HeirHistory
} from '../../../models';
import { FormGroup } from '@angular/forms';
import { WorkFlowStatus } from '@gosi-ui/features/occupational-hazard/lib/shared/enums/work-flow-status';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BenefitType, BenefitValues } from '../../../enum';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { TransactionPensionBase } from '@gosi-ui/features/benefits/lib/shared/component/base/transaction-pension.base';
import { reDirectUsersToApplyScreen, showErrorMessage } from '../../../utils';
import { BenefitConstants } from '../../../constants';

@Component({
  selector: 'bnt-retirement-pension-details-sc',
  templateUrl: './retirement-pension-details-sc.component.html',
  styleUrls: ['./retirement-pension-details-sc.component.scss']
})
export class RetirementPensionDetailsScComponent extends TransactionPensionBase implements OnInit, OnDestroy {
  adjustmentDetails: AdjustmentDetailsDto;
  benefitTypes = BenefitType;
  transactionKey: string;
  benefitValuesConstants = BenefitValues;
  approveAccessRoles = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER, RoleIdEnum.FC];
  // benefitsAndWageDetails: BenefitWageDetail;
  otherBenefits: boolean;
  wageDetails: boolean;
  benefitWageDetail: EachHeirDetail;
  modalRef: BsModalRef;
  samaVerificationStatus = SamaVerificationStatus;
  benefitPeriodHistory: HeirHistory;
  // Input Variables
  heirHistoryType = 'new';
  showNewHistory = true;

  /** Input Variables */

  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() systemParameter: SystemParameter;
  @Input() retirementForm: FormGroup;
  @Input() routerData: RouterData;
  @Input() transaction: Transaction;
  @Input() lang = 'en';
  @Input() isTransactionScreen = false;

  ngOnInit(): void {
    this.setValues();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    //For reason for late request
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    if (this.isTransactionScreen) {
      this.setBenefitRelatedValues(this.transaction);
    } else {
      this.setRouterDataValues(this.routerData);
      // this.requestId = 1005185544;
      // this.benefitRequestId = 1005185544;

      if (this.benefitRequestId && this.socialInsuranceNo && this.referenceNo)
        this.setAnnuityBenefitRelatedValues(this.benefitRequestId, this.socialInsuranceNo, this.referenceNo);
    }

    if (this.isJailedPension) {
      this.getImprisonmentDetails();
    }
    // no edit option in occ benefits curretly
    // if (this.isOcc) {
    //   this.validatorCanEdit = false; //not sure whether required
    // }
    if (
      this.requestType === BenefitType.addModifyBenefit ||
      this.requestType === BenefitType.addModifyHeir ||
      this.requestType === BenefitType.restartbenefit ||
      this.requestType === BenefitType.holdbenefit ||
      this.requestType === BenefitType.stopbenefit
    ) {
      this.getOldDependentDetails();
    }
    if (!this.isDoctor) {
      if (this.status?.english === 'Completed' && this.isAddModifyHeir) {
        this.getHeirBenefitHistoryDetails(this.socialInsuranceNo, this.benefitRequestId);
      } else {
        if (this.annuityBenefitDetails)
        this.getHistoryDetails();
      }
    }
    // accessing the active Benefit details which set which user click on active benefits carousel
    this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
    // this.showHistoryLabels();
  }

  getAsyncHeirHistoryCall(){
    //when benefit api is getting aysnchronus response
    if (!this.isDoctor) {
      this.getHistoryDetails();
    }
  }

  getHeirBenefitHistoryDetails(sin: number, benefitRequestId: number) {
    this.heirBenefitService.getHeirBenefitHistory(sin, benefitRequestId).subscribe(
      res => {
        this.heirBenefitHistory = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  showHistoryForInprogressTransaction() {
    return (
      this.status?.english?.toUpperCase() !== TransactionStatus.COMPLETED ||
      (this.status?.english?.toUpperCase() === TransactionStatus.COMPLETED && !this.isAddModifyHeir)
    );
  }

  showHistoryForCompletedTransaction() {
    return this.status?.english?.toUpperCase() === TransactionStatus.COMPLETED && this.isAddModifyHeir;
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.benefitRequestId,
      this.annuityBenefitDetails.benefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    if (this.isHeir) {
      this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
    } else {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    }
  }
  getRequiredDocListToLov() {
    this.benefitDocumentService
      .getRequiredDocuments(this.socialInsuranceNo, this.requestId, this.referenceNo)
      .subscribe(documentResponse => {
        this.uiItemList = documentResponse;
        if (this.uiItemList) {
          if (this.uiItemList.length > 0) {
            this.items = this.uiItemList.map(document => {
              const lov = new Lov();
              lov.value = document.name;
              return lov;
            });
            this.documentListLov = new LovList(this.items);
          }
        }
      });
  }
  /** this method is to show other benefits and wage details */
  showBenefitWageDetails(templateRef: TemplateRef<HTMLElement>, benefitWageDetail: EachHeirDetail) {
    this.benefitWageDetail = benefitWageDetail;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  /** this method is to close popup */
  closePopup() {
    this.modalRef.hide();
  }
  //fetch adjustment details
  getAdjustmentDetails(sin: number, benefitRequestId: number) {
    this.benefitPropertyService.getAdjustmentDetails(sin, benefitRequestId).subscribe(
      res => {
        this.adjustmentDetails = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** method for current or new heir history toggle */
  currentOrNewHistory(heirHistoryType) {
    if (heirHistoryType === 'current') {
      this.heirHistoryType = 'current';
      this.showNewHistory = false;
    } else if (heirHistoryType === 'new') {
      this.heirHistoryType = 'new';
      this.showNewHistory = true;
    }
  }

  reDirectUsersToApplyScreens() {
    reDirectUsersToApplyScreen(
      this.requestType,
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails,
      this.coreBenefitService,
      this.router,
      this.benefitType,
      this.referenceNo,
      this.paramValue
    );
  }

  /*To show Comments*/
  setShowComments(workFlowStatus: WorkFlowStatus, assignedRole) {
    if (workFlowStatus) {
      if (
        assignedRole === this.rolesEnum.VALIDATOR_2 &&
        (workFlowStatus === WorkFlowStatus.FC_RETURN_TO_VALIDATOR2_ ||
          workFlowStatus === WorkFlowStatus.GDOSI_RETURN_TO_VALIDATOR2_)
      ) {
        this.showComments = true;
      }
      if (
        workFlowStatus === WorkFlowStatus.FC_RETURN_TO_VALIDATOR1 ||
        workFlowStatus === WorkFlowStatus.GDOSI_RETURN_TO_VALIDATOR1
      ) {
        this.canReject = false;
      }
    }
  }
  gotoVicViewPage() {
    const identity: CommonIdentity = checkIqamaOrBorderOrPassport(this.annuityBenefitDetails?.identity);
    //this.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENTS(this.socialInsuranceNo)]);
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: identity?.id,
        isDashboard: 'true'
      }
    });
  }

  navigateToInjuryDetails() {
    this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
  }
  navigateToProfile(sin: number) {
    const url = '#' + `/home/profile/individual/internal/${sin}`;
    window.open(url, '_blank');
  }
  navigateToViewDetails() {
    const url = '#' + `home/benefits/annuity/heir-benefit-active`;
    window.open(url, '_blank');
  }
  navigateToPaymentHistory(personId: number) {
    const activeHeirDetail = {
      personId: personId,
      sin: this.socialInsuranceNo,
      benefitRequestId: this.benefitRequestId,
      benefitType: this.benefitType
    };
    this.heirActiveService.setActiveHeirDetails(activeHeirDetail);
    this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_DETAILS]);
  }

  showBankDetailsSection() {
    return (
      (!this.requestType &&
        !this.isHeir &&
        this.annuityBenefitDetails?.paymentMethod?.english === this.benefitValuesConstants.BANK) ||
      (!this.isHeir && this.preSelectedAuthperson && (this.isStartBenefitWaive || this.isStopBenefitWaive)) ||
      this.requestType === BenefitType.nonOccPensionBenefitType ||
      this.requestType === BenefitType.nonOccPensionBenefit
    );
  }
  /** This method is to perform cleanup activities when an instance of component is destroyed.  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    // if (this.language) this.language.unsubscribe();
  }
}
