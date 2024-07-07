import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  BreadcrumbConstants,
  ChangePersonScBaseComponent,
  ChangePersonService,
  ModifyContactRequest,
  PersonBankDetails,
  ManagePersonConstants,
  ManagePersonService,
  IndividualBankDetails
} from '../../../../shared';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  Inject
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import {
  BaseComponent,
  DocumentItem,
  iBanValidator,
  lengthValidator,
  Lov,
  LovList,
  AddressDetails,
  AddressTypeEnum,
  Person,
  LookupService,
  ApplicationTypeToken,
  LanguageToken,
  DocumentService,
  AlertService,
  bindToObject,
  NIN,
  Iqama,
  NationalId,
  Passport,
  WizardItem,
  compareIbanValidator
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { filter, tap } from 'rxjs/operators';
import { noop } from 'rxjs';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'cim-add-bank-details-form-dc',
  templateUrl: './add-bank-details-form-dc.component.html',
  styleUrls: ['./add-bank-details-form-dc.component.scss']
})
export class AddBankDetailsFormDcComponent extends ChangePersonScBaseComponent implements OnInit {
  @ViewChild('brdcmb', { static: false })
  modifyBrdcmb: BreadcrumbDcComponent;
  modalRef: BsModalRef;
  bankDetailsForm: FormGroup;
  minMaxLengthAccountNo = 24;
  warningMessage: string =
    'The bank account number (IBAN) will be verified. Please ensure that the bank account is active and associated with the account holder to avoid rejection.';
  bankList: LovList = new LovList([
    { value: ManagePersonConstants.SAUDI_BANK, sequence: 1 },
    { value: ManagePersonConstants.NON_SAUDI_BANK, sequence: 2 }
  ]);
  showNonSaudi: boolean = false;
  selectedAddresses = [];
  readonly foreignType = AddressTypeEnum.OVERSEAS;
  overSeasAddress = new AddressDetails();
  onlyAddressType: string; //If only one address is required
  toggleMailingAddress: FormControl;
  commonModalRef: BsModalRef;
  nationalityList$: Observable<LovList>;
  //Input Variables
  @Input() bankDetails: PersonBankDetails = new PersonBankDetails();
  @Input() documents: DocumentItem[] = [];
  // @Input() personId: number;
  @Input() bankNameList: Lov = new Lov();
  @Input() countryList: Observable<LovList>;
  @Input() parentForm: FormGroup;
  @Input() countryReadOnly = false;
  @Input() mandatoryOverseasAddress = false;
  @Input() readOnlyAll = false;
  @Input() idValue: '';
  @Input() lang = 'en';
  bankAdress: any;
  //Output Variables

  modifyWizardItems: WizardItem[] = [];
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;

  @Output() emitForm: EventEmitter<FormGroup> = new EventEmitter();
  @Output() ibanCodeEmit: EventEmitter<string> = new EventEmitter();
  @Output() uploadedEvent: EventEmitter<void> = new EventEmitter();
  @Output() changeBankTypeEvent: EventEmitter<void> = new EventEmitter();
  @Output() newBankSave: EventEmitter<PersonBankDetails> = new EventEmitter();
  @Output() showAlert: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  list: LovList = new LovList([]);
  sin: number;
  personId: number;
  personDtls: Person;
  person: Person;
  profileArray: any[] = [];
  addressDetails: any;

  /**
   * Creates an instance of BankFormDcComponent
   * @memberof  BankFormDcComponent
   *
   */

