/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges, TemplateRef, Output, EventEmitter } from '@angular/core';
import { GosiCalendar } from '@gosi-ui/core/lib/models/gosi-calendar';
import { getPersonNameAsBilingual } from '@gosi-ui/core/lib/utils/person';
import { NIN, Iqama, NationalId, Passport, BorderNumber, IdentityTypeEnum } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DependentDetails, DependentHistory } from '../../models';
import { ActionType, BenefitType, BenefitValues } from '../../enum';
import { getStatusBasedOnActionType } from '../../utils';

@Component({
  selector: 'bnt-validator-heir-details-dc',
  templateUrl: './heir-details-dc.component.html',
  styleUrls: ['./heir-details-dc.component.scss']
})
export class HeirDetailsDcComponent implements OnInit, OnChanges {
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

  //Input variables
  @Input() heirDetails: DependentDetails[];
  @Input() notificationDate: GosiCalendar;
  @Input() benefitType: string;
  @Input() requestType: string;
  @Input() dependentHistory: DependentHistory;
  @Output() getDependentHistory: EventEmitter<number> = new EventEmitter();
  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {
    this.setHeirNames();
  }

  /**
   * Method to handle input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.heirDetails.currentValue) {
      this.heirDetails.forEach(heir => {
        const nameObj = getPersonNameAsBilingual(heir.name);
        heir.nameInEnglish = nameObj.english?.length > 0 ? nameObj.english : '-';
        heir.nameInArabic = nameObj.arabic;
        heir.editStatus = getStatusBasedOnActionType(heir.actionType);
        if (heir.dependentSource === BenefitValues.gosi) {
          this.addedHeirDetails.push(heir);
        } else if (heir.dependentSource === BenefitValues.moj) {
          this.nicHeirDetails.push(heir);
        }
      });
    }
    if (changes && changes.requestType && changes.requestType.currentValue) {
      this.requestType = changes.requestType.currentValue;
      if (this.requestType === BenefitType.addModifyHeir) {
        if (this.heirDetails) {
          this.heirDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === ActionType.ADD) {
              dependent.editStatus = BenefitValues.new;
            } else if (dependent.actionType && dependent.actionType === ActionType.MODIFY) {
              dependent.editStatus = BenefitValues.modified;
            }
          });
        }
      }
    }
  }
  setHeirNames() {
    this.heirDetails.forEach(heir => {
      const nameObj = getPersonNameAsBilingual(heir.name);
      this.heirInEnglish.push(nameObj.english);
      this.heirInArabic.push(nameObj.arabic);
    });
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
  showModal(templateRef: TemplateRef<HTMLElement>, personId: number) {
    this.getDependentHistory.emit(personId);
  }
  closeModal() {
    this.modalService.hide();
  }
}
