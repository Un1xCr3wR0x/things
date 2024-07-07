import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList, BilingualText, GosiCalendar } from '@gosi-ui/core';
import { PersonBankDetails, PatchPersonBankDetails, BenefitDetails, AttorneyDetailsWrapper, BankAccountList } from '../../shared';
import moment from 'moment';

@Component({
  selector: 'bnt-appeal-tab-dc',
  templateUrl: './appeal-tab-dc.component.html',
  styleUrls: ['./appeal-tab-dc.component.scss']
})
export class AppealTabDcComponent implements OnInit {
  isSmallScreen: boolean;

  /**
   * Input variables
   */
  @Input() parentForm: FormGroup;
  @Input() eligiblePeriod: LovList;
  @Input() reasonForAppeal: Observable<LovList>;
  @Input() buttonName = 'BENEFITS.SAVE-AND-NEXT';
  //bank details
  @Input() saveApiResp: BilingualText;
  @Input() bankDetails: PersonBankDetails = new PersonBankDetails();
  @Input() bankAccountList:BankAccountList
  @Input() lang = 'en';
  @Input() systemRunDate: GosiCalendar;
  @Input() benefitCalculation: BenefitDetails;
  @Input() personDetails;
  @Input() personId;
  @Input() annuityResponse;
  @Input() bankName;
  @Input() isValidator;
  @Input() payeeForm;
  @Input() payeeList;
  @Input() paymentMethodList;
  @Input() isIndividualApp;
  @Input() savedPayMethod;
  @Input() savedPayeType;
  @Input() attorneyDetailsWrapper;
  @Input() listOfGuardians;
  @Input() uibenefits;
  @Input() ibanBankAccountNo;
  /**
   * Output variables
   */
  // @Output() saveBank: EventEmitter<PatchPersonBankDetails> = new EventEmitter();
  @Output() cancelTransaction: EventEmitter<null> = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() clearSuccessMessage = new EventEmitter();
  @Output() getBankName = new EventEmitter();
  @Output() getBankDetails = new EventEmitter();
  @Output() onConfirm = new EventEmitter();
  minDate: Date;
  maxDate: Date;
  disableDate = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    this.cancelTransaction.emit();
  }

  saveAndNext() {
    this.save.emit();
  }

  maxAndMinDateForReqDate(minMaxDate: { minDate: Date; maxDate: Date }) {
    this.parentForm.get('requestDate').reset();
    this.minDate = minMaxDate.minDate;
    this.maxDate = minMaxDate.maxDate ? minMaxDate.maxDate : moment(this.systemRunDate.gregorian).toDate();
  }
}
