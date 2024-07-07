/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LovList, markFormGroupTouched, Person } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EstablishmentConstants, Owner, PersonDetailsFormModel } from '../../../shared';

@Component({
  selector: 'est-owner-dc',
  templateUrl: './owner-dc.component.html',
  styleUrls: ['./owner-dc.component.scss']
})
export class OwnerDcComponent implements OnInit, OnChanges {
  modalRef: BsModalRef;
  personFormDetail = new PersonDetailsFormModel();
  person: Person;
  defaultToSaudi = true;

  @Input() ownerForm: FormGroup;
  @Input() owner: Owner;
  @Input() nationalityList$: Observable<LovList>;
  @Input() genderList$: Observable<LovList>;
  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;
  @Input() isGCC: boolean;
  @Input() index: number;
  @Input() showDelete = true;
  @Input() hasDateFields = false; // For owner : start date and end date is required in change establishment
  @Input() maxStartDate = new Date();
  @Input() isEndDateMandatory = false;
  @Input() minStartDate: Date;
  @Input() showEndDate = false;
  @Input() personOwnerBirthDate: Date = new Date();

  @Output() deleteEvent: EventEmitter<null> = new EventEmitter();
  @Output() verifyEvent: EventEmitter<null> = new EventEmitter();
  @Output() saveEvent: EventEmitter<null> = new EventEmitter();
  @Output() updateEvent: EventEmitter<null> = new EventEmitter();
  @Output() resetEvent: EventEmitter<null> = new EventEmitter();
  @Output() formInvalid: EventEmitter<null> = new EventEmitter();

  @ViewChild(AddressDcComponent) addressCmp: AddressDcComponent;

  constructor(readonly bsModalService: BsModalService) {}

  ngOnInit(): void {
    this.bindPersonToPersonFormModel();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.owner && changes.owner.currentValue) {
      this.bindPersonToPersonFormModel();
    }
  }

  bindPersonToPersonFormModel() {
    this.person = this.owner.person;
    if (this.isGCC) {
      this.defaultToSaudi = false;
    } else {
      if (EstablishmentConstants.GCC_NATIONAL.includes(this.person.nationality?.english)) {
        this.defaultToSaudi = false;
      } else {
        this.defaultToSaudi = true;
      }
    }

    this.personFormDetail.fromJsonToObject(this.owner.person);
    if (this.owner.startDate?.gregorian) {
      this.personFormDetail.startDate.gregorian = new Date(this.owner.startDate.gregorian);
    }
    if (this.owner.endDate?.gregorian) {
      this.personFormDetail.endDate.gregorian = new Date(this.owner.endDate.gregorian);
    }
  }

  /**
   * Method to show the confirm the owner delete transaction
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  hideModal() {
    this.modalRef.hide();
  }

  /**
   * Method to verify the owner
   */
  verify() {
    markFormGroupTouched(this.ownerForm.get('search') as FormGroup);
    if (this.ownerForm.get('search').valid) {
      this.verifyEvent.emit();
    } else {
      this.formInvalid.emit();
    }
  }

  /**
   * Method to save the owner
   */
  saveOwner() {
    markFormGroupTouched(this.ownerForm);
    if (
      this.ownerForm.get('person').valid &&
      this.ownerForm.get('contactDetail').valid &&
      this.addressCmp.getAddressValidity()
    ) {
      this.saveEvent.emit();
    } else {
      this.formInvalid.emit();
    }
  }

  /**
   * Method to set isSaved status to false if there has been changes after save
   */
  setModifiedAsTrue() {
    if (this.ownerForm.get('isSaved').value === true) {
      this.ownerForm.get('hasModified').setValue(true);
      this.ownerForm.get('modificationSaved').setValue(false);
    }
  }

  updateDates() {
    const isStartDateValid = this.ownerForm.get('person')?.get('startDate')?.get('gregorian')
      ? this.ownerForm.get('person')?.get('startDate')?.get('gregorian')?.valid
      : true;
    const isEndDateValid = this.ownerForm.get('person')?.get('endDate')?.get('gregorian')
      ? this.ownerForm.get('person')?.get('endDate')?.get('gregorian')?.valid
      : true;
    if (isStartDateValid && isEndDateValid) {
      this.updateEvent.emit();
    } else {
      this.formInvalid.emit();
    }
  }

  /**
   * Method to delete owner
   */
  confirmDelete() {
    this.deleteEvent.emit();
    this.hideModal();
  }
  /**
   * Method to emit reset event
   */
  resetEventDetails() {
    this.resetEvent.emit();
  }
}
