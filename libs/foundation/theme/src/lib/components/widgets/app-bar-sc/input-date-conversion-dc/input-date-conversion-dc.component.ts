import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CalendarService,
  convertToYYYYMMDD,
  parseToHijiri,
  hijiriToJSON,
  LanguageToken,
  LovList,
  StorageService,
  Tab
} from '@gosi-ui/core';
import { DropDownItems } from '@gosi-ui/features/contributor';
import { InputDropdownDateDcComponent } from '../../input-dropdown-date-dc/input-dropdown-date-dc.component';
import moment from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { parse } from '@fortawesome/fontawesome-svg-core';
enum WeekDay {
  'THEME.SUNDAY' = 1,
  'THEME.MONDAY' = 2,
  'THEME.TUESDAY' = 3,
  'THEME.WEDNESDAY' = 4,
  'THEME.THURSDAY' = 5,
  'THEME.FRIDAY' = 6,
  'THEME.SATURDAY' = 7
}
@Component({
  selector: 'gosi-input-date-conversion-dc',
  templateUrl: './input-date-conversion-dc.component.html',
  styleUrls: ['./input-date-conversion-dc.component.scss']
})
export class InputDateConversionDcComponent implements OnInit {
  viewMode = 'converter';
  dropDownForm: FormGroup;
  converterViewFlag: boolean = true;
  tabs: any = [];
  isOpen: any = false;
  @ViewChild('fromdate') fromDate: InputDropdownDateDcComponent;
  @ViewChild('todate') toDate: InputDropdownDateDcComponent;
  @Input() dateList: any[];
  @Input() daysList: any[];
  selectedId: any;
  converter: boolean = true;
  days: boolean;
  viewModeTo = 'hijiri';
  hirijiFrom: boolean = true;
  hijiriTo: boolean = true;
  billPeriodFormYear: FormGroup;
  billPeriodFormMonth: FormGroup;
  @Output() submitData: EventEmitter<any> = new EventEmitter();
  @Output() onCalculate: EventEmitter<any> = new EventEmitter();
  @Output() clearEvent: EventEmitter<any> = new EventEmitter();
  minDateHij: string;
  maxDateHij: string;
  maxDateGreg = new Date('2077/11/15');
  conversionList: any[] = [];
  currentIndex = 0;
  isShowCard: boolean = false;
  monthList: LovList;
  yearList: LovList;
  gregYearList: LovList;
  month: any;
  year: any;
  conversionDaysList: any[];
  isShowDaysCard: boolean = false;
  selectedMonthsArray: any[] = [];
  monthsValueList: any;
  currentIndexDay = 0;
  gregMonthList: LovList;
  viewModeDate = 'converter';
  greMonthForm: FormGroup;
  greYearForm: FormGroup;
  gregMonth: any;
  isClear: boolean = false;
  minGreDate = new Date('1900/05/01');
  isMindate: boolean;
  lang: any;
  isExpand: boolean = false;
  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly storageService: StorageService,
    private datePipe: DatePipe,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    //this.maxDateGreg = '15/11/2077';
    this.maxDateHij = '15/11/2077';
    this.minDateHij = '01/01/1318';
    this.selectedId = 1;
    this.billPeriodFormYear = this.createHijiriFormYear();
    this.billPeriodFormMonth = this.createHijiriFormMonth();
    this.greMonthForm = this.greFormMonth();
    this.greYearForm = this.greFormYear();
    this.dropDownForm = this.createDropDownForm();
    const conversion = this.storageService.getLocalValue('conversionList');
    this.conversionList = JSON.parse(conversion);
    if (this.conversionList?.length > 0) {
      this.conversionList = this.conversionList.map(obj => ({
        ...obj,
        weekDayName: WeekDay[obj.dayofWeek]
      }));
      this.isShowCard = true;
    }

    this.getStorageValueDays();
    if (this.conversionDaysList?.length > 0) {
      this.getStorageValueMonths();
      this.isShowDaysCard = true;
    }
    //this.dropDownForm?.get('fromDate')?.get('hijiri')?.setValue(null);
    this.tabs = [
      { id: 1, label: 'CONVERTER' },
      { id: 2, label: 'DAYSINMONTH' }
    ];
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.setHijriYearList();
    this.setGregYearList();
    this.showCard(this.currentIndex);

