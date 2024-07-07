/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { GosiCalendar, NationalityTypeEnum } from '@gosi-ui/core';
import { FormGroup } from '@angular/forms';
import { SearchPerson } from '../../models';
import { map } from 'rxjs/operators';
import { SearchPersonComponent } from '../base';
import { CalendarHijiriGregorianDcComponent } from '../calendar-hijiri-gregorian-dc/calendar-hijiri-gregorian-dc.component';
import moment from 'moment-timezone';

@Component({
  selector: 'bnt-search-person-dc',
  templateUrl: './search-person-dc.component.html',
  styleUrls: ['./search-person-dc.component.scss']
})
export class SearchPersonDcComponent extends SearchPersonComponent implements OnInit {
  // @Input() labelHeading = 'BENEFITS.ADD-NEW-HEIR';
  @Input() calenderLabel = 'BENEFITS.DATE-OF-BIRTH';
  @Input() systemRunDate: GosiCalendar;
  @Input() showCancel = true;
  @Input() showVerify = true;
  @Input() isUnborn = false;
  @Input() parentForm: FormGroup;
  @Input() idValue = 'search-person';
  @Input() ninLabel = 'BENEFITS.NIN';
  @Input() nationalityLabel = 'BENEFITS.NATIONALITY';
  @Input() iqamaLabel = 'BENEFITS.IQAMA-NUMBER';
  @Input() gccLabel = 'BENEFITS.GCC-NIN';
  @Input() passPortLabel = 'BENEFITS.PASSPORT-NO';
  @Input() defaultRequestDate: GosiCalendar;
  @Input() disableVerify = false;

  @Output() searchPerson: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() getGenderDetails: EventEmitter<null> = new EventEmitter();
  @Output() getDobHeir: EventEmitter<null> = new EventEmitter();

  @ViewChild('calenderDcComponent')
  calenderDcComponent: CalendarHijiriGregorianDcComponent;

  isSmallScreen: boolean;

  ngOnInit(): void {
    this.initializeForms();
    if (this.parentForm) {
      // if (this.parentForm.get('search') && this.parentForm.get('search').value) {
      //   this.searchForm.patchValue(this.parentForm.get('search').value);
      //   this.parentForm.removeControl('search');
      //   this.parentForm.addControl('search', this.searchForm);
      // } else {
      //   this.parentForm.addControl('search', this.searchForm);
      // }
      if (this.parentForm.get('search')) this.parentForm.removeControl('search');
      this.parentForm.addControl('search', this.searchForm);
    }
    this.nationalityList$.pipe(
      map(nationalities =>
        nationalities.items.filter(nationality => nationality.value.english !== NationalityTypeEnum.MIXED_NATIONAL)
      )
    );
  }

  search() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.valid && !this.disableVerify) {
      const searchPersonValues: SearchPerson = this.searchForm.getRawValue();
      searchPersonValues.isUnborn = this.isUnborn;
      this.searchPerson.emit(searchPersonValues);
    } else {
      this.searchForm.get('dob').markAllAsTouched();
    }
  }

  cancel() {
    this.close.emit();
  }
  getGender(data) {
    this.getGenderDetails.emit(data);
  }
  dateChanged(data) {
    this.getDobHeir.emit(data);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }
}
