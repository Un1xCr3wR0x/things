/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  LookupService,
  LovList
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MemberData, ContractData } from '../..';
import { MemberService } from '../../services';
import { PersonBankDetails } from '@gosi-ui/features/benefits/lib/shared/models/person-bank-details';


@Directive()
export abstract class MbBaseScComponent extends BaseComponent implements OnInit {
  /**
   * Local variables
   */
  isMBApp = false;
  isAppPrivate = false;
  lang = 'en';
  modalRef: BsModalRef;
  bankName: BilingualText;
  memberperson: ContractData;
  bankDetails: PersonBankDetails;

  /**
   * Observables
   */

  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  specialty$: Observable<LovList>;
  region$: Observable<LovList>;
  doctorType$: Observable<LovList>;
  hospital$: Observable<LovList>;
  feespervisit$: Observable<LovList>;
  medicalboardtype$: Observable<LovList>;
  bankNameList: Observable<LovList>;
  fees: Observable<number>;
  /**
   *
   * @param alertService
   * @param lookUpService
   * @param memberService
   * @param appToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly memberService: MemberService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }

  /** Method to set all lov lists on component load */
  setLookUpLists() {
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.doctorType$ = this.lookUpService.getContractTypeList();
    this.medicalboardtype$ = this.lookUpService.getMedicalBoardTypeList();
    this.specialty$ = this.lookUpService.getSpecialityList();
    this.region$ = this.lookUpService.getRegionsList(); //TODO Use Camel Case
    this.hospital$ = this.lookUpService.getHospitalList(); //TODO If lookup service is more than 500 create a MedicalBoardLokkupService similar to EstablishmentLooupService
    this.feespervisit$ = this.lookUpService.getFeespervisitList();
  }

  /**
   * This method is to hide the modal reference
   * @param modalRef
   */
  hideModal() {
    this.modalRef.hide();
  }

  showFormInvalid() {
    this.alertService.showMandatoryErrorMessage();
  }

  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  getFees(data: MemberData) {
    this.fees = this.memberService.getFees(data);
  }

  getBankDetails(iBanCode: string) {
    this.lookUpService.getBank(iBanCode).subscribe(
      res => {
        this.bankName = res.items[0]?.value;       
      },
      err => this.showError(err)
    );
    this.bankNameList = this.lookUpService.getBank(iBanCode).pipe(
      catchError(err => {
        this.showError(err);
        return of(new LovList([]));
      })
    );
  }
}
