/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Input, Output, EventEmitter, Directive, TemplateRef } from '@angular/core';
import { BaseComponent, CommonIdentity, GosiCalendar, LovList, BilingualText } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import moment from 'moment';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getIdRemoveNullValue } from '../../utils';
import { BenefitValues, HeirStatus, Status } from '../../enum';
import {
  RequestEventType,
  AddEvent,
  EventResponseDto,
  HeirEvent,
  DependentDetails,
  TableHeadingAndParamName,
  ValidateRequest,
  AgeInNewLaw,
  SystemParameter
} from '../../models';
import { Observable } from 'rxjs';

@Directive()
export abstract class ListPersonBaseComponent extends BaseComponent {
  /**
   * Input Variables
   */
  @Input() sin: number;
  @Input() showStatus = false;
  @Input() listOfValues: DependentDetails[];
  @Input() tableHeadingAndParams: TableHeadingAndParamName[];
  @Input() lang = 'en';
  // @Input() highlightInvalid = false;
  @Input() isHeir = false;
  @Input() isAppPrivate: boolean;
  @Input() parentForm: FormGroup;
  @Input() isValidator = false;
  @Input() isModifyPage = false;
  @Input() benefitStartDate: GosiCalendar; // For now Dependent only
  @Input() addedEvent: AddEvent;
  @Input() validateApiResponse: ValidateRequest;
  @Input() bankName: BilingualText;
  @Input() isPension = false;
  @Input() requestDate: GosiCalendar;
  @Input() events: EventResponseDto = new EventResponseDto();
  @Input() reasonsList: LovList;
  @Input() ageInNewLaw: AgeInNewLaw[] = [];
  @Input() heirActionType: string;
  @Input() isDraft = false;
  @Input() eligibilityStartDate: GosiCalendar;
  @Input() systemParameter: SystemParameter;
  @Input() listYesNo$ = new Observable<LovList>();

  /**
   * Output Variables
   */
  @Output() isThisAgeInNewLaw: EventEmitter<AgeInNewLaw[]> = new EventEmitter<AgeInNewLaw[]>();
  @Output() delete: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() edit: EventEmitter<number> = new EventEmitter();
  @Output() resetSearch: EventEmitter<null> = new EventEmitter();
  @Output() getReasonForModification = new EventEmitter();
  @Output() addEvent: EventEmitter<RequestEventType> = new EventEmitter();
  @Output() showIneligibilityDetails: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getBankName: EventEmitter<number> = new EventEmitter();
  @Output() getBankNameIban: EventEmitter<{ id: number; index: number }> = new EventEmitter();
  @Output() getEvents: EventEmitter<number> = new EventEmitter();
  @Output() getBankDetailsEvent: EventEmitter<object> = new EventEmitter();
  @Output() getAuthPerson: EventEmitter<string> = new EventEmitter();
  @Output() getGuardian: EventEmitter<string> = new EventEmitter();

  bsModalRef: BsModalRef;
  checkListValue: FormArray = new FormArray([]);
  status = Status;
  motherDetails: DependentDetails;
  isOpenPopOver: boolean;

  constructor(readonly bsModalService: BsModalService, public fb: FormBuilder) {
    super();
  }

  reset() {
    this.resetSearch.emit();
  }

  /*
   * This method is for edit dependent
   */
  editButtonClick(index: number) {
    if (
      this.isModifyPage &&
      this.systemParameter?.OLD_LAW_DATE &&
      this.eligibilityStartDate?.gregorian &&
      moment(this.eligibilityStartDate?.gregorian).isBefore(moment(this.systemParameter?.OLD_LAW_DATE.toString())) &&
      moment(this.benefitStartDate?.gregorian).isBefore(moment(this.systemParameter?.OLD_LAW_DATE.toString())) &&
      !this.listOfValues[index].newlyUpdated &&
      !this.listOfValues[index].newlyAdded &&
      this.listOfValues.filter(item => {
        return !item.unbornModificationReason && (item.newlyAdded || item.newlyUpdated);
      }).length
    ) {
      this.listOfValues[index]['isOpenPopOver'] = true;
    } else {
      this.edit.emit(index);
      this.listOfValues.forEach((items, i) => {
        if (i !== index) {
          items.showBorder = false;
        }
      });
      if (this.listOfValues[index].relationship?.english === BenefitValues.unborn) {
        this.motherDetails = this.listOfValues.filter(obj => obj.personId === this.listOfValues[index].motherId)[0];
      }
      this.listOfValues[index].showBorder = !this.listOfValues[index].showBorder;
    }
  }

