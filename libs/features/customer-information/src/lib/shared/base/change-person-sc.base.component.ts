import { Directive, Inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  LookupService,
  LovList,
  Person,
  scrollToModalError,
  scrollToTop
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { PersonConstants } from '../constants/person-constants';
import { RequestLimit } from '../models';
import { ContactDetails, EducationDetails, FinancialDetails, PersonDetails } from '../models/profile-wrapper';
import { ChangePersonService } from '../services';
@Directive()
export abstract class ChangePersonScBaseComponent extends BaseComponent implements OnInit {
  // LovLists
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  itemsPerPage = 4;
  contributor = {
    socialInsuranceNo: 430138065,
    approvalStatus: 'WORKFLOW COMPLETED',
    vicIndicator: false,
    mergerStatus: null,
    mergedSocialInsuranceNo: null,
    person: {
      personId: 1039036938,
      nationality: {
        arabic: 'السعودية ',
        english: 'Saudi Arabia'
      },
      identity: [
        {
          idType: 'NIN',
          newNin: 1011226980,
          oldNinDateOfIssue: {
            gregorian: '2017-10-31T00:00:00.000Z',
            hijiri: '1439-02-11',
            entryFormat: 'HIJIRA'
          }
        }
      ],
      name: {
        arabic: {
          firstName: 'عيسى',
          secondName: 'عبدالله',
          thirdName: 'علي',
          familyName: 'العيسى'
        },
        english: {
          name: 'EISA ABDULLAH A ALEISA'
        }
      },
      sex: {
        arabic: 'ذكر',
        english: 'Male'
      },
      education: {
        arabic: 'ماجستير',
        english: 'Master'
      },
      specialization: {
        arabic: 'لايوجد',
        english: 'Non'
      },
      birthDate: {
        gregorian: '1960-12-19T00:00:00.000Z',
        hijiri: '1380-07-01',
        entryFormat: 'GREGORIAN'
      },
      maritalStatus: {
        arabic: 'متزوج',
        english: 'Married'
      },
      contactDetail: {
        addresses: [
          {
            type: 'NATIONAL',
            city: {
              arabic: 'الرياض',
              english: 'Riyadh'
            },
            buildingNo: '7700',
            postalCode: '11197',
            district: 'الرياض',
            streetName: 'الرياض',
            additionalNo: '3939',
            unitNo: '13336',
            cityDistrict: {
              arabic: 'الرياض',
              english: 'Riyadh'
            },
            latitude: null,
            longitude: null
          }
        ],
        emailId: {
          primary: 'noreply@gosi.gov.sa'
        },
        telephoneNo: {
          primary: '505274364',
          extensionPrimary: null,
          secondary: null,
          extensionSecondary: null
        },
        mobileNo: {
          primary: '0000000000',
          secondary: null,
          isdCodePrimary: null,
          isdCodeSecondary: null
        },
        faxNo: null,
        currentMailingAddress: 'NATIONAL',
        createdBy: 1929890,
        createdDate: {
          gregorian: '2021-10-21T15:02:18.000Z',
          hijiri: '1443-03-15',
          entryFormat: null
        },
        lastModifiedBy: 2010880,
        lastModifiedDate: {
          gregorian: '2022-02-01T04:22:46.000Z',
          hijiri: '1443-06-29',
          entryFormat: null
        },
        emergencyContactNo: null,
        mobileNoVerified: false
      },
      userPreferences: {
        commPreferences: 'Ar',
        contactPreferences: null
      },
      prisoner: false,
      student: false,
      govtEmp: false,
      personType: 'Saudi_Person',
      createdBy: 1929890,
      lastModifiedBy: 999,
      lastModifiedDate: {
        gregorian: '2022-05-22T23:04:48.000Z',
        hijiri: '1443-10-21',
        entryFormat: null
      },
      absherVerificationStatus: 'Success',
      ageInHijiri: 63
    },
    statusType: 'ACTIVE',
    hasActiveWorkFlow: false,
    contributorType: 'SAUDI',
    hasActiveTerminatedOrCancelled: true,
    bankAccountDetails: null,
    isBeneficiary: null,
    wpsWage: 0,
    totalWage: 88712,
    hasLiveEngagement: true,
    hasVICEngagement: false
  };
  nationalityList: Observable<LovList>;
  educationList: Observable<LovList>;
  specializationList: Observable<LovList>;
  cityList: Observable<LovList>;
  countryList: Observable<LovList>;
  gccCountryList: Observable<LovList>;
  sin: number;
  identifier: number;
  isCsr = false;
  showOtpError: boolean;
  personDetails: PersonDetails;
  educationDetails: EducationDetails;
  contactDetails: ContactDetails;
  financialDetails: FinancialDetails;
  userRoles: any;
  limitRequest: RequestLimit;
  //Documents
  personDocumentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;

  //ModalRef
  commonModalRef: BsModalRef;
  individualDetails: Person;
  personIdentifier: number;
  guestRole: any;
  showError = false;

  benefitRole: any;
  constructor(
    readonly changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly documentService,
    public modalService: BsModalService,
    readonly route: ActivatedRoute
  ) {
    super();
    if (appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
    } else {
      this.isCsr = false;
    }
  }
  ngOnInit() {}
  onSelectTab(tab) {
    if (tab === 1) {
      this.getFinancialDetails(this.identifier);
    }
  }
  /**
   * method for pagination
   * @param limitItem
   */
  onSelectPage(page: number) {
    this.limitRequest.pageNo = page - 1;
    this.limitRequest.pageSize = this.itemsPerPage;
    this.getFinancialDetails(this.identifier);
  }
  getFinancialDetails(identifier) {
    this.changePersonService.getFinancialDetails(identifier, this.limitRequest).subscribe(res => {
      this.financialDetails = res;
      // this.financialDetails.bankAccountList.filter(item => item.serviceType[0]?.english == 'DEFAULT');
      for (var i = 0; i < this.financialDetails.totalCount; i++) {
        if (this.financialDetails.bankAccountList[i].verificationStatus == 'Sama Not Verified') {
          this.financialDetails.bankAccountList[i].status.english = 'REQUIRES REVERIFICATION';
          this.financialDetails.bankAccountList[i].status.arabic = 'يتطلب إعادة تحقق';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Sama Verification Failed') {
          this.financialDetails.bankAccountList[i].status.english = 'REJECTED';
          this.financialDetails.bankAccountList[i].status.arabic = 'مرفوض';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Not Applicable') {
          this.financialDetails.bankAccountList[i].status.english = '';
          this.financialDetails.bankAccountList[i].status.arabic = '';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Sama iban not verifiable') {
          this.financialDetails.bankAccountList[i].status.english = 'NOT VERIFIABLE';
          this.financialDetails.bankAccountList[i].status.arabic = 'لا يمكن التحقق';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Sama Verified') {
          this.financialDetails.bankAccountList[i].status.english = 'VERIFIED';
          this.financialDetails.bankAccountList[i].status.arabic = 'تم التحقق';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Sama Verification Pending') {
          this.financialDetails.bankAccountList[i].status.english = 'PENDING';
          this.financialDetails.bankAccountList[i].status.arabic = 'قيد التحقق';
        } else if (this.financialDetails.bankAccountList[i].verificationStatus == 'Expired') {
          this.financialDetails.bankAccountList[i].status.english = 'EXPIRED';
          this.financialDetails.bankAccountList[i].status.arabic = 'انتهت صلاحية التحقق';
        }
      }
    });
  }
  initialiseLookups() {
    this.nationalityList = this.lookService.getNationalityList();
    this.countryList = this.lookService.getCountryList();
    this.gccCountryList = this.lookService.getGccCountryList();
    this.educationList = this.lookService.getEducationList();
    this.specializationList = this.lookService.getSpecializationList();
    this.cityList = this.lookService.getCityList();
  }

  /**
   *Method to Clear alerts
   */
  clearAlerts() {
    this.alertService.clearAlerts();
    this.clearAlert();
    if (this.personDocumentList) {
      this.personDocumentList.forEach(document => {
        document.uploadFailed = false;
      });
    }
  }

  /**
   *Method to Clear alerts when otp error is null
   */
  clearAlert() {
    this.showOtpError = false;
  }

  /* Document Functionalities */
  getDocumentList() {
    this.documentList$ = this.documentService.getRequiredDocuments(
      PersonConstants.NONSAUDI_DOCUMENT_TRANSACTION_KEY,
      PersonConstants.DOCUMENT_TRANSACTION_TYPE
    );
    this.documentList$.subscribe((documents: DocumentItem[]) => (this.personDocumentList = documents));
  }

  /**
   * Generic method to hide the modals
   */
  hideModal() {
    this.alertService.clearAlerts();
    this.clearAlert();
    this.commonModalRef?.hide();
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
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

  /**
   * Wrapper method to scroll to top of modal
   */
  goToTop() {
    scrollToTop();
  }

  /**
   * Wrapper method to scroll to top of modal
   */
  modalScroll() {
    scrollToModalError();
  }
  getProfileDetails(identifier) {
    if (identifier)
      this.changePersonService.getProfileDetails(identifier).subscribe(res => {
        this.personDetails = res.personDetails;
        this.educationDetails = res.educationDetails;
        this.contactDetails = res.contactDetails;
        this.sin = res.socialInsuranceNumber[0];
      });
  }

  // getIndividualDetails(searchRequest) {
  //   this.dashboardSearchService.searchIndividual(searchRequest).subscribe( res=> {
  //     this.individualDetails = res.listOfPersons[0];
  //     if(this.contributorService.NINDetails?.length > 0) {
  //       this.personIdentifier = this.contributorService.NINDetails[0].newNin;
  //     } else if (this.contributorService.IqamaDetails?.length > 0) {
  //       this.personIdentifier = this.contributorService.IqamaDetails[0].iqamaNo;
  //     }
  //     this.changePersonService.setSIN(res.listOfPersons[0]);
  //     this.changePersonService.setPersonInformation(res.listOfPersons[0]);
  //   });
  // }

  getPersonRoles(identifier) {
    if (identifier) {
      this.changePersonService.getPersonRoles(identifier).subscribe(res => {
        this.userRoles = res.personRoles;
        this.benefitRole =
          this.userRoles.length == 1 && this.userRoles.filter(item => item.role.english == 'Beneficiary').length != 0;
        this.guestRole =
          this.userRoles.length == 1 && this.userRoles.filter(item => item.role.english == 'Guest').length != 0;
      });
    }
  }
  //  fectchIdentifier(identifier) {
  //   this.identifier = identifier;
  //   if (identifier) {
  //     this.isSearch = true;
  //     this.getProfileDetails(identifier);
  //        this.changePersonService.getSinValue(identifier).subscribe(val => {
  //       this.sin = val?.listOfPersons[0]?.socialInsuranceNumber[0];
  //   });
  //   }
  // }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.showError = true;
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
}
