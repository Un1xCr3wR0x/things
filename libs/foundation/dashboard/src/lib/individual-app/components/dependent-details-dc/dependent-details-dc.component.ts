import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Role, RouterData, RouterDataToken } from '@gosi-ui/core';
import { AlertService, CoreBenefitService } from '@gosi-ui/core/lib/services';
import {
  ActiveBenefits,
  BenefitConstants,
  BenefitStatus,
  BenefitType,
  BenefitValues,
  DependentDetails,
  DependentService,
  DependentSetValues,
  HeirStatusType,
  isHeirBenefit,
  ModifyBenefitService,
  reDirectUsersToApplyScreen,
  UIPayloadKeyEnum
} from '@gosi-ui/features/benefits/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dsb-dependent-details-dc',
  templateUrl: './dependent-details-dc.component.html',
  styleUrls: ['./dependent-details-dc.component.scss']
})
export class DependentDetailsDcComponent implements OnInit, OnChanges {
  // Local variables
  benefitRequestId: number;
  sin: number;
  benefitTyp: string;
  status: string[] = [];
  dependentDetails: DependentDetails[];
  @Input() lang: string;
  @Input() benefitDetail: ActiveBenefits;
  benefitStatus = BenefitStatus;
  benefitType = BenefitType;
  referenceNo: number;
  commonModalRef: BsModalRef;
  benefitValues = BenefitValues;

  @Output() close = new EventEmitter();
  constructor(
    readonly modalService: BsModalService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly modifyPensionService: ModifyBenefitService,
    readonly coreBenefitService: CoreBenefitService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.benefitDetail && changes.benefitDetail.currentValue) {
      this.benefitDetail = changes.benefitDetail.currentValue;
      this.dependentDetails = this.benefitDetail.dependentDetails;
    }
  }

  ngOnInit(): void {
    this.sin = this.benefitDetail.sin;
    this.benefitRequestId = this.benefitDetail.benefitRequestId;
    this.benefitTyp = this.benefitDetail.benefitType.english;
    this.referenceNo = null;
  }

  onDependentEntryCLick(selectedBenefit) {
    if (selectedBenefit) {
      const data = new DependentSetValues(
        selectedBenefit?.identity[0]?.newNin,
        selectedBenefit?.name,
        selectedBenefit?.personId,
        this.sin,
        this.benefitRequestId,
        this.benefitTyp,
        this.referenceNo
      );
      this.modifyPensionService.setDependentDetails(data);
      this.hideModal();
      this.router.navigate([BenefitConstants.ROUTE_DEPENDENT_DETAILS]);
    }
  }

  // this function will trigger when user clicks the view details button
  navigateTomodify(activeBenefit: ActiveBenefits, benefitStatus: BenefitStatus) {
    this.hideModal();
    if (benefitStatus === this.benefitStatus.DRAFT) {
      this.routerData.idParams.set(UIPayloadKeyEnum.ID, activeBenefit.benefitRequestId);
      this.routerData.idParams.set(UIPayloadKeyEnum.SIN, activeBenefit.sin);
      this.routerData.idParams.set(UIPayloadKeyEnum.REFERENCE_NO, activeBenefit.referenceNo);
      this.routerData.assignedRole = Role.VALIDATOR_1;
      this.routerData.draftRequest = true;
      // if (activeBenefit.appeal) {
      //   this.router.navigate([BenefitConstants.ROUTE_APPEAL_DETAILS]);
      // } else {
      reDirectUsersToApplyScreen(
        null,
        activeBenefit.sin,
        activeBenefit.benefitRequestId,
        null,
        this.coreBenefitService,
        this.router,
        activeBenefit.benefitType.english,
        activeBenefit.referenceNo
      );
      // }
    } else {
      const benefitType = activeBenefit.benefitType.english;
      this.coreBenefitService.setActiveBenefit(activeBenefit);

      // navigate to heir pension modify page
      switch (benefitType) {
        case BenefitType.heirDeathPension2:
        case BenefitType.heirMissingPension:
        case BenefitType.heirPension:
        case BenefitType.heirLumpsumDeadContributor:
        case BenefitType.heirMissingLumpsum:
        case BenefitType.heirLumpsum:
          // this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
          break;
        case BenefitType.retirementPension:
        case BenefitType.earlyretirement:
        case BenefitType.hazardousPension:
        case BenefitType.jailedContributorPension:
        case BenefitType.nonOccPensionBenefitType:
        case BenefitType.ui:
        case BenefitType.funeralGrant:
        case BenefitType.hazardousLumpsum:
        case BenefitType.jailedContributorLumpsum:
        case BenefitType.nonOccLumpsumBenefitType:
        case BenefitType.retirementLumpsum:
        case BenefitType.womanLumpsum:
        case BenefitType.occLumpsum:
        case BenefitType.occPension:
        case BenefitType.oldAgeWomenPension:
          this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT], { queryParams: { manageDependent: true } });
          break;
      }
    }
  }

  hideModal() {
    this.close.emit();
    // this.commonModalRef.hide();
  }
}
