import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Inject, SimpleChanges } from '@angular/core';
import { PersonBankDetails } from '@gosi-ui/features/contributor/lib/shared/models/person-bank-details';
import { AuthorizerDto, ChangePersonService, ManagePersonService, RequestLimit } from '../../../shared';
import {
  Person,
  BankAccount,
  DocumentItem,
  LanguageToken,
  AlertService,
  StorageService,
  AuthTokenService,
  RoleIdEnum,
  getPersonNameAsBilingual,
  CoreContributorService
} from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { DropDownItems, ContributorService, PPABankAccount } from '@gosi-ui/features/contributor';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BenefitDocumentService } from '../../../shared/services/benefit-document.service';
import { BenefitPaymentDetails } from '../../../shared/models/benefits';
import { VerifyBankDetails } from '../../../shared/models/benefits/verify-bank-details';
import { IndividualDashboardService } from '@gosi-ui/foundation-dashboard/lib/individual-app/services/individual-dashboard.service';
import { EngagementDetails } from '@gosi-ui/foundation-dashboard/lib/individual-app/models/engagement-details';
import { ManageBenefitService } from '@gosi-ui/features/benefits/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';

@Component({
  selector: 'cim-financial-details-sc',
  templateUrl: './financial-details-sc.component.html',
  styleUrls: ['./financial-details-sc.component.scss']
})
export class FinancialDetailsScComponent implements OnInit {
  count: number;
  bankAccountList: PersonBankDetails[];
  PPABankAccountList: PPABankAccount[];
  sin: number;
  showdefault: boolean = false;
  param: number;
  ibanList = [];
  accessRoles: string[] = [];
  addBankAccess: boolean;
  engagementDetails: EngagementDetails[];
  overallEngagements: EngagementDetails[];
  activeEngagementPpa = false;
  AnyEngagementNotPpa = false;
  hideButtonForPpa = false;
  ppaEstablishment: boolean;
  constructor(
    readonly managePersonService: ManagePersonService,
    readonly changePersonService: ChangePersonService,
    readonly contributorService: ContributorService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly alertService: AlertService,
    readonly storageService: StorageService,
    readonly authTokenService: AuthTokenService,
    private manageService: ManagePersonService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly coreContributorService: CoreContributorService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dashboardSearchService: DashboardSearchService
  ) {}

