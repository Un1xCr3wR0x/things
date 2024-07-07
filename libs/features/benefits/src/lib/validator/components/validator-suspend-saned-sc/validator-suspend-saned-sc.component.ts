import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Channel, RoleIdEnum, convertToYYYYMMDD } from '@gosi-ui/core';
import { noop } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ActiveBenefits, BenefitConstants, BenefitType, createDetailForm, UITransactionType } from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';

@Component({
  selector: 'bnt-validator-suspend-saned-sc',
  templateUrl: './validator-suspend-saned-sc.component.html',
  styleUrls: ['./validator-suspend-saned-sc.component.scss']
})
export class ValidatorSuspendSanedScComponent extends ValidatorBaseScComponent implements OnInit {
  suspendBenefitForm: FormGroup;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue = 100;
  limit = this.limitvalue;
  benefitDetails;
  suspendDetails;
  adjustmentDetails;
  Channel = Channel;
  validatorSuspendEdit = false;
  validatorAccessRoles = [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO];
  ngOnInit(): void {
    this.intialiseTheView(this.routerData);
    this.suspendBenefitForm = createDetailForm(this.fb);
    this.uiBenefitService
      .getUiBenefitRequestDetail(this.socialInsuranceNo, this.benefitRequestId, null)
      .pipe(
        switchMap(res => {
          this.benefitDetails = res;
          return this.uiBenefitService.getSuspendSanedDetails(this.socialInsuranceNo, this.benefitRequestId);
        }),
        switchMap(res => {
          this.suspendDetails = res;
          return this.uiBenefitService.calculateSanedSuspendAdjustments(
            this.socialInsuranceNo,
            this.benefitRequestId,
            convertToYYYYMMDD(res.suspendDate.gregorian.toString())
          );
        }),
        switchMap(res => {
          this.adjustmentDetails = res;

          return this.benefitDocumentService.getUploadedDocuments(
            this.benefitRequestId,
            UITransactionType.SUSPEND_UNEMPLOYMENT_BENEFIT,
            UITransactionType.FO_REQUEST_SANED,
            this.referenceNo
          );
        }),
        tap(res => {
          this.documentList = res;
        })
      )
      .subscribe(noop);
      this.validatorSuspendEdit = this.menuService.isUserEntitled(this.validatorAccessRoles);
  }

  navigateToEdit() {
    this.router.navigate([BenefitConstants.ROUTE_SANED_SUSPEND_BENEFIT], {
      queryParams: {
        sin: this.socialInsuranceNo,
        benefitRequestId: this.benefitRequestId
      },
      state: {
        suspendDetails: this.suspendDetails,
        referenceNo: this.referenceNo
      }
    });
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.benefitRequestId,
      { arabic: null, english: BenefitType.ui },
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }

  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }

  confirmApproveBenefit() {
    this.confirmApprove(this.suspendBenefitForm);
  }
  confirmRejectBenefit() {
    this.confirmReject(this.suspendBenefitForm);
  }
  returnBenefit() {
    this.confirmReturn(this.suspendBenefitForm);
  }
}
