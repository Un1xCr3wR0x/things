import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilingualText, Channel, CoreActiveBenefits, formatDate, Lov, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  ActiveBenefits,
  BenefitDetails,
  DependentTransaction,
  DisabilityDetails,
  HeirHistory,
  ParamId
} from '../../../shared/models';
import { TransactionDetailsBase } from '@gosi-ui/features/benefits/lib/shared/component/base/transaction-details.base';
import { BenefitConstants } from '../../constants';
import { BenefitType, HeirStatus, UITransactionType } from '../../enum';
import { getTransactionTypeOrId, isHeirBenefit, showErrorMessage } from '../../utils';

@Directive()
export class TransactionPensionBase extends TransactionDetailsBase {
  readonly benefitConstants = BenefitConstants;
  paramValue: string;
  paramId: ParamId;
  acitveBenefit: CoreActiveBenefits;
  listYesNo$: Observable<LovList>;
  oldBenefitDetails: BenefitDetails[];
  heirBenefitHistory: DependentTransaction[];
  dependentHistoryDetails: DependentTransaction[];
  previousDependentHistory: DependentTransaction[];
  heirHistory: HeirHistory[];
  heirOldHistory: HeirHistory[];
  showDependentHistoryLabel: boolean;
  showHelperHistoryLabel: boolean;
  BenefitType = BenefitType;

  /*set benefit type and request types*/
  setValues() {
    this.route.queryParams.subscribe(params => {
      this.isEarlyRetirement = params.earlyretirement === 'true';
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedPension = params.jailedpension === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isNonOccDisabilityAssessment = params.disabilityAssessment === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isAddModifyBenefit = this.isModifyBackdated = params.addModifyDep === 'true';
      this.isAddModifyHeir = params.addModifyHeir === 'true';
      this.isHoldBenefit = params.hold === 'true';
      this.isStopBenefit = params.stop === 'true';
      this.isRestartBenefit = params.restart === 'true';
      this.isStartBenefitWaive = params.startBenefitWaive === 'true';
      this.isStopBenefitWaive = params.stopBenefitWaive === 'true';
    });
    this.setParam();
    this.getBenefitType();
    this.getRequestType();
  }

  setParam() {
    if (this.isEarlyRetirement) {
      this.paramValue = 'isEarlyRetirement';
    } else if (this.isNonOcc) {
      this.paramValue = 'isNonOcc';
    } else if (this.isJailedPension) {
      this.paramValue = 'isJailedPension';
    } else if (this.isHazardous) {
      this.paramValue = 'isHazardous';
    } else if (this.isNonOccDisabilityAssessment) {
      this.paramValue = 'isNonOccDisabilityAssessment';
    } else if (this.isHeir) {
      this.paramValue = 'isHeir';
    } else if (this.isOcc) {
      this.paramValue = 'isOcc';
    }
  }

  getBenefitType() {
    if (this.isEarlyRetirement) {
      this.benefitType = BenefitType.earlyretirement;
    } else if (this.isNonOcc) {
      this.benefitType = BenefitType.nonOccPensionBenefitType;
    } else if (this.isAddModifyBenefit) {
      this.benefitType = BenefitType.retirementPension;
    } else if (this.isJailedPension) {
      this.benefitType = BenefitType.jailedContributorPension;
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousPension;
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirPension;
    } else if (this.isOcc) {
      this.benefitType = BenefitType.occPension;
    } else if (this.isNonOccDisabilityAssessment) {
      this.benefitType = BenefitType.NonOccDisabilityBenefitsType;
    } else if (this.getIsRetirement()) {
      this.benefitType = BenefitType.retirementPensionType;
    }
  }

  getIsRetirement() {
    return (
      !this.isEarlyRetirement &&
      !this.isNonOcc &&
      !this.isJailedPension &&
      !this.isHazardous &&
      !this.isNonOccDisabilityAssessment &&
      !this.isHeir &&
      !this.isOcc &&
      !this.isAddModifyBenefit &&
      !this.isAddModifyHeir &&
      !this.isHoldBenefit &&
      !this.isStopBenefit &&
      !this.isRestartBenefit &&
      !this.isStartBenefitWaive &&
      !this.isStopBenefitWaive
    );
  }

  getRequestType() {
    if (this.isAddModifyBenefit) {
      this.requestType = BenefitType.addModifyBenefit;
    } else if (this.isAddModifyHeir) {
      this.requestType = BenefitType.addModifyHeir;
    } else if (this.isHoldBenefit) {
      this.requestType = BenefitType.holdbenefit;
    } else if (this.isStopBenefit) {
      this.requestType = BenefitType.stopbenefit;
    } else if (this.isRestartBenefit) {
      this.requestType = BenefitType.restartbenefit;
    } else if (this.isStartBenefitWaive) {
      this.requestType = BenefitType.startBenefitWaive;
    } else if (this.isStopBenefitWaive) {
      this.requestType = BenefitType.stopBenefitWaive;
    } else if (this.isNonOcc) {
      this.requestType = BenefitType.nonOccPensionBenefitType;
    }
  }

