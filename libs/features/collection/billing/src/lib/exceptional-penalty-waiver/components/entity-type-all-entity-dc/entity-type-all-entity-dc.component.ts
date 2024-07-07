/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { LovList, markFormGroupTouched, BilingualText, Lov, LanguageToken } from '@gosi-ui/core';
import { BillingConstants } from '../../../shared/constants';
import { map } from 'rxjs/operators';

@Component({
  selector: 'blg-entity-type-all-entity-dc',
  templateUrl: './entity-type-all-entity-dc.component.html',
  styleUrls: ['./entity-type-all-entity-dc.component.scss']
})
export class EntityTypeAllEntityDcComponent implements OnInit {
  entitySegmentForm: FormGroup;
  lang = '';
  otherReasonFlag = false;
  heading: BilingualText;

  @Input() penalityWaiverReason: Observable<LovList>;

  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() segmentListValue: EventEmitter<string> = new EventEmitter();
  @Output() processFileEst: EventEmitter<File> = new EventEmitter<File>();
  @Output() processFileVic: EventEmitter<File> = new EventEmitter<File>();
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  // Method used to initailise the task
  ngOnInit(): void {
    this.entitySegmentForm = this.createEntitySegmentForm();
    this.language.subscribe(language => {
      this.lang = language;
      this.penalityWaiverReason = this.sortLovList(this.penalityWaiverReason, true);
    });
  }
  // Method to create form
  createEntitySegmentForm() {
    return this.fb.group({
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      ReasonOthers: [null]
    });
  }
  // Method used to get text field on other value select
  otherValueSelect() {
    const otherField = this.entitySegmentForm.get('reason').get('english');
    if (otherField.value === 'Other') {
      this.otherReasonFlag = true;
      this.entitySegmentForm.get('ReasonOthers').setValidators([Validators.required, Validators.maxLength(200)]);
    } else if (otherField.value !== 'Other') {
      this.otherReasonFlag = false;
      this.entitySegmentForm.get('ReasonOthers').setValidators(null);
      this.entitySegmentForm.get('ReasonOthers').updateValueAndValidity();
    }
  }
  // Method used toverfy the details entered
  verifyDetails() {
    markFormGroupTouched(this.entitySegmentForm);
    if (this.entitySegmentForm.valid) {
      this.verify.emit({
        searchOption: 'entityType',
        reason: this.entitySegmentForm.get('reason').value,
        otherReason: this.entitySegmentForm.get('ReasonOthers').value,
        entitySegment: { english: 'All', arabic: 'All' }
      });
    } else {
      this.error.emit();
    }
  }
  // Method used to reset the initial values on reset action
  resetForm() {
    this.reset.emit();
  }

  handleCsvUpload() {}
  // Method used to sort the lov lists
  sortLovList(list: Observable<LovList>, otherFlag: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.sortLovListForAllEntity(res, otherFlag, this.lang);
          }
        })
      );
    }
  }
  // Method used to sort the lov list values
  sortLovListForAllEntity(lovList: LovList, otherFlag: boolean, lang: string) {
    let otherExcludedLists: Lov[];
    let other: Lov;
    if (otherFlag) {
      other = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      otherExcludedLists = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) === -1);
      lovList.items = this.sortItemsForAllEntity(otherExcludedLists, lang);
      lovList.items.push(other);
    } else {
      lovList.items = this.sortItemsForAllEntity(lovList.items, lang);
    }
    return { ...lovList };
  }
  // Method used to sort the lov list values based on language
  sortItemsForAllEntity(list: Lov[], lang: string) {
    if (lang === 'en') {
      list.sort((a1, a2) =>
        a1.value.english
          .toLowerCase()
          .replace(/\s/g, '')
          .localeCompare(a2.value.english.toLowerCase().replace(/\s/g, ''))
      );
    } else {
      list.sort((a1, a2) => a1.value.arabic.localeCompare(a2.value.arabic));
    }

    return list;
  }
}