  constructor(
    readonly changePersonService: ChangePersonService,
    readonly activatedRoute: ActivatedRoute,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    private fb: FormBuilder,
    private manageService: ManagePersonService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      route
    );
  }

  ngOnInit(): void {
    // this.activatedRoute.parent.parent.paramMap.subscribe(params => {
    //   console.log(params)
    //   if (params.get('personId')) {
    //     if (params) this.personId = Number(params.get('personId'));
    //     //this.sin = this.changePersonService.getSIN();
    //   }
    // })

    this.activatedRoute.queryParams.subscribe(params => {
      if (params) this.getProfileDetails(params.identifier);
      this.personId = params.identifier;
    });

    this.nationalityList$ = this.lookService.getNationalityList();
    this.bankDetailsForm = this.createBankForm();
    if (this.bankDetails.bankName.english != undefined) {
      this.bankDetailsForm.get('bankName').patchValue('hgjhg');
      this.bankDetailsForm.get('ibanBankAccountNo').patchValue(this.bankDetails.ibanBankAccountNo);
    }
    this.changePersonService.getProfileDetails(this.personId).subscribe(res => {
      this.contactDetails = res.contactDetails;
      this.bankAdress = this.contactDetails.addresses.filter(data => data.type == 'OVERSEAS');
      this.bankAdress.forEach(element => {
        if (element.city && element.country && element.detailedAddress) {
          this.readOnlyAll = true;
        } else {
          this.readOnlyAll = false;
        }
      });
      this.addressDetails = this.selectAndBindAddress(AddressTypeEnum.OVERSEAS);
    });

    //  console.log(this.sin)
    // this.changePersonService.getBankDetails(this.personId).subscribe(bankRes => {
    //   console.log(bankRes)
    //     if (bankRes) {
    //       bindToObject(this.bankDetails, bankRes);
    //       if (this.bankDetails.isNonSaudiIBAN === false) {
    //         {
    //           if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
    //             //this.isIbanVerified = false;
    //           }
    //           if (this.bankDetails.ibanBankAccountNo !== null) {
    //             this.getBankDetails(this.bankDetails.ibanBankAccountNo.slice(4, 6));
    //           }
    //         }
    //       } else {
    //         if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
    //           //this.isIbanVerified = false;
    //         }
    //       }
    //     }
    //   });
    // this.bindInputToForm();
    // this.emitForm.emit(this.bankDetailsForm);
  }

  private selectAndBindAddress(addressType) {
    if (this.selectedAddresses.indexOf(addressType) === -1) {
      if (this.bankAdress && this.bankAdress.map(item => item.type).includes(addressType)) {
        this.selectedAddresses.push(addressType);
      }
    }
    return this.getAddress(addressType);
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  private getAddress(type): AddressDetails {
    if (this.bankAdress) {
      this.bankAdress = this.bankAdress.filter(address => address !== null);
      return this.bankAdress.find(address => address.type === type) || new AddressDetails(type);
    } else {
      return new AddressDetails(type);
    }
  }

  // getBankDetails(iBanCode) {
  //   this.lookService.getBank(iBanCode).subscribe(
  //     res => {
  //       this.bankNameList = res.items[0];
  //       this.list = new LovList([this.bankNameList]);
  //     },
  //     err => this.showErrorMessage(err)
  //   );
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bankNameList && changes.bankNameList.currentValue && this.bankDetailsForm) {
      this.list = new LovList([changes.bankNameList.currentValue]);
      setTimeout(() => {
        if (this.bankDetailsForm.get('isNonSaudiIBAN').value === false) {
          this.bankDetailsForm.get('bankName').setValue(this.bankNameList.value);
          this.bankDetailsForm.get('bankName').updateValueAndValidity();
        }
      }, 100);
    }
    // if (changes && changes.documents) {
    //   this.setDocumentsNull();
    // }
  }

  ngAfterViewInit() {
    this.modifyBrdcmb.breadcrumbs = BreadcrumbConstants.INDV_BREADCRUMB_BANKVALUES;
  }

  capitalize(data) {
    data.valueChanges
      .pipe(
        distinctUntilChanged() //it is needed because patchValue emits execution again
      )
      .subscribe((value: string) => {
        data.patchValue(value.toUpperCase());
      });
  }

  submit() {
    this.bankDetails = this.bankDetailsForm.getRawValue();
    if (this.bankDetailsForm.valid) {
      this.showAlert.emit(false);
      if (this.showNonSaudi == true) {
        this.bankDetails.isNonSaudiIBAN = true;
        this.newBankSave.emit(this.bankDetails);
      } else if (this.showNonSaudi == false) {
        this.newBankSave.emit(this.bankDetails);
      } else {
        this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
        this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
        this.bankDetailsForm.get('bankName').markAllAsTouched();
        this.bankDetailsForm.get('bankName').updateValueAndValidity();
       // this.newBankSave.emit(null);
      }
    } else {
      this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
      // this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').markAllAsTouched();
      // this.bankDetailsForm.get('bankName').updateValueAndValidity();
      // this.newBankSave.emit(null);
      this.showAlert.emit(true);
    }

    // if (this.bankDetailsForm.get('ibanBankAccountNo').value && this.bankDetailsForm.get('bankName').value.english) {
    //   if (this.showNonSaudi == true) {
    //     this.manageService
    //       .saveBankDetails(this.personId, { ...new IndividualBankDetails(), ...this.bankDetails })
    //       .subscribe(
    //         (data: any) => {

    //         },
    //         err => {
    //           this.alertService.showError(err.error.message);
    //         }
    //       );
    //     this.newBankSave.emit(this.bankDetails);
    //   } else if (this.showNonSaudi == false) {
    //     this.manageService
    //       .saveBankDetails(this.personId, { ...new IndividualBankDetails(), ...this.bankDetails })
    //       .subscribe(
    //         (data: any) => {
    //           this.alertService.showSuccess(data, null, 5);
    //           this.router.navigate([`/home/individual/profile`]);
    //         },
    //         err => {
    //           this.alertService.showError(err.error.message);
    //         }
    //       );
    //     this.newBankSave.emit(this.bankDetails);
    //   } else {
    //     this.newBankSave.emit(null);
    //     this.showAlert.emit(true);
    //   }
    // } else {
    //   this.newBankSave.emit(null);
    //   this.showAlert.emit(true);
    // }
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form. */
  confirm() {
    this.commonModalRef.hide();
    this.router.navigate(['/home/individual/profile'], { state: { navigatedFrom: 'addBank' } });
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  // Method to create form to get the bank details
  createBankForm(): FormGroup {
    return this.fb.group({
      isNonSaudiIBAN: [false, { validators: Validators.required, updateOn: 'blur' }],
      ibanBankAccountNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            iBanValidator,
            lengthValidator(this.minMaxLengthAccountNo)
          ]),
          updateOn: 'blur'
        }
      ],
      banklocation: this.fb.group({
        english: ['Saudi Arabia', { validators: Validators.required }],
        arabic: ['السعودية']
      }),
      bankName: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      bankAddress: [null, { updateOn: 'blur' }],
      swiftCode: [null, { validators: Validators.pattern('[a-zA-Z0-9]+'), updateOn: 'blur' }],
      bankCode: [null]
    });
  }

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof BankDetailsDcComponent
   */
  // getBank() {
  //   if (this.bankDetailsForm.get('isNonSaudiIBAN').value === false) {
  //     this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
  //     this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
  //     if (this.bankDetailsForm.get('ibanBankAccountNo').valid) {
  //       this.emitBankCode();
  //     } else {
  //       this.bankDetailsForm.get('bankName').reset();
  //     }
  //   }
  // }

  // Method to get bank details
  getBank(iban: string) {
    this.showAlert.emit(false);
    if (this.bankDetailsForm.get('isNonSaudiIBAN').value === false) {
      this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      if (iban) {
        this.bankDetailsForm.get('ibanBankAccountNo').patchValue(iban);
        const bankCode = this.bankDetailsForm.get('ibanBankAccountNo').value.slice(4, 6);
        this.bankDetailsForm.get('bankCode').patchValue(bankCode);
        this.lookService.getBank(bankCode).subscribe(
          res => {
            if (res.items[0]) {
              this.bankDetailsForm.get('bankName').patchValue(res.items[0].value);
              this.bankNameList = res.items[0];
              this.bankDetailsForm.updateValueAndValidity();
            }
          },
          err => this.showErrorMessage(err)
        );
      } else {
        this.bankDetailsForm.get('bankName').reset();
      }
    }
  }
  /**
   * Method to emit the bank Code
   */
  // emitBankCode() {
  //   const iBanCode = String(this.bankDetailsForm.get('ibanBankAccountNo').value).slice(4, 6);
  //   this.ibanCodeEmit.emit(iBanCode);
  //   this.bankDetailsForm.get('bankCode').setValue(iBanCode);
  // }

  selectedLocation(evnt) {
    if (evnt == 'Outside Saudi Arabia') {
      this.showNonSaudi = true;
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
      this.bankDetailsForm.get('swiftCode').reset();
      this.bankDetailsForm.get('bankAddress').reset();
    } else {
      this.showNonSaudi = false;
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
    }
  }
  /**
   * Method to present the input data in the form
   */
  bindInputToForm() {
    if (this.bankDetailsForm) {
      Object.keys(this.bankDetails).forEach(name => {
        if (name in this.bankDetailsForm.controls) {
          this.bankDetailsForm.get(name)?.setValue(this.bankDetails[name]);
          this.bankDetailsForm.get(name)?.updateValueAndValidity();
        }
        if (name === 'isNonSaudiIBAN') {
          this.setIbanValidators(this.bankDetailsForm.get(name).value);
        }
        if (name === 'ibanBankAccountNo' && this.bankDetails[name]) {
          this.getBank(this.bankDetailsForm.get('ibanBankAccountNo').value);
        }
      });
    }
  }

  /**
   * Toggle event to select bank type
   * @param isNonSaudi
   */
  changeBankType(isNonSaudi: boolean) {
    this.setDocumentsNull();
    this.changeBankTypeEvent.emit();
    /* this.bankDetailsForm = this.createBankForm(); */
    this.setIbanValidators(isNonSaudi);
    this.bankDetailsForm.get('isNonSaudiIBAN').setValue(isNonSaudi);
    this.bankDetailsForm.get('isNonSaudiIBAN').updateValueAndValidity();
    this.checkBankTypeAndBindData(isNonSaudi);
    this.bankDetailsForm.markAsUntouched();
    this.bankDetailsForm.markAsPristine();
    this.bankDetailsForm.updateValueAndValidity();
    /* this.emitForm.emit(this.bankDetailsForm); */
  }

  /**
   * Method to check bank type and bind data
   * @param bankType
   */
  checkBankTypeAndBindData(bankType: boolean) {
    if (this.bankDetails.isNonSaudiIBAN === bankType) {
      this.bankDetailsForm.get('ibanBankAccountNo').setValue(this.bankDetails.ibanBankAccountNo);
      this.bankDetailsForm.get('bankName').setValue(this.bankDetails.bankName);
    } else {
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
    }
  }

  /**
   * Method to set document to null on checking the banktype
   *
   */
  setDocumentsNull() {
    if (this.bankDetails && this.bankDetails.isNonSaudiIBAN === false) {
      this.documents.forEach(document => {
        document.documentContent = null;
        document.icon = null;
        document.fileName = null;
      });
    }
  }

  /**
   * Method to set the form controls validators for Saudi Bank or Non Saudi
   * @param isNonSaudi
   */
  setIbanValidators(isNonSaudi) {
    if (isNonSaudi === true) {
      this.bankDetailsForm.get('ibanBankAccountNo').setValidators(Validators.required);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').setValidators([Validators.required]);
      this.bankDetailsForm.get('swiftCode').setValidators([Validators.required]);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').updateValueAndValidity();
      this.bankDetailsForm.get('swiftCode').updateValueAndValidity();
    } else {
      this.bankDetailsForm
        .get('ibanBankAccountNo')
        .setValidators([Validators.required, iBanValidator, lengthValidator(this.minMaxLengthAccountNo)]);

      this.bankDetailsForm.get('bankAddress').clearValidators();
      this.bankDetailsForm.get('swiftCode').setValidators([Validators.pattern('[a-zA-Z0-9]+')]);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').updateValueAndValidity();
      this.bankDetailsForm.get('swiftCode').updateValueAndValidity();

      this.bankDetailsForm.updateValueAndValidity();
    }
  }
  // Method to emit file uploaded details

  fileUploaded() {
    this.uploadedEvent.emit();
  }
}