  checkIfAgeOrId(person: DependentDetails, paramName: string) {
    let value = null;
    if (paramName === 'age' || paramName === 'ageWithDob') {
      let age = 0;
      const birthdate = moment(person.birthDate?.gregorian);
      if (person.gregorianAge) {
        age = person.gregorianAge;
      } else if (person.birthDate) {
        const thisDay = moment();
        age = thisDay.diff(birthdate, 'years');
      }
      if (person.birthDate && age.toString() !== 'NaN') {
        value = paramName === 'age' ? age : `${birthdate.format('DD/MM/yyyy')}(${age})`;
      }
    } else if (paramName === 'id') {
      // if (person.nin) {
      //   value = person.nin.newNin;
      // }
      if (person.identity) {
        const idObj: CommonIdentity | null = getIdRemoveNullValue(person.identity);
        // value = idObj && idObj.idType === IdentityTypeEnum.NIN ? idObj.id : '-';
        value = idObj ? idObj.id : '-';
      }
    } else if (paramName === 'statusAfterValidation' && this.isModifyPage && this.isHeir) {
      value = person[paramName]?.english === BenefitValues?.noneligible ? person[paramName] : '-';
    } else {
      value =
        person[paramName] && person[paramName]?.gregorian
          ? moment(person[paramName]?.gregorian).format('DD/MM/yyyy')
          : person[paramName] || '-';
    }

    return value;
  }

  displayHijiriDOB(person: DependentDetails, paramName: string) {
    let value = null;
    if (paramName === 'ageWithDob') {
      let age = 0;
      const birthdate = moment(person.birthDate?.gregorian);
      if (person.age) {
        age = person.age;
      } else if (person.birthDate || person.ageInHijiri) {
        const thisDay = moment();
        age = person.ageInHijiri ? person.ageInHijiri : thisDay.diff(birthdate, 'years');
      }
      if (person.birthDate?.hijiri) {
        value = `${person.birthDate?.hijiri?.split('-').reverse().join('/')}(${age.toString() !== 'NaN' ? age : person?.ageOnEligibilityDate})`;
      }
    }
    return value;
  }

  /*
   * This method is for delete dependent
   */
  deleteButtonClick(index: number) {
    this.delete.emit(this.listOfValues[index]);
    if (this.bsModalRef) {
      this.clearModal();
    }
  }