    const item = [
      {
        value: { english: 'Muharram', arabic: 'محرم' },
        sequence: 1
      },
      {
        value: { english: 'Safar', arabic: 'صفر' },
        sequence: 2
      },
      {
        value: { english: 'Rabi’ al-Awwal', arabic: 'ربيع الأول ' },
        sequence: 3
      },
      {
        value: { english: 'Rabi’ al-Thani', arabic: 'ربيع الثاني' },
        sequence: 4
      },
      {
        value: { english: 'Jumada Al-Awwal', arabic: ' جمادي الأول' },
        sequence: 5
      },
      {
        value: { english: 'Jumada Al-Thani', arabic: ' جمادي الثاني' },
        sequence: 6
      },
      {
        value: { english: 'Rajab', arabic: 'رجب ' },
        sequence: 7
      },
      {
        value: { english: 'Sha’ban', arabic: 'شعبان ' },
        sequence: 8
      },
      {
        value: { english: 'Ramadan', arabic: 'رمضان' },
        sequence: 9
      },
      {
        value: { english: 'Shawwal', arabic: 'شوال ' },
        sequence: 10
      },
      {
        value: { english: 'Dhul Qa’dah ', arabic: 'ُذو القعدة' },
        sequence: 11
      },
      {
        value: { english: 'Dhul Hijjah', arabic: 'ذو الحجة' },
        sequence: 12
      }
    ];
    this.monthList = new LovList(item);
    const items = [
      {
        value: { english: 'January', arabic: 'يناير' },
        sequence: 1
      },
      {
        value: { english: 'February', arabic: 'فبراير' },
        sequence: 2
      },
      {
        value: { english: 'March', arabic: 'مارس' },
        sequence: 3
      },
      {
        value: { english: 'April', arabic: 'أبريل' },
        sequence: 4
      },
      {
        value: { english: 'May', arabic: 'مايو' },
        sequence: 5
      },
      {
        value: { english: 'June', arabic: 'يونيو' },
        sequence: 6
      },
      {
        value: { english: 'July', arabic: 'يوليو' },
        sequence: 7
      },
      {
        value: { english: 'August', arabic: 'أغسطس' },
        sequence: 8
      },
      {
        value: { english: 'September', arabic: 'سبتمبر' },
        sequence: 9
      },
      {
        value: { english: 'October', arabic: 'أكتوبر' },
        sequence: 10
      },
      {
        value: { english: 'November', arabic: 'نوفمبر' },
        sequence: 11
      },
      {
        value: { english: 'December ', arabic: 'ديسمبر' },
        sequence: 12
      }
    ];
    this.gregMonthList = new LovList(items);
  }
  copyTo(text: any) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    //navigator.clipboard.writeText(tempInput.value);
    document.body.removeChild(tempInput);
  }
  getStorageValueDays() {
    const conversionDays = this.storageService.getLocalValue('conversionDaysList');
    this.conversionDaysList = JSON.parse(conversionDays);
  }
  selectedMonth(event) {
    const item = this.monthList.items.find(val => val.value.english == event);
    this.month = item?.sequence;
  }

  hijiriDateFormat(date) {
    if (date != null) {
      const dateArr = date?.split('-');
      const year = parseInt(dateArr[0], null);
      let day = dateArr[2];
      if (day.length < 2) {
        day = '0' + day;
      }
      let month = dateArr[1];
      if (month.length < 2) {
        month = '0' + month;
      }
      return day + '/' + month + '/' + year;
    }
  }
  gregorianDateFormat(date: any) {
    if (this.lang == 'en') {
      let value = moment(date).format('DD/MM/YYYY');
      return value;
    } else {
      let value = moment(date).format('YYYY/MM/DD');
      return value;
    }
  }
  selectedMonthGreg(event) {
    const item = this.gregMonthList.items.find(val => val.value.english == event);
    this.gregMonth = item?.sequence;
  }
  selectedYear(event) {
    this.year = event;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.dateList && changes.dateList?.currentValue) {
      this.conversionList = changes.dateList?.currentValue;
      if (this.conversionList?.length > 0) {
        this.conversionList = this.conversionList.map(obj => ({
          ...obj,
          weekDayName: WeekDay[obj.dayofWeek]
        }));

        this.isShowCard = true;
      }
    }
    if (changes && changes.daysList && changes.daysList?.currentValue) {
      this.conversionDaysList = changes.daysList?.currentValue;
      if (this.conversionDaysList?.length > 0) {
        this.isShowDaysCard = true;
      }

      if (this.conversionDaysList?.length < 1) {
        this.isExpand = false;
      }
    }
  }
  getStorageValueMonths() {
    const monthsList = this.storageService.getLocalValue('selectedMonthsArray');
    this.monthsValueList = JSON.parse(monthsList);
    this.selectedMonthsArray = this.monthsValueList;
  }
  showCard(index: number) {
    this.currentIndex = index;
  }

  onLeftCLick() {
    if (this.currentIndex > 0) {
      this.showCard(this.currentIndex - 1);
    }
  }
  onRightCLick() {
    if (this.currentIndex < this.conversionList.length - 1) {
      this.showCard(this.currentIndex + 1);
    }
  }
  onLeftCLickDays() {
    if (this.currentIndexDay > 0) {
      this.currentIndexDay = this.currentIndexDay - 1;
    }
  }
  onRightCLickDays() {
    if (this.currentIndex < this.monthsValueList.length - 1) {
      this.currentIndexDay = this.currentIndexDay + 1;
    }
  }
  durationViewChange(val: string) {
    //  this.dropDownForm=this.createDropDownForm()
    this.dropDownForm.get('fromDate')?.get('hijiri')?.setValue(null);
    this.dropDownForm.get('fromDate')?.get('gregorian')?.setValue(null);

    if (this.dropDownForm.get('fromDate')?.get('gregorian').value == 'Invalid Date') {
      this.dropDownForm.get('fromDate')?.get('gregorian')?.setValue(null);
    }

    this.dropDownForm.markAsUntouched();
    this.dropDownForm.markAsPristine();

    this.viewMode = val;
    if (val === 'converter') {
      this.hirijiFrom = true;
      this.converterViewFlag = true;
      this.viewMode = val;
    } else if (val === 'days') {
      this.converterViewFlag = false;
      this.hirijiFrom = false;

      this.viewMode = val;
    }
  }

  dateViewChange(val: string) {
    this.billPeriodFormYear.get('english').setValue(null);
    this.billPeriodFormMonth.get('english').setValue(null);
    this.greYearForm.get('english').setValue(null);
    this.greMonthForm.get('english').setValue(null);
    this.billPeriodFormMonth.markAsUntouched();
    this.billPeriodFormYear.markAsUntouched();
    this.greYearForm.markAsUntouched();
    this.greMonthForm.markAsUntouched();
    this.viewModeDate = val;
    if (val === 'converter') {
      //this.hirijiFrom = true;
      this.converterViewFlag = true;
      this.viewModeDate = val;
    } else if (val === 'days') {
      this.converterViewFlag = false;
      //  this.hirijiFrom = false;

      this.viewModeDate = val;
    }
  }
  toDateViewChange(val: string) {
    //this.dropDownForm=this.createDropDownForm()
    this.dropDownForm.get('toDate')?.get('hijiri2')?.setValue(null);
    this.dropDownForm.get('toDate')?.get('gregorian')?.setValue(null);

    if (this.dropDownForm.get('toDate')?.get('gregorian').value == 'Invalid Date') {
      this.dropDownForm.get('toDate')?.get('gregorian')?.setValue(null);
    }
    this.dropDownForm.markAsUntouched();
    this.dropDownForm.markAsPristine();
    this.viewModeTo = val;
    if (val === 'hijiri') {
      this.hijiriTo = true;
      this.converterViewFlag = true;
      this.viewModeTo = val;
    } else if (val === 'gregorian') {
      this.hijiriTo = false;

      this.converterViewFlag = false;
      this.viewModeTo = val;
    }
  }
  close(index) {
    // console.log(index,this.conversionList?.length)

    this.conversionList.splice(index, 1);
    this.storageService.setLocalValue('conversionList', JSON.stringify(this.conversionList));
    if (this.currentIndex == this.conversionList?.length) {
      this.onLeftCLick();
    }
    if (this.conversionList.length < 1) {
      this.clearAll();
    }
  }
  closeDays(index) {
    this.conversionDaysList.splice(index, 1);
    this.monthsValueList.splice(index, 1);
    this.storageService.setLocalValue('conversionDaysList', JSON.stringify(this.conversionDaysList));
    this.storageService.setLocalValue('selectedMonthsArray', JSON.stringify(this.monthsValueList));
    if (this.currentIndexDay == this.conversionDaysList?.length) {
      this.onLeftCLickDays();
    }
    if (this.conversionDaysList.length < 1) {
      this.clearAllDays();
    }
  }

  selectTab(id: any) {
    this.dropDownForm = this.createDropDownForm();
    //  this.dropDownForm.setValue(' ')
    this.dropDownForm.markAsUntouched();
    this.dropDownForm.markAsPristine();
    this.billPeriodFormYear = this.createHijiriFormYear();
    this.billPeriodFormMonth = this.createHijiriFormMonth();
    this.greMonthForm = this.greFormMonth();
    this.greYearForm = this.greFormYear();
    this.selectedId = id;
    if (this.selectedId == 1) {
      this.converter = true;
      this.days = false;

      if (this.conversionList == null || this.conversionList.length == 0) {
        this.isExpand = false;
      }
    } else {
      if (this.conversionDaysList == null || this.conversionDaysList.length == 0) {
        this.isExpand = false;
      }

      this.converter = false;
      this.days = true;
    }
  }
  onExpand() {
    this.isExpand = !this.isExpand;
  }
  onCompress() {
    this.isExpand = false;
  }
  onSubmit() {
    const payload = {
      fromGregorian: this.dropDownForm.get('fromDate').value.gregorian
        ? moment(this.dropDownForm.get('fromDate').value.gregorian).format('YYYY-MM-DD')
        : null,
      fromHijiri: this.dropDownForm.get('fromDate').value.hijiri
        ? hijiriToJSON(this.dropDownForm.get('fromDate').value.hijiri)?.toString()
        : null,
      toGregorian: this.dropDownForm.get('toDate').value.gregorian
        ? moment(this.dropDownForm.get('toDate').value.gregorian).format('YYYY-MM-DD')
        : null,
      toHijiri: this.dropDownForm.get('toDate').value.hijiri2
        ? hijiriToJSON(this.dropDownForm.get('toDate').value.hijiri2)?.toString()
        : null,
      notes: this.dropDownForm.get('notes').value ? this.dropDownForm.get('notes').value : null
    };
    this.submitData.emit(payload);
    this.isMindate = false;
    this.dropDownForm.get('toDate').get('hijiri2').clearValidators();
    this.dropDownForm.get('toDate').get('hijiri2').reset();
    this.dropDownForm.get('toDate').get('hijiri2').updateValueAndValidity();
    this.dropDownForm = this.createDropDownForm();
  }
  calculate() {
    if (this.month <= 9) {
      this.month = '0' + this.month;
    }

    if (this.gregMonth <= 9) {
      this.gregMonth = '0' + this.gregMonth;
    }

    if (this.viewModeDate == 'converter') {
      const hijDate = this.billPeriodFormYear.value.english + '-' + this.month + '-' + '01';

      let payload = {
        hijiri: hijDate,
        gregorian: null
      };
      this.onCalculate.emit(payload);
    } else {
      const gregDate = this.greYearForm.value.english + '-' + this.gregMonth + '-' + '01';

      let payload = {
        hijiri: null,
        gregorian: gregDate
      };
      this.onCalculate.emit(payload);
    }
    if (this.selectedMonthsArray.length >= 5) {
      this.selectedMonthsArray.splice(4, 1);
    }
    this.selectedMonthsArray.unshift({
      year: this.billPeriodFormYear.value.english
        ? this.billPeriodFormYear.value.english
        : this.greYearForm.value.english,
      month: this.billPeriodFormMonth.value.english ? this.billPeriodFormMonth.value : this.greMonthForm.value
    });

    const data = JSON.stringify(this.selectedMonthsArray);
    this.storageService.setLocalValue('selectedMonthsArray', data);
    this.isShowDaysCard = true;
    this.getStorageValueMonths();
    this.getStorageValueDays();
    this.billPeriodFormYear = this.createHijiriFormYear();
    this.billPeriodFormMonth = this.createHijiriFormMonth();
    this.greMonthForm = this.greFormMonth();
    this.greYearForm = this.greFormYear();
  }

  setHijriYearList() {
    const currentDate = new Date();
    this.calendarService.getHijiriDate(currentDate).subscribe(res => {
      const dateParts = res.hijiri?.split('-');
      const string: any = dateParts[0];
      const year = Number(string) + 10;
      let numberArray = [];
      for (let i = year; i >= 1318; i--) numberArray.push(i);
      this.yearList = new LovList(numberArray);
    });
  }
  setGregYearList() {
    const currentDate = new Date();

    const dateParts = moment(currentDate).format('YYYY-MM-DD').split('-');
    const string: any = dateParts[0];
    const year = Number(string) + 50;
    const startYear = Number(string) - 123;
    let numberArray = [];
    for (let i = year; i >= startYear; i--) numberArray.push(i);
    this.gregYearList = new LovList(numberArray);
  }
  clearAll() {
    this.isShowCard = false;
    this.isExpand = false;
    this.storageService.clearLocalValue('conversionList');
    this.conversionList = [];
    this.isClear = true;
    this.clearEvent.emit(this.isClear);
  }

  clearAllDays() {
    this.isExpand = false;
    this.isShowDaysCard = false;
    this.storageService.clearLocalValue('conversionDaysList');
    this.storageService.clearLocalValue('selectedMonthsArray');
    this.selectedMonthsArray = [];
    this.conversionDaysList = [];
  }
  createDropDownForm(): FormGroup {
    return this.fb.group({
      fromDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        updateOn: 'blur'
      }),
      toDate: this.fb.group({
        gregorian: [null],
        hijiri2: [null],
        updateOn: 'blur'
      }),
      notes: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  greFormYear() {
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  greFormMonth() {
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  createHijiriFormYear() {
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  createHijiriFormMonth() {
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  onHide() {
    this.isOpen = !this.isOpen;
  }
}
