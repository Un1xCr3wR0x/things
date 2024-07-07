import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AttorneyDetailsWrapper, BankAccountList, PaymentDetailsDcComponent, PersonBankDetails } from '../../../shared';
import { ContactDetails, LovList, CoreAdjustmentService } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { BenefitConstants } from '../../../shared';
import { Router } from '@angular/router';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';

@Component({
  selector: 'bnt-direct-payment-details-dc',
  templateUrl: './direct-payment-details-dc.component.html',
  styleUrls: ['./direct-payment-details-dc.component.scss']
})
export class DirectPaymentDetailsDcComponent implements OnInit {
  /** Local Variables */
  isSmallScreen = false;
  isHeadingLight = false;
  savedPayMethod = { english: 'Bank Transfer', arabic: 'تحويل للبنك' };

  @ViewChild('paymentDetailsComponent', { static: false })
  paymentDetailsComponent: PaymentDetailsDcComponent;
  
  /** Input Variables */
  @Input() activeBenefit;
  @Input() heirDetails = null;
  @Input() paymentIndex = 0;
  @Input() payeeList = new LovList([]);
  @Input() listYesNo = new LovList([]);
  @Input() paymentMethodList = new LovList([]);
  @Input() parentForm = new FormGroup({});
  @Input() bankAccountList: BankAccountList;
  @Input() bankName = null;
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  @Input() listOfGuardians: AttorneyDetailsWrapper[];
  @Input() isEditMode = false;
  @Input() valNonsaudiBankDetails:PersonBankDetails;
  @Input() cityList$: Observable<LovList>;
  @Input() countryList$: Observable<LovList>;
  @Input() savedAddress: ContactDetails;

  /** Output Variables */
  @Output() getAuthPerson: EventEmitter<string> = new EventEmitter();
  @Output() getGuardian: EventEmitter<string> = new EventEmitter();
  @Output() getBankNameEvent = new EventEmitter();
  @Output() loadBankInfoForId = new EventEmitter();

  constructor(readonly adjustmentPaymentService: CoreAdjustmentService,
    readonly router: Router,) {}

  ngOnInit(): void {}

  getBankName(iban) {
    this.getBankNameEvent.emit(iban);
  }

  getBankDetails(personId) {
    this.loadBankInfoForId.emit(personId);
  }

  getAttorneyByIdentifier(personId) {
    this.getAuthPerson.emit(personId);
  }

  getGuardianByIdentifier(personId) {
    this.getGuardian.emit(personId);
  }
  viewAdjustmentDetails(){
    this.adjustmentPaymentService.identifier = this.heirDetails?.person?.personId
    this.adjustmentPaymentService.socialNumber = this.activeBenefit.sin;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  } 
}
