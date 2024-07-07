/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges, TemplateRef, Output, EventEmitter } from '@angular/core';
import {
  getPersonNameAsBilingual,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  IdentityTypeEnum,
  statusBadgeType,
  formatDate,
  GosiCalendar, Name
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BenefitDetails, DependentDetails, DependentHistory, EventValidated } from '../../models';
import { BenefitType, BenefitValues } from '../../enum';
import {
  getEligibilityStatusForHeirPensionLumpsumFromValidateApi,
  getStatusBasedOnActionType,
  HeirEligibilityStatusWithOtherBenefits,
  isHeirLumpsum
} from '../../utils';

@Component({
  selector: 'bnt-heirs-details-dc',
  templateUrl: './heirs-details-dc.component.html',
  styleUrls: ['./heirs-details-dc.component.scss']
})
export class HeirsDetailsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  addedHeirDetails: DependentDetails[] = [];
  nicHeirDetails: DependentDetails[] = [];
  benefitValues = BenefitValues;
  benefitTypes = BenefitType;
  heirInEnglish = [];
  heirInArabic = [];
  isUnborn = false;
  isModifyBenefit = false;

  //Input variables
  @Input() heirDetails: DependentDetails[];
  @Input() benefitType: string;
  @Input() requestType: string;
  @Input() dependentHistory: DependentHistory;
  @Input() lang = 'en';
  @Input() systemRunDate: GosiCalendar;
  // For Eligibility status
  @Input() benefitCalculation: BenefitDetails;
  @Input() isModify: boolean;

  @Output() getDependentHistory: EventEmitter<number> = new EventEmitter();
  @Output() onViewBenefitDetails = new EventEmitter();

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {
    this.setHeirNames();
    if (
      this.requestType &&
      (this.requestType === BenefitType.addModifyBenefit ||
        this.requestType === BenefitType.addModifyHeir ||
        this.requestType === BenefitType.holdbenefit ||
        this.requestType === BenefitType.stopbenefit ||
        this.requestType === BenefitType.restartbenefit ||
        this.requestType === BenefitType.startBenefitWaive ||
        this.requestType === BenefitType.stopBenefitWaive)
    ) {
      this.isModifyBenefit = true;
    }
  }

  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.heirDetails.currentValue) {
      this.heirDetails = changes.heirDetails.currentValue;
      this.heirDetails.forEach(heir => {
        const nameObj = getPersonNameAsBilingual(heir.name);
        heir.nameInEnglish = nameObj?.english?.length > 0 ? nameObj.english : '-';
        heir.nameInArabic = nameObj?.arabic;
        heir.editStatus = getStatusBasedOnActionType(heir.actionType);
        //heir.valid need not to be checked in validator screen
        heir.statusAfterValidation = HeirEligibilityStatusWithOtherBenefits(
          heir,
          this.systemRunDate,
          this.benefitCalculation,
          isHeirLumpsum(this.benefitType),
          true,
          this.isModify
        );
        if (heir.dependentSource === BenefitValues.gosi || !heir.dependentSource) {
          this.addedHeirDetails.push(heir);
        } else if (heir.dependentSource === BenefitValues.moj) {
          this.nicHeirDetails.push(heir);
        }
      });
    }
  }

  setHeirNames() {
    this.heirDetails.forEach(heir => {
      const nameObj = getPersonNameAsBilingual(heir.name);
      this.heirInEnglish.push(nameObj?.english);
      this.heirInArabic.push(nameObj?.arabic);
    });
  }

  getName(name: Name = new Name(), lang = 'en' ) {
    const nameObj = getPersonNameAsBilingual(name);
    return lang === 'en' ? nameObj?.english : nameObj?.arabic;
  }

  getIdentifierLabelOrValue(retrunType: string, value: NIN | Iqama | NationalId | Passport | BorderNumber) {
    if (value) {
      switch (value.idType) {
        case IdentityTypeEnum.NIN:
          return retrunType === 'label' ? 'BENEFITS.NATIONAL-ID' : value['newNin'];
        case IdentityTypeEnum.PASSPORT:
          return retrunType === 'label' ? 'BENEFITS.PASSPORT-NO' : value['passportNo'];
        case IdentityTypeEnum.IQAMA:
          return retrunType === 'label' ? 'BENEFITS.IQAMA-NUMBER' : value['iqamaNo'];
        case IdentityTypeEnum.BORDER:
          return retrunType === 'label' ? 'BENEFITS.BORDER-NO' : value['id'];
        // case IdentityTypeEnum.GCCID:
        //   return retrunType === 'label' ? 'BENEFITS.GCC-NIN' : value['id'];

        default:
          return '';
      }
    } else {
      return '';
    }
  }

  /**
   * to get statusBadge Type
   */
  statusBadgeType(status) {
    return statusBadgeType(status);
  }

  showModal(templateRef: TemplateRef<HTMLElement>, personId: number) {
    this.getDependentHistory.emit(personId);
  }

  closeModal() {
    this.modalService.hide();
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }

  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}