  bankDetails: PersonBankDetails = new PersonBankDetails();
  bankVerifyDetails: VerifyBankDetails = new VerifyBankDetails();
  authorDetails: AuthorizerDto;
  personDtls: Person;
  personId: number;
  bankAccount: BankAccount;
  identifier: number;
  personIdentifier: number;
  t: any[];
  tCount: number;
  estPagination = 'estPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 4;
  limitItem: RequestLimit = new RequestLimit();
  dropdownList1: DropDownItems[] = [
    {
      id: 1,
      icon: 'pencil-alt',
      value: {
        english: 'Update Default Bank Account',
        arabic: 'تحديث الحساب البنكي الافتراضي'
      }
    }
  ];
  dropdownList2: DropDownItems[] = [
    {
      id: 1,
      icon: 'pencil-alt',
      value: {
        english: 'Change to Default Bank Account',
        arabic: 'تعيين كحساب افتراضي'
      }
    }
  ];
  dropdownList: DropDownItems[] = [
    {
      id: 1,
      icon: 'file-invoice',
      value: {
        english: 'View bank commitment',
        arabic: 'عرض الالتزام البنكي'
      }
    },
    {
      id: 2,
      icon: 'trash-alt',
      value: {
        english: 'Remove bank commitment',
        arabic: 'إزالة الالتزام البنكي'
      }
    }
  ];
  showViewBC: boolean = false;
  showRemoveBC: boolean = false;
  documentList: DocumentItem[] = [];
  commonModalRef: BsModalRef;
  benefitDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  viewCommitment: TemplateRef<HTMLElement>;
  removeCommitment: TemplateRef<HTMLElement>;
  lang = 'en';
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() selected: EventEmitter<string> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    this.language.subscribe(lang => (this.lang = lang));
  }

  ngOnInit(): void {
    this.alertService.clearAllErrorAlerts();
    this.getAccessRoles();
    this.language.subscribe(lang => (this.lang = lang));
    this.ppaEstablishment = this.dashboardSearchService.ppaEstablishment;
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      this.param = Number(params.get('personId'));
      if (params.get('personId') && (this.storageService.getSessionValue('idType') == 'NIN' || 'IQAMA' || 'SIN')) {
        this.personIdentifier = this.param;
        this.getPPABankAccounts();
      }
    });
    this.changePersonService.getPersonID().subscribe(res => {
      this.personId = res;
      this.getBankDetails();
      if (this.sin) this.fetchEngagementDetails(this.sin);
    });
    this.changePersonService.getSocialInsuranceNo().subscribe(res => {
      this.sin = res;
    });
    this.getAuthorizationDetails();
    this.t = [];
    if (this.sin) this.fetchEngagementDetails(this.sin);
  }
  selectedItem(selectedValue: BankAccount) {}

  fetchEngagementDetails(sin: number) {
    this.individualAppDashboardService.getEngagementFullDetails(sin).subscribe(res => {
      this.engagementDetails = res.activeEngagements;
      this.overallEngagements = res.overallEngagements;
      if (this.ppaEstablishment) {
        this.hideButtonForPpa = true;
      } else {
        if (this.engagementDetails.length > 0) {
          this.engagementDetails.forEach(item => {
            this.activeEngagementPpa = item?.ppaIndicator;
          });
        }
        if (this.overallEngagements.length > 0) {
          if (this.overallEngagements.findIndex(item => item.ppaIndicator === false) >= 0) {
            this.AnyEngagementNotPpa = true;
          }
        }
        //PPA
        if (this.activeEngagementPpa && !this.AnyEngagementNotPpa) {
          this.hideButtonForPpa = true;
        } else if (this.engagementDetails.length == 0 && this.overallEngagements.length == 0) {
          this.hideButtonForPpa = false;
        } else if (this.engagementDetails.length == 0) {
          this.hideButtonForPpa = !this.AnyEngagementNotPpa ? true : false;
        } else if (this.overallEngagements.length == 0 && this.activeEngagementPpa) {
          this.hideButtonForPpa = true;
        }
      }
    });
  }
  getAccessRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.accessRoles = gosiscp ? gosiscp?.[0].role?.map(r => r.toString()) : [];
    if (this.accessRoles.includes(RoleIdEnum.CSR.toString())) {
      this.addBankAccess = true;
    }
  }

  /** This method is for stoping the clcik event. */
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  selectPage(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNo;
      this.limitItem.pageNo = pageNo - 1;
      this.onLimit();
    }
  }

  private onLimit() {
    this.limit.emit(this.limitItem);
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }

  /**
   *
   * @param document
   */
  openImage(document) {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + document.documentContent;
    const w = window.open('');
    w.document.write(img.outerHTML);
  }

  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }

  getDocumentsForViewBank() {
    this.benefitDocumentService
      .getUploadedDocuments(1003880624, 'RESTART_BENEFIT', 'REQUEST_BENEFIT_FO')
      .subscribe(res => {
        this.documentList = res;
      });
  }

  getBankDetails() {
    if (this.personId) {
      this.managePersonService.getBankAccountList(this.personId).subscribe(res => {
        this.bankAccountList = res?.bankAccountList;
        this.count = this.bankAccountList.length;
        for (let i = 0; i < this.count; i++) {
          this.ibanList.push(this.bankAccountList[i].ibanBankAccountNo);
        }
        this.managePersonService.setIbanList(this.ibanList);
        let filterData = this.bankAccountList.filter(item => item.serviceType[0]?.english == 'DEFAULT');
        for (var i = 0; i < this.count; i++) {
          if (this.bankAccountList[i].verificationStatus == 'Sama Not Verified') {
            this.bankAccountList[i].status.english = 'SAMA NOT VERIFIED';
            this.bankAccountList[i].status.arabic = 'لم يتم التحقق';
          } else if (this.bankAccountList[i].verificationStatus == 'Sama Verification Failed') {
            this.bankAccountList[i].status.english = 'REJECTED';
            this.bankAccountList[i].status.arabic = 'مرفوض';
          } else if (this.bankAccountList[i].verificationStatus == 'Not Applicable') {
            this.bankAccountList[i].status.english = '';
            this.bankAccountList[i].status.arabic = '';
          } else if (this.bankAccountList[i].verificationStatus == 'Sama iban not verifiable') {
            this.bankAccountList[i].status.english = 'NOT VERIFIABLE';
            this.bankAccountList[i].status.arabic = 'لا يمكن التحقق';
          } else if (this.bankAccountList[i].verificationStatus == 'Sama Verified') {
            this.bankAccountList[i].status.english = 'ACTIVE';
            this.bankAccountList[i].status.arabic = 'تم التحقق';
          } else if (this.bankAccountList[i].verificationStatus == 'Sama Verification Pending') {
            this.bankAccountList[i].status.english = 'PENDING';
            this.bankAccountList[i].status.arabic = 'قيد التحقق';
          } else if (this.bankAccountList[i].verificationStatus == 'Expired') {
            this.bankAccountList[i].status.english = 'EXPIRED';
            this.bankAccountList[i].status.arabic = 'انتهت صلاحية التحقق';
          }
        }

        let pendingData = this.bankAccountList.filter(item => item.status?.english == 'PENDING');
        let activeData = this.bankAccountList.filter(item => item.status?.english == 'ACTIVE');
        if (filterData.length != 0 && activeData.length != 0) {
          this.showdefault = true;
        } else if (filterData.length != 0 && pendingData.length != 0) {
          this.showdefault = true;
        } else {
          this.showdefault = false;
        }
      });
    }
  }

  showCommitment(templateRef: TemplateRef<HTMLElement>, selectedValue: string, account: PersonBankDetails) {
    if (account.bankName.english != null) this.benefitDetails.bankName = account.bankName;
    this.benefitDetails.account = account;
    if (selectedValue == '1') {
      this.managePersonService
        .getBenefitsWithStatus(this.sin, ['Active', 'Draft', 'In Progress'])
        .subscribe(response => {});
      this.showViewBC = true;
      this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
    } else if (selectedValue == '2') {
      this.showRemoveBC = true;
      this.managePersonService.setBankDetails(account);

      /** commenting out to remove the annuity dependency */
      // this.router.navigate(['home/benefits/annuity/remove-commitment'],{queryParams: {
      //   iban: account.ibanBankAccountNo
      // }});
    }
    //this.getDocumentsForViewBank();
  }

  updateDefault() {
    // this.addNewBank();
    this.router.navigate([`/home/profile/${this.param}/add-bank`], {
      queryParams: {
        fromPage: 'updateDefault'
      }
    });
  }

  getAuthorizationDetails() {
    this.managePersonService.getAuthorizationDetails(this.personIdentifier).subscribe(res => {
      if (res) {
        res.authorizationList.forEach((res: any) => {
          this.authorDetails = {
            name:
              res.authorizationType.english == 'Custody'
                ? this.getPersonName(res.custodian.name)
                : this.getPersonName(res.agent.name),
            authorisorId: res.authorizationId,
            source: res.authorizationSource,
            certificateExpiryDate: res.endDate,
            type: res.authorizationType,
            status: res.status
          };
          this.t.push(this.authorDetails);
        });
      }
    });
  }

  /** Method to get person name. */
  getPersonName(name) {
    const personName = getPersonNameAsBilingual(name);
    if (!personName.english) personName.english = personName.arabic;
    return personName;
  }

  addNewBank() {
    this.router.navigate([`/home/profile/${this.param}/add-bank`]);
  }

  verification(bankAccount) {
    this.bankVerifyDetails.bankAddress = bankAccount.bankAddress;
    this.bankVerifyDetails.serviceType = bankAccount.serviceType[0]?.english;
    this.bankVerifyDetails.bankCode = bankAccount.bankCode;
    this.bankVerifyDetails.bankName = bankAccount.bankName;
    this.bankVerifyDetails.ibanBankAccountNo = bankAccount.ibanBankAccountNo;
    this.bankVerifyDetails.nonSaudiIBAN = false;
    this.manageService.verifyBankDetails(this.personId, this.bankVerifyDetails).subscribe(
      res => {
        //this.referenceNo = res?.referenceNo;
        this.alertService.clearAlerts();
        this.alertService.showSuccess(res?.bilingualMessage);
        this.getBankDetails();
      },
      error => {
        if (error.message) {
          this.alertService.showError(error.message);
        }
      }
    );
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, account: PersonBankDetails, size?: string) {
    this.bankDetails = account;
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }

  confirmChange() {
    this.hideModal();
    this.verification(this.bankDetails);
  }
  navigateToAuthorizationView(account) {
    this.router.navigate([`home/contributor/add-authorization/view`], {
      queryParams: {
        authType: account.type.english.toLocaleLowerCase(),
        authorizationId: account.authorisorId
      }
    });
  }

  getPPABankAccounts() {
    if (this.personIdentifier) {
      this.managePersonService.getPPABankAccounts(this.personIdentifier).subscribe(res => {
        this.PPABankAccountList = res.BankAccounts;
      });
    }
  }
}
