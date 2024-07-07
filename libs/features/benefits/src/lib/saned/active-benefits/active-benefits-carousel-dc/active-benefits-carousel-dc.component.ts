/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, EventEmitter, Output, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { ActiveBenefits } from '../../../shared/models';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Router } from '@angular/router';
import {
  BenefitConstants,
  ModifyBenefitService,
  BenefitType,
  BenefitStatus,
  reDirectUsersToApplyScreen,
  UIPayloadKeyEnum,
  HeirStatusType,
  isHeirBenefit,
  notIsHeir,
  isOccBenefit,
  isNonoccBenefit
} from '../../../shared';
import {
  RouterData,
  RouterDataToken,
  Role,
  CoreBenefitService,
  checkIqamaOrBorderOrPassport,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  BenefitsGosiShowRolesConstants,
  CoreAdjustmentService
} from '@gosi-ui/core';

@Component({
  selector: 'bnt-active-benefits-carousel-dc',
  templateUrl: './active-benefits-carousel-dc.component.html',
  providers: [{ provide: CarouselConfig, useValue: { interval: false, noPause: false, showIndicators: false } }],
  styleUrls: ['./active-benefits-carousel-dc.component.scss']
})
export class ActiveBenefitsCarouselDcComponent implements OnInit, OnChanges {
  @Input() activeBenefitsList: ActiveBenefits[];
  @Input() benefitType: string;
  @Input() isStandalone: boolean;
  @Input() isIndividualApp: boolean = false;
  @Output() appeal: EventEmitter<{ assessmentId: number; benefitRequestId: number; isAssessment: boolean, nin?: number }> =
    new EventEmitter();
  @Output() accept: EventEmitter<{ assessmentId: number; benefitRequestId: number, nin?: number }> = new EventEmitter();
  @Output() onTransactionIdClicked = new EventEmitter();
  @Output() onDisabledNinClicked = new EventEmitter();
  /* local variable */

  isNonOccReassessment = BenefitType.nonOccPensionBenefitType;
  noWrapSlides = false;
  showIndicator = true;
  benefitStatus = BenefitStatus;
  benefitTypes = BenefitType;
  heirStatusType = HeirStatusType;
  heading: string;
  benefitsGosiShowRolesConstants = BenefitsGosiShowRolesConstants;
  viewCreate = BenefitsGosiShowRolesConstants.BENEFIT_VIEW_DETAILS;
  assessmentWarningMessage = {
    english:
      'The decision of the Primary Medical Committee has been approved by the GOSI and subject to objection by the contributor/beneficiary within (21) working days from the date of its issuance, please note that objection to the decision results in the case will be fully studied by the Appeal Medical Committee not just the causes of the objection.',
    arabic:
      'تم اعتماد قرار اللجنة الطبية الابتدائية من قبل المؤسسة العامة للتأمينات الاجتماعية وهو قابل للاعتراض من قبل المشترك/ المستفيد خلال (21) يوم عمل من تاريخ صدوره، علماً بأن الاعتراض على القرار يترتب عليه دراسة الحالة من قبل اللجنة الطبية الاستئنافية بشكل كامل وليس جزئيات الاعتراض فقط.'
  };
  constructor(
    readonly router: Router,
    private coreBenefitService: CoreBenefitService,
    private coreAdjustmentService: CoreAdjustmentService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    // if (changes && changes.activeBenefitsList?.currentValue) {
    //   this.activeBenefitsList?.forEach(eachBenefit =>{
    //     if(eachBenefit?.benefitType?.english === BenefitType.heirDeathPension2 || eachBenefit?.benefitType?.english === BenefitType.heirDeathPension){
    //      this.heading = 'BENEFITS.HEIRS-PENSION-OF-DEAD-BENEFIT';
    //     }else if(eachBenefit?.benefitType?.english === BenefitType.heirMissingPension){
    //       this.heading = 'BENEFITS.HEIRS-PENSION-OF-MISSING-BENEFIT';
    //     }else if(eachBenefit?.benefitType?.english === BenefitType.oldAgeWomenPension){
    //       this.heading = 'BENEFITS.OLD-AGE-WOMAN-PENSION-BENEFIT';
    //     }else if(eachBenefit?.benefitType?.english === BenefitType.oldAgeWomenLumpsum){
    //       this.heading = 'BENEFITS.OLD-AGE-WOMAN-LUMPSUM-BENEFIT';
    //     }
    //   })
    // }
  }

