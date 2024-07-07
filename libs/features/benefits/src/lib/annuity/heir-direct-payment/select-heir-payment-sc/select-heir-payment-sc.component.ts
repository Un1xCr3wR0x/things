import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DirectPaymentService } from '../../../shared/services/direct-payment.service';
import {
  AlertService,
  BilingualText,
  CommonIdentity,
  CoreActiveBenefits,
  CoreBenefitService,
  GosiCalendar,
  LookupService,
  LovList,
  IdentityTypeEnum,
  checkIqamaOrBorderOrPassport
} from '@gosi-ui/core';
import {
  AttorneyDetails,
  AttorneyDetailsWrapper,
  BankAccountList,
  BankService,
  HeirDirectPaymentList,
  ManageBenefitService,
  PersonBankDetails,
  getAuthorizedGuardianDetails,
  showErrorMessage
} from '../../../shared';
import { Observable } from 'rxjs';
import { DirectPaymentDetailsDcComponent } from '../direct-payment-details-dc/direct-payment-details-dc.component';

@Component({
  selector: 'bnt-select-heir-payment-sc',
  templateUrl: './select-heir-payment-sc.component.html',
  styleUrls: ['./select-heir-payment-sc.component.scss']
})
export class SelectHeirPaymentScComponent implements OnInit {
  @Input() activeBenefit: CoreActiveBenefits;
  @Input() directPaymentForm = new FormArray([]);
  @Input() isEditMode = false;
  @Input() referenceNo: number;
  isSmallScreen = false;
  isHeadingLight = false;
  heirList: any = null;
  systemRunDate: GosiCalendar;

  /** payment section Related Variables */
  valNonsaudiBankDetails: PersonBankDetails;
  payeeList: LovList = new LovList([]);
  paymentMethodList = new LovList([]);
  listYesNo$ = new Observable<LovList>();
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  // bankAccountList: BankAccountList;
  // bankName: BilingualText;
  // attorneyDetailsWrapper = <AttorneyDetailsWrapper[]>[];
  // guardianList = <AttorneyDetailsWrapper[]>[];
  @ViewChildren('directPaymentComponent')
  directPaymentComponents: QueryList<DirectPaymentDetailsDcComponent>;

  constructor(
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly manageBenefitService: ManageBenefitService,
    private directPaymentService: DirectPaymentService,
    readonly lookUpService: LookupService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getHeirList();
    this.getSystemRunDate();
    this.initialisePayeeType();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.cityList$ = this.lookUpService.getCityList();
    this.countryList$ = this.lookUpService.getCountryList();
  }

  getHeirList() {
    this.directPaymentService
      .getHeirListForDirectPayment(this.activeBenefit?.sin, this.referenceNo)
      .subscribe(heirList => {
        this.heirList = heirList;
        heirList.heirs.forEach(heir => {
          //this.setPrefilledIbanValue(heir)
          this.setPaymentFormValues(heir);
          const heirPaymentForm = this.createDirectPaymentForm(heir);
          if (this.isEditMode) {
            this.setPreselectedAttorneys(heir);
          }
          this.directPaymentForm.push(heirPaymentForm);
        });
      });
  }


 /*  setPrefilledIbanValue(heir){

   heir.currentIbanNo = "SA5380000517608010809099";
    if(heir?.bankAccountList?.length){
    heir?.bankAccountList?.forEach(eachBank => {
      eachBank.savedAccount = false;
      if(heir?.currentIbanNo == eachBank.ibanBankAccountNo){
         eachBank.savedAccount = true;
      }
    });
    }
  } */
  setPaymentFormValues(heir) {
    const isNonSaudiNewIban = heir?.bankAccountList?.find(eachBank => eachBank?.isNonSaudiIBAN === true);
    if (isNonSaudiNewIban) {
      heir.valNonsaudiBankDetails = isNonSaudiNewIban;
    } else if (heir?.newIban) {
      heir.valNonsaudiBankDetails = heir?.bankAccountList[0];
    }
  }

  setPreselectedAttorneys(heir) {
    const preSelectedAttorney = new AttorneyDetailsWrapper();
    preSelectedAttorney.personId = heir?.agentId;
    preSelectedAttorney.name = heir?.agentName;
    preSelectedAttorney.attorneyDetails = new AttorneyDetails();
    preSelectedAttorney.attorneyDetails.certificateExpiryDate = heir?.certificateExpiryDate;
    heir.preSelectedAttorneys = [preSelectedAttorney];
  }

  createDirectPaymentForm(heir) {
    const form = this.fb.group(heir);
    form.addControl('checkBoxFlag', this.fb.control(heir.directPaymentOpted));
    return form;
  }

  /** Payment section Related Functions */

  initialisePayeeType() {
    this.lookUpService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }

  getBankName(bankCode: number, index) {
    this.lookUpService.getBank(bankCode).subscribe(
      res => {
        if (res.items[0]) {
          this.heirList.heirs[index].bankName = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }

  //Method to fetch bank details of a person
  getBankDetails(personId, index) {
    this.bankService.getBankAccountList(+personId, null, null).subscribe(res => {
      if (res?.bankAccountList?.length > 0) {
        const heir = this.heirList.heirs[index];
        heir.bankDetails = res;
        if (heir.bankDetails?.bankAccountList?.length) {
          heir.bankDetails?.bankAccountList?.map(bank => {
            bank.savedAccount = false;
            if (bank.ibanBankAccountNo === heir?.currentIbanNo){
              bank.savedAccount = true;
            } 
          });
        }
      }
    });
  }

  getAttorneyDetailsById(id: number, index?) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personDetails => {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
      this.getAttorneyByIdentifier(idObj.id, index);
    });
  }

  getAttorneyByIdentifier(id: number, index?) {
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      // this.attorneyDetailsWrapper = res;
      this.heirList.heirs[index].attorneyDetailsWrapper = getAuthorizedGuardianDetails(
        res,
        this.systemRunDate
      ).authorizedPersonDetails;
      this.heirList.heirs[index].guardianList = getAuthorizedGuardianDetails(
        res,
        this.systemRunDate
      ).guardianPersonDetails;
    });
  }

  checkIdentityLabel(index: number) {
    if (this.heirList.heirs.length) {
      const value = checkIqamaOrBorderOrPassport(this.heirList.heirs[index]?.person.identity);
      return this.getIdentityLabel(value);
    }
  }

  checkIdentity(index: number) {
    if (this.heirList.heirs.length) {
      const value = checkIqamaOrBorderOrPassport(this.heirList.heirs[index]?.person.identity);
      return value?.id;
    }
  }

  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NIN-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    } else {
      label = 'BENEFITS.NATIONAL-ID';
    }
    return label;
  }

  /** ********************** */

  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(
      res => {
        this.systemRunDate = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
}