  updateDisabilityDetails() {
    if (this.retirementForm.get('disabilityForm').valid) {
      this.disabilityDetails.disabilityPct = this.retirementForm.get('disabilityForm.disabilityPct').value;
      this.disabilityDetails.disabledB = this.retirementForm.get('disabilityForm.disabledB.english').value === 'Yes';
      this.disabilityDetails.isHelpRequired =
        this.retirementForm.get('disabilityForm.helperRequired.english').value === 'Yes';
      this.disabilityDetails.disabilityDate.gregorian = this.retirementForm.get(
        'disabilityForm.disabilityDt.gregorian'
      ).value;
      this.approveDisabilityDetail(this.retirementForm, this.disabilityDetails);
    } else {
    }
  }

  approveDisabilityDetail(retirementForm: FormGroup, disabilityDetails: DisabilityDetails) {
    this.manageBenefitService
      .updateDisabilityDetails(this.socialInsuranceNo, this.requestId, disabilityDetails)
      .subscribe(
        data => {
          if (data) {
            const response_msg: BilingualText = data;
            this.alertService.showSuccess(response_msg);
          }
        },
        err => {
          if (err.status === 400 || err.status === 422) {
            showErrorMessage(err, this.alertService);
          }
          if (err.status === 500 || err.status === 404) {
            // TODO: update the error message for failed save disability
            this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
          }
        }
      );
    this.confirmApprove(retirementForm);
  }