  getHeading(eachBenefit: ActiveBenefits) {
    if (
      eachBenefit?.benefitType?.english === BenefitType.heirDeathPension2 ||
      eachBenefit?.benefitType?.english === BenefitType.heirDeathPension
    ) {
      return 'BENEFITS.HEIRS-PENSION-OF-DEAD-BENEFIT';
    } else if (eachBenefit?.benefitType?.english === BenefitType.heirMissingPension) {
      return 'BENEFITS.HEIRS-PENSION-OF-MISSING-BENEFIT';
    } else if (eachBenefit?.benefitType?.english === BenefitType.oldAgeWomenPension) {
      return 'BENEFITS.OLD-AGE-WOMAN-PENSION-BENEFIT';
    } else if (eachBenefit?.benefitType?.english === BenefitType.oldAgeWomenLumpsum) {
      return 'BENEFITS.OLD-AGE-WOMAN-LUMPSUM-BENEFIT';
    } else {
      return eachBenefit.benefitType;
    }
  }

  // this function will trigger when user clicks the view details button
  navigateTomodify(activeBenefit: ActiveBenefits, benefitStatus: BenefitStatus) {
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
      if (isHeirBenefit(benefitType)) {
        this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
      }
      if (notIsHeir(benefitType)) {
        this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      }
    }
  }

  navigateToDisabilityAssessment(activeBenefits: ActiveBenefits) {
    this.coreAdjustmentService.socialNumber = activeBenefits?.sin;
    this.coreBenefitService.injuryId = activeBenefits?.injuryId || activeBenefits.benefitRequestId;
    this.coreAdjustmentService.identifier = +activeBenefits?.assessmentDetails?.assessmentDetails?.identifier;
    // this.coreBenefitService.assessmentRequestId = activeBenefits?.assessmentDetails?.assessmentDetails?.assessmentId;
    this.coreBenefitService.disabilityAssessmentId = activeBenefits?.assessmentDetails?.assessmentDetails?.assessmentId;
    this.coreBenefitService.nationalId = activeBenefits?.nationalId;
    this.coreBenefitService.disabilityType = activeBenefits?.assessmentDetails?.assessmentDetails?.disabilityType;
    this.coreBenefitService.isBenefitRoute = true;
    this.router.navigate([BenefitConstants.ROUTE_MB_DISABILITY_ASSESSMENT]);
  }

  isOccBenefit(benefitType: string) {
    return isOccBenefit(benefitType);
  }
  isNonoccBenefit(benefitType: string) {
    return isNonoccBenefit(benefitType);
  }
  isHeirBenefit(benefitType: string) {
    return isHeirBenefit(benefitType);
  }

  // this function is called when user click the view disability description button
  navigateToInjurypage(activeBenefit: ActiveBenefits) {
    this.coreBenefitService.setActiveBenefit(activeBenefit);
    this.router.navigate([BenefitConstants.ROUTE_INJURY_DETAILS]);
  }

  routeToPension(activeBenefits: ActiveBenefits) {
    this.coreBenefitService.setActiveBenefit(activeBenefits);
    this.accept.emit({
      assessmentId: activeBenefits.assessmentDetails.assessmentDetails?.assessmentId,
      benefitRequestId: activeBenefits.benefitRequestId,
      nin: activeBenefits.nin
    });
  }
  appealAssessment(activeBenefits: ActiveBenefits) {
    this.appeal.emit({
      assessmentId: activeBenefits.assessmentDetails.assessmentDetails?.assessmentId,
      benefitRequestId: activeBenefits.benefitRequestId,
      isAssessment: activeBenefits?.assessmentDetails?.assessmentDetails?.isAssessment,
      nin: activeBenefits.nin
    });
  }
  getIdentifier(disabledIdentifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    const identity = checkIqamaOrBorderOrPassport(disabledIdentifier);
    return identity?.id ? identity?.id : '-';
  }
  onDisabledNinClick(id) {
    if (id !== '-') {
      this.onDisabledNinClicked.emit(id);
    }
  }
}
