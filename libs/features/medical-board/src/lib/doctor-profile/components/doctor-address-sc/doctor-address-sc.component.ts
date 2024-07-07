import { Component, OnInit, TemplateRef, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AlertService,
  ContactDetails,
  LovList,
  setAddressFormToAddresses,
  LookupService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { Observable, noop } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ContractData, MbProfile, MbRouteConstants } from '../../../shared';
import { DoctorService } from '../../../shared/services';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-doctor-address-sc',
  templateUrl: './doctor-address-sc.component.html',
  styleUrls: ['./doctor-address-sc.component.scss']
})
export class DoctorAddressScComponent implements OnInit {
  @Input() contactDetail: ContactDetails;
  @Input() gccCountryList: Observable<LovList>;
  @Input() cityList: Observable<LovList>;
  addressForm = new FormGroup({});
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  isGccPerson = false;
  modalRef: BsModalRef;
  cityList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  contractDoctorDetails: ContractDoctorDetails;
  person: MbProfile;
  isMBApp = false;
  memberperson: ContractData = new ContractData;
  identificationNo: number;
  professionalId: number;
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    this.cityList$ = this.lookUpService.getCityList();
    this.gccCountryList$ = this.lookUpService.getGccCountryList(false);
    if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.getPersonContractInAPP(this.identificationNo);
    } else {
      this.getPersonDetails(this.identificationNo);
    }
    this.isMBApp = this.appToken === ApplicationTypeEnum.MEDICAL_BOARD ? true : false;
    if (this.isMBApp) {
      this.getPersonContract(this.identificationNo);
    }
  }

  getPersonContract(identificationNo) {
    this.doctorService.getContractMemberDetail(identificationNo).subscribe(
      res => {
        this.person = res;
        this.doctorService.setmbProfessionalId(this.memberperson?.contracts[0].mbProfessionalId);
      },
      err => this.showErrorMessage(err)
    );
  }
  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
      },
      err => this.showErrorMessage(err)
    );
  }
  getPersonContractInAPP(identificationNo) {
    this.doctorService.getContractMemberDetail(identificationNo).subscribe(
      res=>{
        this.person = res;
      },
      err => this.showErrorMessage(err)
    );
  }
  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  saveAddressDetail() {
    if (this.addressDetailsComponent.getAddressValidity()) {
      this.alertService.clearAlerts();
      if (!this.isMBApp) {
        this.person.contactDetail.addresses = setAddressFormToAddresses(this.addressForm);
        this.person.contactDetail.currentMailingAddress = this.addressForm.get('currentMailingAddress').value;

        this.saveAddress(this.person);
      } else {
        this.memberperson.addresses = setAddressFormToAddresses(this.addressForm);
        this.memberperson.currentMailingAddress = this.addressForm.get('currentMailingAddress').value;

        this.saveAddressInApp(this.memberperson);
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  saveAddress(person: MbProfile) {
    this.professionalId = person.contracts[0].mbProfessionalId;
    this.doctorService
      .saveAddressDetails(person, this.professionalId)
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
  saveAddressInApp(memberperson: ContractData) {
    this.professionalId = this.memberperson?.contracts[0]?.mbProfessionalId;
    this.doctorService
      .saveAddressDetailsContract(memberperson, this.identificationNo)
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