  /**
   * Method to show modal
   * @param template
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.bsModalService.show(modalRef, config);
  }

  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef?.hide();
  }

  /**
   * Used in both dependent and heir listing dc so both status date and waive should be available
   * Heir(status date and waive)
   * Dependent (status date)
   * @param isValidator
   * @param heirBenefit
   * @param actionType No need for dependents as individual edit not available only single pension edit
   */
  createFormData(isValidator: boolean, heirBenefit = false, actionType?: string): FormArray {
    const checkListValue: FormArray = new FormArray([]);
    for (let i = 0; i < this.listOfValues.length; i++) {
      if (isValidator) {
        let preSelectedFormValue: FormGroup;
        if (actionType === HeirStatus.START_WAIVE || actionType === HeirStatus.STOP_WAIVE) {
          preSelectedFormValue = this.fb.group({
            action: actionType,
            notes: [this.listOfValues[i].notes, Validators.required]
          });
          if (actionType === HeirStatus.START_WAIVE) {
            preSelectedFormValue.addControl(
              'startDate',
              this.fb.group({
                gregorian: [moment(this.listOfValues[i]?.statusDate?.gregorian).toDate(), Validators.required],
                hijiri: [this.listOfValues[i]?.statusDate?.hijiri]
              })
            );
            if (heirBenefit && this.listOfValues[i]?.benefitWaivedTowards) {
              preSelectedFormValue.addControl(
                'benefitWaivedTowards',
                this.fb.group({
                  english: [this.listOfValues[i].benefitWaivedTowards.english, Validators.required],
                  arabic: [this.listOfValues[i].benefitWaivedTowards.arabic]
                })
              );
            }
          } else {
            // Stop Waive
            preSelectedFormValue.addControl(
              'stopDate',
              this.fb.group({
                gregorian: [moment(this.listOfValues[i].statusDate?.gregorian).toDate(), Validators.required],
                hijiri: [this.listOfValues[i].statusDate?.hijiri]
              })
            );
          }
          if (heirBenefit) {
            preSelectedFormValue = this.fb.group({
              waiveBenefit: preSelectedFormValue
            });
          }
        } else {
          preSelectedFormValue = this.fb.group({
            statusChange: this.fb.group({
              reasonSelect: this.listOfValues[i].reasonForModification,
              statusDate: this.listOfValues[i].statusDate
                ? {
                    gregorian: this.listOfValues[i].statusDate.gregorian
                      ? moment(this.listOfValues[i].statusDate.gregorian).toDate()
                      : '',
                    hijiri: this.listOfValues[i].statusDate.hijiri || ''
                  }
                : new GosiCalendar(),
              reasonNotes: this.listOfValues[i].notes,
              paymentDetailsUpdated: this.listOfValues[i].paymentDetailsUpdated
            })
          });
        }

        const modifyStatusControl = this.createCheckForm();
        modifyStatusControl.get('checkBoxFlag').patchValue(this.listOfValues[i]?.notes ? true : false);
        modifyStatusControl.removeControl('eachPerson');
        modifyStatusControl.addControl('eachPerson', preSelectedFormValue);
        checkListValue.push(modifyStatusControl);
        if (modifyStatusControl.get('checkBoxFlag').value) this.checkStatusEditable(i);
      } else {
        checkListValue.push(this.createCheckForm());
      }
    }
    return checkListValue;
  }

  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [
        {
          value: false,
          disabled: false
        }
      ],
      eachPerson: this.fb.group({})
    });
  }

  checkStatusEditable(index: number, personId?: number) {
    this.getReasonForModification.emit(index);
    if (this.heirActionType === HeirStatus.RESTART) {
      this.getBankDetailsEvent.emit({ index: index, personId: personId });
    }
  }

  showIneligibilityReasons(details: DependentDetails) {
    this.showIneligibilityDetails.emit(details);
  }

  getBankNameForId(id: number) {
    this.getBankName.emit(id);
  }

  getBankNameForIban(id: number, index: number) {
    this.getBankNameIban.emit({ id: id, index: index });
  }

  getClass(value: DependentDetails, lang: string) {
    // if (lang === 'en') {
    //   if (value.showGreenBorder || value?.eligibilityStatus?.english === Status.ACTIVE) {
    //     return value.editable ? 'border-green-ltr-editMode' : 'border-green-ltr';
    //   } else if (value.status?.english !== Status.ACTIVE || value.showBorder) {
    //     return value.editable ? 'border-red-ltr-editMode' : 'border-red-ltr';
    //   }
    // } else {
    //   if (value.showGreenBorder || value?.eligibilityStatus?.english === Status.ACTIVE) {
    //     return value.editable ? 'border-green-rtl-editMode' : 'border-green-rtl';
    //   } else if (value.status?.english !== Status.ACTIVE || value.showBorder) {
    //     return value.editable ? 'border-red-rtl-editMode' : 'border-red-rtl';
    //   }
    // }
    // commented as per above implmentation and defect 469711
    // if (value.showBorder) {
    //   //No border required for any other scenario
    //   if (lang === 'en') {
    //     return value.editable ? 'border-red-ltr-editMode' : 'border-red-ltr';
    //   } else {
    //     return value.editable ? 'border-red-rtl-editMode' : 'border-red-rtl';
    //   }
    // }
  }

  addEventPopup(event: RequestEventType) {
    this.addEvent.emit(event);
  }

  getAuthPersonForId(personId: string) {
    this.getAuthPerson.emit(personId);
  }

  getGuardianForId(personId: string) {
    this.getGuardian.emit(personId);
  }
}
