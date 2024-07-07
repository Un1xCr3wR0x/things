import { Component, Input, OnInit } from '@angular/core';
import { RoleIdEnum, RouterData } from '@gosi-ui/core';
import { BenefitConstants } from '../../../constants';
import { BenefitType } from '../../../enum';
import { TransactionPensionBase } from '../../base/transaction-pension.base';

@Component({
  selector: 'bnt-return-lumpsum-details-sc',
  templateUrl: './return-lumpsum-details-sc.component.html',
  styleUrls: ['./return-lumpsum-details-sc.component.scss']
})
export class ReturnLumpsumDetailsScComponent extends TransactionPensionBase implements OnInit {
  enabledRestoration: Boolean;
  enableLumpsumRepaymentId: number;
  isSadad: Boolean;
  isJailedLumpsum = false;
  isWomenLumpsum = false;
  isValidatorCanEditPayment = false;
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];

  /** Input Variables */
  @Input() lang = 'en';
  @Input() isAppPrivate = false;
  @Input() socialInsuranceNo: number;
  @Input() requestId: number;
  @Input() repayId: number;
  @Input() routerData: RouterData;
  @Input() isTransactionScreen: boolean;

  ngOnInit(): void {
    this.getLumpsumRepaymentDetails(this.socialInsuranceNo, this.requestId, this.repayId);
    if (!this.isTransactionScreen) this.setRouterDataValues(this.routerData);
  }

  /**
   * Method to fetch the return lumpsum  details
   */
  getLumpsumRepaymentDetails(sin: number, benefitRequestId: number, repayID: number) {
    this.returnLumpsumService.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID).subscribe(
      res => {
        this.isValidatorCanEditPayment = true;
        this.returnBenefitDetails = res;
        this.nin = this.returnBenefitDetails.nin;
        this.benefitType = this.returnBenefitDetails.benefitType.english;
        this.enabledRestoration = this.returnBenefitDetails.enabledRestoration;
        this.enableLumpsumRepaymentId = this.returnBenefitDetails.enableLumpsumRepaymentId;
        this.returnLumpsumService.setRepayId(repayID);
        this.returnLumpsumService.setBenefitReqId(benefitRequestId);
        this.setBenefitVariables(this.benefitType);
      },
      err => {
        this.showError(err);
      }
    );
  }

  setBenefitVariables(benefitType: string) {
    if (benefitType === BenefitType.hazardousLumpsum) {
      this.isHazardous = true;
    } else if (benefitType === BenefitType.jailedContributorLumpsum) {
      this.isJailedLumpsum = true;
    } else if (benefitType === BenefitType.occLumpsum) {
      this.isOcc = true;
    } else if (benefitType === BenefitType.nonOccLumpsumBenefitType) {
      this.isNonOcc = true;
    } else if (benefitType === BenefitType.womanLumpsum) {
      this.isWomenLumpsum = true;
    } else if (benefitType === BenefitType.heirLumpsum) {
      this.isHeir = true;
    }
  }
  /**
   * this function will redirect validator to return lumpsum amount screen
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }
}
