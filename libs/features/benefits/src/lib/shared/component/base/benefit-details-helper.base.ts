import { Directive } from '@angular/core';
import { BenefitBaseScComponent } from '.';
import { Channel, TransactionStatus, BilingualText } from '@gosi-ui/core';
import {
  BenefitConstants,
  isUiBenefit,
  isNonoccBenefit,
  PersonConstants,
  PersonBankDetails,
  deepCopy,
  BenefitType,
  getServiceType,
  TransactionReference
} from '../..';

@Directive()
export abstract class BenefitDetailsHelperComponent extends BenefitBaseScComponent {
  approveComments: boolean;
  bankDetails: PersonBankDetails;
  comments;
  disableApprove = false;
  userName: BilingualText;
  transactionReference: TransactionReference[];

  /*To show Button conditions*/
  setButtonConditions(assignedRole) {
    switch (assignedRole) {
      case this.rolesEnum.VALIDATOR_1:
        {
          this.canReject = true;
          if (this.channel === Channel.GOSI_ONLINE) {
            this.canReturn = true;
          }
        }
        break;
      case this.rolesEnum.VALIDATOR_2:
        {
          this.canReturn = true;
          this.canReject = true;
        }
        break;
      case this.rolesEnum.GDS:
        {
          this.canReturn = true;
          this.canReject = true;
        }
        break;
      case this.rolesEnum.FC_APPROVER_ANNUITY:
        {
          this.canReturn = true;
        }
        break;
      case this.rolesEnum.CNT_FC_APPROVER:
        {
          this.canReturn = true;
        }
        break;
      case this.rolesEnum.DOCTOR:
        {
          this.canReturn = false;
          this.canRequestClarification = true;
        }
        break;
    }
  }
  // Method to track transaction of Validator 1
  trackTransaction(referenceNo: number) {
    if (this.comments) {
      this.transactionReference = this.comments;
      if (this.comments.length > 0) {
        const transRefData = [];
        this.comments.forEach(data => {
          if (data.comments !== null) {
            transRefData.push(data);
          }
        });
        this.userName = this.comments[0].userName;
      }
      // todo: KP need to revisit transaction step status check
      this.transactionReference.forEach(item => {
        if (
          item &&
          item.role?.english === 'First Validator' &&
          item.transactionStepStatus?.toLowerCase() === 'validator submit'
        ) {
          if (item.transactionStatus?.toLowerCase() === TransactionStatus.COMPLETED.toLowerCase()) {
            if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
              this.approveComments = true;
              return;
            } else {
              this.approveComments = false;
            }
          } else if (item?.transactionStatus?.toLowerCase() === TransactionStatus.IN_PROGRESS.toLowerCase()) {
            if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
              this.disableApprove = true;
              return;
            } else {
              this.disableApprove = false;
            }
          }
        }
      });
    }
  }

  /** Method to fetch bank details of a person*/
  // getBankDetails(personId?: string, isModifyBenefit?: boolean, isUI?: boolean) {
  //   // this.bankDetails = new PersonBankDetails();
  //   const contrId = this.getPersonId();
  //   if (personId && personId !== contrId) {
  //     this.authPersonId = +personId;
  //   } else {
  //     this.authPersonId = null;
  //   }
  //   const id = personId ? personId : contrId;
  //   if (isUI) {
  //     this.benefitType = BenefitType.ui;
  //   }
  //   const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
  //   this.bankService.getBankDetails(+id, this.referenceNo, serviceType, isModifyBenefit).subscribe(bankRes => {
  //     if (bankRes) this.setBankDetails(bankRes);
  //   });
  // }
  //
  // setBankDetails(bankRes: PersonBankDetails = new PersonBankDetails()) {
  //   this.bankDetails = deepCopy(bankRes);
  //   if (this.bankDetails.isNonSaudiIBAN === false) {
  //     if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //     if (this.bankDetails.ibanBankAccountNo !== null) {
  //       this.getBank(this.bankDetails.ibanBankAccountNo.slice(4, 6));
  //     }
  //   } else {
  //     if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //   }
  // }

  navigateToBenefitsHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    if (isUiBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          uihistory: true
        }
      });
    } else if (isNonoccBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          occupational: true
        }
      });
    } else {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          annuity: true
        }
      });
    }
  }
}
