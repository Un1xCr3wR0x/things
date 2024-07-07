import {
  Component,
  OnInit,
  TemplateRef,
  Inject
} from '@angular/core';
import { AlertService, lengthValidator, iBanValidator, LookupService, ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { LovList, BilingualText } from '@gosi-ui/core/lib/models';
import { MbProfile } from '../../../shared/models/profile';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BankDetailsDcComponent } from '@gosi-ui/foundation/form-fragments';
import { MBConstants, MbRouteConstants, SamaStatusConstants } from '../../../shared/constants';
import { Observable, noop } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService, MemberService } from '../../../shared/services';
import { take, tap, delay } from 'rxjs/operators';
import { BankDataDetails, MbBaseScComponent, SamaStatusEnum, SamaStatusNumberEnum } from '../../../shared';

@Component({
  selector: 'mb-doctor-bank-sc',
  templateUrl: './doctor-bank-details-sc.component.html',
  styleUrls: ['./doctor-bank-details-sc.component.scss']
})
export class DoctorBankDetailsScComponent extends MbBaseScComponent implements OnInit {
  modalRef: BsModalRef;
  person: MbProfile;
  bankNameList: Observable<LovList>;
  BankDetailsForm: FormGroup;
  list: LovList = new LovList([]);
  identificationNo: number;
  bankDetailsComponent: BankDetailsDcComponent;

  minMaxLengthAccountNo: number = MBConstants.MIN_MAX_LENGTH_ACCOUNT_NUMBER;
  saudiBankList: LovList = new LovList([]);

