/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  TemplateRef,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';
import { Router } from '@angular/router';

import {
  GosiCalendar,
  getPersonNameAsBilingual,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  IdentityTypeEnum,
  statusBadge,
  BilingualText,
  Name
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { __values } from 'tslib';
import { BenefitConstants } from '../../constants';
import { ActionType, BenefitType, BenefitValues, HeirStatus } from '../../enum';
import { DependentDetails, DependentHistory } from '../../models';

@Component({
  selector: 'bnt-dependent-details-dc',
  templateUrl: './dependent-details-dc.component.html',
  styleUrls: ['./dependent-details-dc.component.scss']
})
export class DependentDetailsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  status: string;
  originalNotes: string;
  dependentInEnglish = [];
  dependentInArabic = [];
  modalRef: BsModalRef;
  benefitValues = BenefitValues;
  benefitTypes = BenefitType;
  isNotesShortened: boolean;
  loadLessNotes = true;
  lessNotes = BenefitConstants.LESS_NOTES_LENGTH;
  manuallyAddedList: DependentDetails[] = [];
  dependentsFromNic: DependentDetails[] = [];

  //Input variables
  @Input() lang = 'en';
  @Input() dependentDetails: DependentDetails[];
  @Input() notificationDate: GosiCalendar;
  @Input() benefitType: string;
  @Input() requestType: string;
  @Input() dependentHistory: DependentHistory;
  @Input() isHeirBenefit = false;
  @Output() getDependentHistory: EventEmitter<number> = new EventEmitter();
  @Output() onViewBenefitDetails = new EventEmitter();

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {
    // this.setDependentNames();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.dependentDetails?.currentValue) {
      this.dependentDetails.forEach(dependent => {
        const nameObj = getPersonNameAsBilingual(dependent.name);
        // this.dependentInEnglish.push(nameObj.english);
        // this.dependentInArabic.push(nameObj.arabic);
        dependent.nameInEnglish = nameObj.english?.length > 0 ? nameObj.english : '-';
        dependent.nameInArabic = nameObj.arabic;
        if (dependent.dependentSource === BenefitValues.gosi) {
          this.manuallyAddedList.push(dependent);
        } else if (dependent.dependentSource === BenefitValues.moj || dependent.dependentSource === BenefitValues.nic) {
          this.dependentsFromNic.push(dependent);
        }
        // For heir, if dependent source is not coming, show the heirs as manually added
        else if (dependent.dependentSource === null && this.isHeirBenefit) {
          this.manuallyAddedList.push(dependent);
        }
      });
      if (this.requestType === BenefitType.addModifyBenefit) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === ActionType.ADD) {
              // dependent.editStatus = BenefitValues.new;
              dependent.editStatus = 'BENEFITS.NEW';
            } else if (dependent.actionType && dependent.actionType === ActionType.MODIFY) {
              // dependent.editStatus = BenefitValues.modified;
              dependent.editStatus = 'BENEFITS.MODIFY';
            }
          });
        }
      } else if (this.requestType === BenefitType.holdbenefit) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === HeirStatus.HOLD) {
              // dependent.editStatus = BenefitValues.hold;
              dependent.editStatus = 'BENEFITS.HOLD-STATUS';
              // dependent.notes = BenefitValues.sampleNotes; // remove
              // this.originalNotes = dependent.notes;
              // dependent.notes = this.setNotes(dependent.notes);
            }
          });
        }
      } else if (this.requestType === BenefitType.restartbenefit) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === HeirStatus.RESTART) {
              // dependent.editStatus = BenefitValues.restart;
              dependent.editStatus = 'BENEFITS.RESTART-STATUS';
              // this.originalNotes = dependent.notes;
              //dependent.notes = this.setNotes(dependent.notes);
            }
          });
        }
      } else if (this.requestType === BenefitType.stopbenefit) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === HeirStatus.STOP) {
              // dependent.editStatus = BenefitValues.stop;
              dependent.editStatus = 'BENEFITS.STOP-STATUS';
              //this.originalNotes = dependent.notes;
              //dependent.notes = this.setNotes(dependent.notes);
            }
          });
        }
      } else if (this.requestType === BenefitType.startBenefitWaive) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === HeirStatus.START_WAIVE) {
              // dependent.editStatus = BenefitValues.startBenefitWaive;
              dependent.editStatus = 'BENEFITS.BENEFIT-WAIVED';
              // this.originalNotes = dependent.notes;
              // dependent.notes = this.setNotes(dependent.notes);
            }
          });
        }
      } else if (this.requestType === BenefitType.stopBenefitWaive) {
        if (this.dependentDetails) {
          this.dependentDetails.forEach(dependent => {
            if (dependent.actionType && dependent.actionType === HeirStatus.STOP_WAIVE) {
              // dependent.editStatus = BenefitValues.stopBenefitWaive;
              dependent.editStatus = 'BENEFITS.BENEFIT_WAIVE_STOPPED';
              // this.originalNotes = dependent.notes;
              //              dependent.notes = this.setNotes(dependent.notes);
            }
          });
        }
      }
    }
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }

  statusBadgeType(status) {
    return statusBadge(status);
  }
  // setDependentNames() {
  //   this.dependentDetails.forEach(dependent => {
  //     const nameObj = getPersonNameAsBilingual(dependent.name);
  //     this.dependentInEnglish.push(nameObj.english);
  //     this.dependentInArabic.push(nameObj.arabic);
  //   });
  // }
  getDependentInEnglish(depName: Name) {
    const nameObj = getPersonNameAsBilingual(depName);
    return nameObj.english;
  }
  getDependentInArabic(depName: Name) {
    const nameObj = getPersonNameAsBilingual(depName);
    return nameObj.arabic;
  }
  setNotes(value: string) {
    let notes = value;
    this.isNotesShortened = false;
    if (value.length > 100) {
      notes = value.substring(0, 100) + '...';
      this.isNotesShortened = true;
    }
    return notes;
  }
  // loadFullNotes() {
  //   if (this.isNotesShortened && this.originalNotes) {
  //     this.isNotesShortened = false;
  //   }
  // }
  loadFullNotes() {
    this.loadLessNotes = !this.loadLessNotes;
  }
  // loadLessNotes() {
  //   if (!this.isNotesShortened) {
  //     this.isNotesShortened = true;
  //   }
  // }

  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>, personId: number) {
    this.getDependentHistory.emit(personId);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
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
        case IdentityTypeEnum.NATIONALID:
          return retrunType === 'label' ? 'BENEFITS.GCC-NIN' : value['id'];

        default:
          return '';
      }
    } else {
      return '';
    }
  }
  closeModal() {
    this.modalService.hide();
  }
}
