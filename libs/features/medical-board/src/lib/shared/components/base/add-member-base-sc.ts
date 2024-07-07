/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LovList,
  RouterData,
  LookupService,
  RouterDataToken,
  TransactionReferenceData
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MemberService } from '../../../shared/services';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MbBaseScComponent } from './medical-board-base-sc.component';
import { MbRouteConstants } from '../../../shared/constants';
import { MemberDetails, MbProfile, MemberData } from '../../../shared/models';

@Directive()
export abstract class AddMemberBaseSc extends MbBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  channel: string;
  contractId: number;
  documents: DocumentItem[];
  isAppPrivate = false;
  lang = 'en';
  member: MemberData = new MemberData();
  memberDetails: MemberDetails;
  members: MbProfile;
  modalRef: BsModalRef;
  professionalId: number;
  referenceNo: number;
  transactionReferenceData: TransactionReferenceData[] = [];

  /** Observables */
  bankNameList: Observable<LovList>;
  cityList$: Observable<LovList>;
  doctorType$: Observable<LovList>;
  documentList$: Observable<DocumentItem[]>;
  fees: Observable<number>;
  feespervisit$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  hospital$: Observable<LovList>;
  medicalboardtype$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  region$: Observable<LovList>;
  specialty$: Observable<LovList>;
  /**
   *
   * @param alertService
   * @param documentService
   * @param lookUpService
   * @param memberService
   * @param router
   * @param appToken
   * @param routerDataToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly lookUpService: LookupService,
    readonly memberService: MemberService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(alertService, lookUpService, memberService, appToken);
  }

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }

  /** Method to set all lov lists on component load */
  setLovLists() {
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.cityList$ = this.lookUpService.getCityList();
    this.gccCountryList$ = this.lookUpService.getGccCountryList(false);
    this.genderList$ = this.lookUpService.getGenderList();
    this.doctorType$ = this.lookUpService.getContractTypeList();
    this.medicalboardtype$ = this.lookUpService.getMedicalBoardTypeList();
    this.specialty$ = this.lookUpService.getSpecialityList();
    this.region$ = this.lookUpService.getRegionsList(); //TODO Use Camel Case
    this.hospital$ = this.lookUpService.getHospitalList(); //TODO If lookup service is more than 500 create a MedicalBoardLokkupService similar to EstablishmentLooupService
    this.feespervisit$ = this.lookUpService.getFeespervisitList();
  }

  /** Method to initialize keys from payload. */
  initializeToken(): void {
    this.referenceNo = this.routerDataToken.transactionId;
    const payload = JSON.parse(this.routerDataToken.payload);
    if (payload) {
      this.professionalId = Number(payload.professionalId);
      this.contractId = Number(payload.contractId);
      this.channel = payload.channel;
    }
    this.transactionReferenceData = this.routerDataToken.comments;
  }

  /** Method to fetch required documents on return. */
  getRequiredMemberDocuments(
    docTransactionId: string,
    docTransactionType: string | string[],
    contractId: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(docTransactionId, docTransactionType, contractId).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /**
   * This method is to hide the modal reference
   */
  hideModal() {
    this.modalRef.hide();
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

}