  constructor(
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly doctorService: DoctorService,
    private fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly memberService: MemberService
  ) {
    super(alertService, lookUpService, memberService, appToken);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
      if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
        this.getPersonContractInAPP(this.identificationNo);
      } else {
        this.getPersonDetails(this.identificationNo);
      }
    this.BankDetailsForm = this.createBankDetailsForm();
    this.getBankLov();
    this.populateValue();
    this.BankDetailsForm?.get('ibanAccountNo').valueChanges.subscribe(() => {
      if (!this.BankDetailsForm?.get('ibanAccountNo').valid) {
        this.list = new LovList([]);
        this.BankDetailsForm.get('bankName').reset();
      } else {
        this.getBranchList();
        this.bankNameList?.subscribe(res => {
          if (res?.items?.length > 0) {
            this.getBankDetail();
          }
        });
      }
    });
  }
  getPersonContract(identificationNo) {
    this.doctorService.getContractDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
        this.doctorService.setmbProfessionalId(this.memberperson?.contracts[0].mbProfessionalId);
      },
      err => this.showErrorMessage(err)
    );
  }


  getBankLov() {
    this.lookUpService.getSaudiBankList().subscribe(res => {
      this.saudiBankList = res;
    });
  }

  populateValue() {
    this.BankDetailsForm.patchValue({ ibanAccountNo: this.person?.bankAccount?.ibanBankAccountNo });
    const iBanCode = String(this.BankDetailsForm?.get('ibanAccountNo').value).slice(4, 6);
    this.lookUpService.getBank(iBanCode).subscribe(res => {
      this.list = res;
      this.BankDetailsForm?.get('bankName').patchValue(res.items[0].value);
      this.BankDetailsForm?.get('bankName').updateValueAndValidity();
    });
    let bankStatus: BilingualText;
    switch (this.person?.bankAccount?.verificationStatus) {
      case SamaStatusEnum.SamaVerified:
      case SamaStatusEnum.NotApplicable: {
        bankStatus = SamaStatusConstants.VERIFIED;
        break;
      }
      case SamaStatusEnum.SamaVerificationPending:
      case SamaStatusEnum.SamaNotVerified: {
        bankStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
        break;
      }
      case SamaStatusEnum.SamaIbanNotVerifiable:
      case SamaStatusEnum.SamaVerificationFailed: {
        bankStatus = SamaStatusConstants.VERIFICATION_FAILED;
        break;
      }
      case SamaStatusEnum.SamaExpired: {
        bankStatus = SamaStatusConstants.EXPIRED;
        break;
      }
      default: {
        bankStatus = null;
      }
    }
    this.BankDetailsForm.patchValue({ bankStatus: bankStatus });

    this.BankDetailsForm.updateValueAndValidity();
  }
  /**
   * This method is to call branch list lookup service
   */
  getBranchList() {
    if (this.BankDetailsForm?.get('ibanAccountNo').value === '') {
      this.list = new LovList([]);
      this.BankDetailsForm?.get('bankName').reset();
    } else if (this.BankDetailsForm?.get('ibanAccountNo').value && this.BankDetailsForm.get('ibanAccountNo').valid) {
      const iBanCode = String(this.BankDetailsForm.get('ibanAccountNo').value).slice(4, 6);
      this.getBankDetails(iBanCode);
    }
  }
  getBankDetail() {
    this.bankNameList
      .pipe(take(1))
      .pipe(
        tap(res => (this.list = res)),
        delay(100),
        tap(res => {
          //TODO Use camal case for variables
          this.BankDetailsForm?.get('bankName').patchValue(res.items[0].value);
          this.BankDetailsForm?.get('bankName').updateValueAndValidity();
        })
      )
      .subscribe(noop);
  }

  /**
   * Method to create the bank details form
   */
  createBankDetailsForm() {
    return this.fb.group({
      ibanAccountNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.minMaxLengthAccountNo),
            iBanValidator
          ])
        }
      ],
      bankName: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      }),
      bankStatus: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      })
    });
  }

  saveBankDetails() {
    this.alertService.clearAlerts();
    if (!this.BankDetailsForm.invalid) {
      if(!this.person.bankAccount) { this.person.bankAccount = new BankDataDetails() }
      this.person.bankAccount.ibanBankAccountNo = this.BankDetailsForm?.get('ibanAccountNo').value;
      this.person.bankAccount.bankName = this.BankDetailsForm?.get('bankName').value;
      this.saudiBankList?.items.forEach(item => {
        if (item?.value?.english === this.person?.bankAccount?.bankName?.english)
          this.person.bankAccount.bankCode = item?.code;
      });
      const bankStatus = this.person.bankAccount.verificationStatus;
      let status = '';
      switch (bankStatus) {
        case SamaStatusEnum.NotApplicable: {
          status = SamaStatusNumberEnum.NotApplicable;
          break;
        }
        case SamaStatusEnum.SamaExpired: {
          status = SamaStatusNumberEnum.SamaExpired;
          break;
        }
        case SamaStatusEnum.SamaIbanNotVerifiable: {
          status = SamaStatusNumberEnum.SamaIbanNotVerifiable;
          break;
        }
        case SamaStatusEnum.SamaNotVerified: {
          status = SamaStatusNumberEnum.SamaNotVerified;
          break;
        }
        case SamaStatusEnum.SamaVerificationFailed: {
          status = SamaStatusNumberEnum.SamaVerificationFailed;
          break;
        }
        case SamaStatusEnum.SamaVerificationPending: {
          status = SamaStatusNumberEnum.SamaVerificationPending;
          break;
        }
        case SamaStatusEnum.SamaVerified: {
          status = SamaStatusNumberEnum.SamaVerified;
          break;
        }
        default: {
          status = null;
        }
      }
      this.person.bankAccount.verificationStatus = status;
      this.saveBank(this.person);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  saveBank(memberperson) {
    if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService
      .saveBankDetailsConract(memberperson,this.identificationNo)
      .pipe(
        tap(res => {
          this.doctorService.responseMessage = res.bilingualMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showErrorMessage(err);
      });
    } else {
      this.doctorService
      .saveBankDetails(memberperson,memberperson.contracts[0].mbProfessionalId)
      .pipe(
        tap(res => {
          this.doctorService.responseMessage = res.bilingualMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showErrorMessage(err);
      });
    }
  }
  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
        this.populateValue();
      },
      err => this.showErrorMessage(err)
    );
  }
  getPersonContractInAPP(identificationNo) {
    this.doctorService.getContractMemberDetail(identificationNo).subscribe(
      res=>{
        this.person = res;
        this.populateValue();
      },
      err => this.showError(err)
    );
  }
  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  popUpCancel(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmCancel() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }
  decline() {
    this.modalRef.hide();
  }
}
