import { Component, Inject, OnInit } from '@angular/core';
import moment from 'moment';
import {
  DisabilityAssessmentService,
  MBConstants,
  MBPaymentHistory,
  MbRouteConstants,
  PaymentHistoryRequest,
  PaymentStatusEnum
} from '../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, BilingualText, LanguageToken, LookupService, Lov, LovList, downloadFile } from '@gosi-ui/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  paymentHistory: MBPaymentHistory;
  paymentRequest: PaymentHistoryRequest;
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  paymentHistoryForm: FormGroup;
  maxDate;
  filteredPaymentStatus: BilingualText[];
  filteredFieldOffice: BilingualText[];
  filteredMemberType: BilingualText[];
  statusList: LovList;
  fieldOfficeList: LovList;
  memberTypeList: LovList;
  sessionTypeList: LovList;
  paymentStatusMap = new Map();
  paymentGroup: string;
  contractDoctor = 'Contracted Doctor';
  nurse = 'Nurse';
  visitingDoctor = 'Visiting Doctor';
  statusArray: Array<BilingualText> = [];
  fieldOfficeArray: Array<BilingualText> = [];
  memberTypeArray: Array<BilingualText> = [];
  lang = 'en';
  constructor(
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.paymentStatusMap
      .set(PaymentStatusEnum.ESIGN, 'custom-blue')
      .set(PaymentStatusEnum.PAYMENT_INITIATED, 'custom-yellow')
      .set(PaymentStatusEnum.PAYMENT_DONE, 'custom-green')
      .set(PaymentStatusEnum.PAYMENT_HOLD, 'custom-orange')
      .set(PaymentStatusEnum.PAYMENT_FAILED, 'custom-red');
    this.maxDate = new Date();
    this.setLovList();
    this.setPaymentHistoryForm();
    this.paymentRequest = new PaymentHistoryRequest();
    this.getCurrentDetails();
    this.paymentRequest.memberType = this.paymentGroup = this.contractDoctor;
    this.getPaymentHistory(this.paymentRequest);
  }
  /* Method to set lov list */
  setLovList() {
    const sessionType: Lov[] = [
      { value: { english: 'Appeal Medical Board', arabic: 'اللجنة الطبية  الاستئنافية' }, sequence: 1 },
      { value: { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' }, sequence: 2 }
    ];
    this.sessionTypeList = new LovList(sessionType);
    this.getPaymentStatusList();
    this.getFieldOfficeLocation();
  }
  /* Method to set payment history form */
  setPaymentHistoryForm() {
    this.paymentHistoryForm = this.fb.group({
      sessionPeriod: [null],
      paymentStatus: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      foCode: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      sessionType: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      })
    });
  }
  /* Method to get payment history */
  getPaymentHistory(paymentRequest: PaymentHistoryRequest, statusArray?, fieldOfficeArray?) {
    this.disabilityAssessmentService
      .getPaymentHistory(paymentRequest, statusArray ? statusArray : null, fieldOfficeArray ? fieldOfficeArray : null)
      .subscribe(res => {
        this.paymentHistory = res;
      });
  }
  /**method to select page */
  selectPage(page: number): void {
    this.currentPage = this.pageDetails.currentPage = page;
    this.paymentRequest.pageNo = this.currentPage;
    this.paymentRequest.pageSize = 10;
    this.paymentRequest.memberType = this.paymentGroup;
    this.getPaymentHistory({ ...this.paymentRequest, pageNo: this.currentPage });
  }
  /* Method to search by member name, member id and session id */
  onSearch(searchTerm: string) {
    this.pageDetails.currentPage = 1;
    this.getPaymentHistory({ ...this.paymentRequest, searchKey: searchTerm });
  }
  /* Method to download xls */
  downloadXLS() {
    this.getCurrentDetails();
    this.paymentRequest.memberType = '';
    this.disabilityAssessmentService
      .getPaymentHistoryReport(
        this.lang,
        this.paymentRequest,
        this.statusArray ? this.statusArray : null,
        this.fieldOfficeArray ? this.fieldOfficeArray : null
      )
      .subscribe(
        res => {
          downloadFile(MBConstants.DOWNLOAD_EXCEL + '.xlsx', 'application/vnd.ms-excel', res);
        },
        err => {
          this.alertService.showErrorByKey(err.error.message);
        }
      );
  }
  /* Method on modal scroll */
  onScroll() {}
  /* Method to filter payment history */
  applyFilter() {
    const paymentHistoryValue = this.paymentHistoryForm?.value;
    this.paymentRequest = {
      ...paymentHistoryValue,
      startDate: paymentHistoryValue?.sessionPeriod
        ? moment(paymentHistoryValue?.sessionPeriod[0]).format('YYYY-MM-DD')
        : null,
      endDate: paymentHistoryValue?.sessionPeriod
        ? moment(paymentHistoryValue?.sessionPeriod[1]).format('YYYY-MM-DD')
        : null,
      sessionType: paymentHistoryValue?.sessionType?.english,
      paymentStatus: paymentHistoryValue?.paymentStatus?.english?.map(status => status?.english),
      foCode: paymentHistoryValue?.foCode?.english?.map(status => status?.english),
      memberType: this.paymentGroup,
      pageNo: this.currentPage,
      pageSize: this.itemsPerPage
    };
    delete this.paymentRequest['sessionPeriod'];
    this.getPaymentHistory(this.paymentRequest, this.statusArray, this.fieldOfficeArray);
  }
  /* Method to reset filter */
  clearAllFiters() {
    this.paymentHistoryForm.reset();
    this.statusArray = [];
    this.fieldOfficeArray = [];
  }
  /* Method to select filter values */
  selectedValue(value) {
    this.statusArray = value;
  }
  selectedVal(val) {
    this.fieldOfficeArray = val;
  }
  // selectedData(data) {
  //   this.memberTypeArray = data;
  // }
  /* Method to get status color */
  getStatusColor(status) {
    return this.paymentStatusMap.get(status);
  }
  /* Method to get selected session type */
  listenForsessionType(type) {}
  /* Method to get field office lov */
  getFieldOfficeLocation() {
    this.lookupService.getFieldOfficeList().subscribe(offices => (this.fieldOfficeList = offices));
  }
  getMembers(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
  }
  getSession(sessionId: number) {
    this.disabilityAssessmentService.isCompleted = true;
    this.disabilityAssessmentService.sessionId = sessionId;
    this.router.navigate([MbRouteConstants.ROUTE_MEDICAL_SESSION]);
  }
  selectTab(paymentItem) {
    this.currentPage = 1;
    this.paymentRequest.pageNo = this.pageDetails.currentPage = this.currentPage;
    this.paymentGroup = paymentItem;
    this.paymentRequest.memberType = this.paymentGroup;
    this.getPaymentHistory(this.paymentRequest);
  }
  getPaymentStatusList() {
    this.lookupService.getPaymentStatusList().subscribe(res => {
      this.statusList = res;
    });
  }
  getCurrentDetails() {
    this.paymentRequest.pageNo = this.currentPage;
    this.paymentRequest.pageSize = this.itemsPerPage;
  }
}
