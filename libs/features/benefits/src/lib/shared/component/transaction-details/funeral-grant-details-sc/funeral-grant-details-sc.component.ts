import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, RouterData, Transaction } from '@gosi-ui/core';
import { BenefitType } from '../../../enum';
import { FuneralGrantBeneficiaryResponse } from '../../../models';
import { reDirectUsersToApplyScreen } from '../../../utils';
import { TransactionPensionBase } from '../../base/transaction-pension.base';

@Component({
  selector: 'bnt-funeral-grant-details-sc',
  templateUrl: './funeral-grant-details-sc.component.html',
  styleUrls: ['./funeral-grant-details-sc.component.scss']
})
export class FuneralGrantDetailsScComponent extends TransactionPensionBase implements OnInit {
  funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  isFuneral = true;
  transactionId: number;

  /** Input Variables */
  @Input() socialInsuranceNo: number;
  @Input() requestId: number;
  @Input() referenceNo: number;
  @Input() funeralGrantForm: FormGroup;
  @Input() lang = 'en';
  @Input() isTransactionScreen = false;
  @Input() transaction: Transaction;
  @Input() routerData: RouterData;

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.benefitType = BenefitType.funeralGrant;
    this.showComments = false;
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    if (this.isTransactionScreen) {
      this.setBenefitRelatedValues(this.transaction);
    } else {
      this.setRouterDataValues(this.routerData);
      if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
        this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
      }
    }
    this.getBeneficiaryDetails();
  }

  getBeneficiaryDetails() {
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.funeralBenefitService
        .getBeneficiaryRequestDetails(this.socialInsuranceNo, this.requestId, this.referenceNo)
        .subscribe(
          res => {
            this.funeralBeneficiaryDetails = res;
          },
          err => {
            this.showError(err);
          }
        );
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
      this.referenceNo
    );
  }
}
