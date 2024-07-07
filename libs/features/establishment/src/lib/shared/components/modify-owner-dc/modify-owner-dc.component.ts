/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  CommonIdentity,
  getIdentityByType,
  GosiCalendar,
  LanguageToken,
  maxDateValidator,
  minDateValidator,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ActionTypeEnum } from '../../enums';
import { Owner } from '../../models';

@Component({
  selector: 'est-modify-owner-dc',
  templateUrl: './modify-owner-dc.component.html',
  styleUrls: ['./modify-owner-dc.component.scss']
})
export class ModifyOwnerDcComponent extends BaseComponent implements OnInit, AfterViewInit {
  removed = ActionTypeEnum.REMOVE;
  add = ActionTypeEnum.ADD;
  edit = ActionTypeEnum.MODIFY;
  isActive = false;
  active = 'ESTABLISHMENT.ACTIVE';
  inactive = 'ESTABLISHMENT.INACTIVE';
  lang = 'en';
  minStartDate = new Date();
  maxStartDate = new Date();
  minEndDate = new Date();
  maxEndDate = new Date();
  currentDate = new Date();

  @Input() owner: Owner;
  @Input() estStartDate: GosiCalendar;
  @Input() ownerStartDate: GosiCalendar;
  @Input() ownerEndDate: GosiCalendar;
  @Input() index = 0;

  @Input() viewOnly = true;
  @Input() parentForm: FormArray;
  @Input() canDelete = true;
  @Input() canChoose = false;
  @Input() disableStartDate = false;
  @Input() disableEndDate = false;
  @Input() showEndDate = true;
  @Input() showRemovedInfo = false;

  @Output() selectedForDelete: EventEmitter<boolean> = new EventEmitter();
  @Output() periodChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedOwner: EventEmitter<Owner> = new EventEmitter();

  identity: CommonIdentity;
  ownerDetailsForm: FormGroup;
  ownerUnEdited: Owner;

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  ngOnInit() {
    if (this.owner?.person != null) {
      this.ownerUnEdited = new Owner().bindToNewInstance({
        ...this.owner,
        startDate: { gregorian: this.owner.startDate?.gregorian, hijiri: this.owner.startDate?.hijiri },
        endDate: { gregorian: this.owner.endDate?.gregorian, hijiri: this.owner.endDate?.hijiri }
      });
      this.identity = getIdentityByType(this.owner.person.identity, this.owner.person.nationality.english);
      this.identity.idType = 'ESTABLISHMENT.' + this.identity.idType;

      if (!this.viewOnly) {
        this.ownerDetailsForm = this.createOwnerDetailsForm(this.estStartDate?.gregorian);
        this.bindDatesToForm();
        if (this.parentForm) {
          this.parentForm.push(this.ownerDetailsForm);
        }
      }
    }
    this.checkOwnerIsActive(this.owner);

    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngAfterViewInit() {
    if (!this.viewOnly) {
      this.checkForModify();
    }
  }

  bindDatesToForm() {
    this.ownerDetailsForm.patchValue({
      startDate: {
        gregorian: this.owner.startDate ? new Date(this.owner.startDate.gregorian) : null
      },
      endDate: {
        gregorian: this.owner.endDate ? new Date(this.owner.endDate.gregorian) : null
      },
      person: this.owner.person,
      recordAction: this.owner.recordAction
    });
  }

  /**
   * Method to check if owner has been modified
   */
  checkForModify() {
    this.ownerDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(200), distinctUntilChanged())
      .subscribe(val => {
        if (val.startDate.gregorian !== undefined && val.endDate.gregorian !== undefined) {
          const startDate = this.ownerUnEdited?.startDate?.gregorian
            ? new Date(this.ownerUnEdited.startDate.gregorian)
            : null;
          const endDate = this.ownerUnEdited?.endDate?.gregorian
            ? new Date(this.ownerUnEdited.endDate.gregorian)
            : null;
          if (
            this.checkDateChanged(startDate, val.startDate.gregorian) ||
            this.checkDateChanged(endDate, val.endDate.gregorian)
          ) {
            this.ownerDetailsForm.get('recordAction').patchValue(ActionTypeEnum.MODIFY, { emitEvent: false });
            this.owner.recordAction = ActionTypeEnum.MODIFY;
            if (val.startDate?.gregorian) {
              this.owner.startDate = val.startDate;
              this.owner.startDate.gregorian = startOfDay(this.owner.startDate.gregorian);
            } else {
              if (this.owner.startDate) {
                this.owner.startDate.gregorian = undefined;
              }
            }
            if (val.endDate?.gregorian) {
              this.owner.endDate = val.endDate;
              this.owner.endDate.gregorian = startOfDay(this.owner.endDate.gregorian);
            } else {
              if (this.owner.endDate) {
                this.owner.endDate = null;
              }
            }

            this.periodChanged.emit(true);
          }
          if (
            !this.checkDateChanged(startDate, val.startDate.gregorian) &&
            !this.checkDateChanged(endDate, val.endDate.gregorian)
          ) {
            this.ownerDetailsForm.get('recordAction').patchValue(null, { emitEvent: false });
            this.owner.recordAction = null;
            this.owner.startDate = {
              gregorian: this.ownerUnEdited.startDate?.gregorian,
              hijiri: this.ownerUnEdited.startDate?.hijiri
            };
            this.owner.endDate = {
              gregorian: this.ownerUnEdited.endDate?.gregorian,
              hijiri: this.ownerUnEdited.endDate?.hijiri
            };
            this.periodChanged.emit(true);
          }
        }
      });
  }

  /**
   *
   * @param currentDate Method to check the two dates are equal or not
   * @param newDate
   */
  checkDateChanged(currentDate: Date, newDate: Date): boolean {
    if (currentDate) {
      if (moment(currentDate).isSame(newDate, 'day')) {
        return false;
      } else {
        return true;
      }
    } else if (currentDate == null && newDate == null) {
      return false;
    } else {
      return true;
    }
  }

  createOwnerDetailsForm(estStartDate: Date) {
    this.maxStartDate = this.currentDate;
    this.maxEndDate = moment().subtract(1, 'days').toDate();

    this.minStartDate = startOfDay(estStartDate);
    this.minEndDate = this.minStartDate;

    return this.fb.group({
      startDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([
              Validators.required,
              minDateValidator(this.minStartDate),
              maxDateValidator(this.maxStartDate)
            ]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      endDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([minDateValidator(this.minEndDate), maxDateValidator(this.maxEndDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      person: null,
      recordAction: null
    });
  }

  removeOwner(): void {
    this.owner.recordAction = this.removed;
    if (!this.viewOnly) {
      this.ownerDetailsForm.patchValue(
        {
          startDate: {
            gregorian: this.ownerUnEdited.startDate?.gregorian ? new Date(this.ownerUnEdited.startDate.gregorian) : null
          },
          endDate: {
            gregorian: this.ownerUnEdited.endDate?.gregorian ? new Date(this.ownerUnEdited.endDate.gregorian) : null
          }
        },
        { emitEvent: false }
      );
    }

    this.selectedForDelete.emit(true);
  }

  unSelectOwner(): void {
    this.owner.recordAction = null;
    this.selectedForDelete.emit(false);
  }

  choseOwner(): void {
    if (this.canChoose && this.isActive) {
      if (this.owner.recordAction !== this.add) {
        this.selectedOwner.emit(this.owner);
        this.owner.recordAction = this.add;
      }
    }
  }

  /**
   * Method to check if owner is active or not
   * @param owner
   */
  checkOwnerIsActive(owner: Owner): void {
    if (owner.endDate && owner.endDate.gregorian) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }
}