  navigateToEdit() {
    this.benefitPropertyService.validatorEditCall(this.socialInsuranceNo, this.requestId, this.referenceNo).subscribe();
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.manageBenefitService.setRequestDate(this.annuityBenefitDetails?.requestDate);
    this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
    const activeBenefit = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails?.benefitType,
      this.referenceNo
    );
    //non occ pension
    if (this.isNonOcc) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          nonocc: true
        }
      });
    }
    //early retirement pension
    else if (this.isEarlyRetirement) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          earlyretirement: true
        }
      });
    }
    //jailed pension
    else if (this.isJailedPension) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          jailed: true
        }
      });
    }
    //hazardous
    else if (this.isHazardous) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          hazardous: true
        }
      });
    }
    // heir pension
    else if (this.isHeir) {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
        queryParams: {
          heir: true
        }
      });
    } else if (
      this.isAddModifyBenefit ||
      this.isAddModifyHeir ||
      this.isHoldBenefit ||
      this.isStopBenefit ||
      this.isRestartBenefit ||
      this.isStartBenefitWaive ||
      this.isStopBenefitWaive
    ) {
      const actionType = this.isHoldBenefit
        ? HeirStatus.HOLD
        : this.isStopBenefit
        ? HeirStatus.STOP
        : this.isRestartBenefit
        ? HeirStatus.RESTART
        : this.isStartBenefitWaive
        ? HeirStatus.START_WAIVE
        : this.isStopBenefitWaive
        ? HeirStatus.STOP_WAIVE
        : null;
      this.coreBenefitService.setActiveBenefit(activeBenefit);
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          isHeir: isHeirBenefit(this.benefitType),
          actionType: actionType
        }
      });
    }
    //else navigate to retirement pension
    else {
      this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
    }
  }

  /** method to fetch imprisonment details  */
  getImprisonmentDetails() {
    if (this.socialInsuranceNo && this.requestId) {
      this.dependentService.getImprisonmentDetails(this.socialInsuranceNo, this.requestId).subscribe(
        res => {
          if (res) {
            this.imprisonmentDetails = res;
            this.dependentService.imprisonmentDetails = this.imprisonmentDetails;
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
  }

  getOldDependentDetails() {
    if (this.socialInsuranceNo && this.requestId) {
      this.dependentService.getBenefitHistory(this.socialInsuranceNo, this.requestId).subscribe(
        res => {
          this.oldBenefitDetails = res;
        },
        err => {
          this.showError(err);
        }
      );
    }
  }

  getHistoryDetails() {
    if (
      !this.isHoldBenefit &&
      !this.isStopBenefit &&
      !this.isRestartBenefit &&
      !this.isStartBenefitWaive &&
      !this.isStopBenefitWaive
    ) {
      if (!this.annuityBenefitDetails?.hideBenefitDetails) {
        if (!this.isHeir && !this.isAddModifyHeir) {
          //TODO: check whether this dependent history api's to be called if status is completed
          this.getDependentHistoryDetails(
            this.socialInsuranceNo,
            this.requestId,
            this.status?.english === 'Completed' ? null : this.referenceNo
          );
          if (this.isAddModifyBenefit) {
            this.getOldDependentHistoryDetails(
              this.socialInsuranceNo,
              this.requestId,
              this.status?.english === 'Completed' ? null : this.referenceNo
            );
          }
        } else if(this.status?.english !== 'Completed' && !this.annuityBenefitDetails?.hideBenefitDetails) {
          if(this.socialInsuranceNo && this.requestId && this.referenceNo){
            this.getHeirHistoryDetails(
              this.socialInsuranceNo,
              this.requestId,
              this.referenceNo
            );
          }         
          if (this.isAddModifyHeir) {
            if(this.socialInsuranceNo && this.requestId && this.referenceNo){
              this.getOldHeirHistoryDetails(
                this.socialInsuranceNo,
                this.requestId,
                this.referenceNo
              );
            }
          }
        }
      }
    }
  }

  getOldHeirHistoryDetails(sin: number, benefitRequestId: number, transactionTraceId: number) {
    this.heirBenefitService.getHeirHistoryDetails(sin, benefitRequestId, transactionTraceId, true).subscribe(
      res => {
        this.heirOldHistory = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** method to get heir history details */
  getHeirHistoryDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.paramId = {
      sin: sin,
      benefitRequestId: benefitRequestId,
      transactionTraceId: referenceNo
    };
    this.heirBenefitService.getHeirHistoryDetails(sin, benefitRequestId, referenceNo, false).subscribe(
      res => {
        this.heirHistory = res;
      },
      err => {
        this.showError(err);
      }
    );
  }

  // fetch dependent history
  getDependentHistoryDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.dependentService?.getDependentHistoryDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.dependentHistoryDetails = res;
        this.showHistoryLabels();
      },
      err => {
        this.showError(err);
      }
    );
  }
  // fetch dependent history
  getOldDependentHistoryDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.dependentService?.getDependentHistoryDetails(sin, benefitRequestId, referenceNo, true).subscribe(
      res => {
        this.previousDependentHistory = res;
      },
      err => {
        this.showError(err);
      }
    );
  }

  showHistoryLabels() {
    if (this.dependentHistoryDetails && this.dependentHistoryDetails.length > 0) {
      this.dependentHistoryDetails.forEach(history => {
        if (!this.showDependentHistoryLabel)
          this.showDependentHistoryLabel = history.dependentsDetails && history.dependentsDetails.length > 0;

        if (!this.showHelperHistoryLabel)
          this.showHelperHistoryLabel =
            history?.helperAllowanceDetails?.allowanceAmount || history?.helperAllowanceDetails?.allowanceEndDate
              ? true
              : false;
      });
    }
  }

  // isBackDated is to be true for all the request benefits and for add/modify heir and dep
  // isBackDated is false for hold, restart etc.
  fetchDocuments() {
    this.isBackDated = true;
    if (this.getIsType()) {
      this.transactionKey = UITransactionType.REQUEST_MODIFY_BENEFIT;
      const actionType = this.isHoldBenefit
        ? HeirStatus.HOLD
        : this.isStopBenefit
        ? HeirStatus.STOP
        : this.isRestartBenefit
        ? HeirStatus.RESTART
        : this.isStartBenefitWaive
        ? HeirStatus.START_WAIVE
        : this.isStopBenefitWaive
        ? HeirStatus.STOP_WAIVE
        : null;
      this.transactionKey = getTransactionTypeOrId(this.isHeir, actionType, true);
      this.isBackDated = false;
    } else if (this.isAddModifyBenefit) {
      this.transactionKey = UITransactionType.MODIFY_DEPENDENT;
    } else if (this.isAddModifyHeir) {
      this.transactionKey = UITransactionType.MODIFY_HEIR;
    } else if (this.isEarlyRetirement) {
      this.transactionKey = UITransactionType.REQUEST_EARLY_RETIREMENT_PENSION;
    } else if (this.isNonOcc) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_PENSION_TRANSACTION;
    } else if (this.isJailedPension) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_PENSION_TRANSACTION;
    } else if (this.isHazardous) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_PENSION_TRANSACTION;
    } else if (this.isOcc) {
      this.transactionKey = UITransactionType.REQUEST_OCC_PENSION_TRANSACTION;
    } else if (this.isNonOccDisabilityAssessment) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_DISABILITY_TRANSACTION;
    } else if (this.isHeir) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_PENSION_TRANSACTION;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_BENEFIT;
    }
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNo, this.isBackDated);
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }

  getIsType() {
    return (
      this.isHoldBenefit ||
      this.isStopBenefit ||
      this.isRestartBenefit ||
      this.isStartBenefitWaive ||
      this.isStopBenefitWaive
    );
  }

  /** Approving by the validator. */
  confirmApprovePension() {
    this.confirmApprove(this.retirementForm);
  }

  /** While rejecting from validator */
  confirmRejectPension() {
    this.confirmReject(this.retirementForm);
  }

  /** when return to establishment action is performed, comments will be shared */
  returnRetirementPension() {
    this.confirmReturn(this.retirementForm);
  }
}
