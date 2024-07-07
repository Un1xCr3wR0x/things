import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddressDetails,
  AlertService,
  ApplicationTypeToken,
  LanguageToken,
  LookupService,
  MobileDetails,
  BilingualText,
  scrollToTop,
  ApplicationTypeEnum,
  DocumentItem,
  DocumentService,
  AuthTokenService,
  GosiCalendar,
  RoleIdEnum,
  GosiStartDate,
  BenefitsGosiShowRolesConstants,
  MenuService
} from '@gosi-ui/core';
import { BehaviorSubject, noop } from 'rxjs';
import { MbBaseScComponent } from '../../../shared/components';
import { MBConstants, MbRouteConstants, SamaStatusConstants } from '../../../shared/constants';
import { MbProfile, UnAvailableData, UnAvailabilityPeriod, Person, Contracts } from '../../../shared/models';
import { PersonTypeEnum } from '../../../shared/enums/person-type-enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import moment from 'moment';
import { MemberService, DoctorService } from '../../../shared/services';
import { SamaStatusEnum, MbTransactionTypeEnum } from '../../../shared';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-personal-details-sc',
  templateUrl: './personal-details-sc.component.html',
  styleUrls: ['./personal-details-sc.component.scss']
})
export class PersonalDetailsScComponent extends MbBaseScComponent implements OnInit, OnDestroy {
  person: MbProfile = new MbProfile();
  bankDetailsEditUrl: string;
  contractedDoc: Person;
  bsModalRef: BsModalRef;
  contractDoctorDetails: ContractDoctorDetails;
  // unavailableDetails: UnAvailabilityPeriod;
  unavailableList: UnAvailabilityPeriod[];
  lang = 'en';
  addresses: AddressDetails[];
  currentMailing: string;
  unavailbeList: UnAvailableData[];
  identificationNo: number;
  itemEndDate: GosiCalendar;
  nurse = false;
  visitingDoctor = false;
  showTerminateOption = false;
  removeMessage: BilingualText = new BilingualText();
  index: number;
  showPeriod: boolean;
  isInActive: boolean;
  isContractedActive: boolean;
  contractId: number;
  bankStatus: BilingualText;
  PersonTypeEnum = PersonTypeEnum;
  date1: Date;
  date2: Date;
  // @ViewChild('warningTemplate', { static: true })
  warningTemplate: TemplateRef<HTMLElement>;
  modalHeading = '';
  warningMessage = '';
  dismissible = false;
  documents: DocumentItem[] = [];
  jobSectorGovt = MBConstants.MB_JOBSECTOR_GOVERNMENT;
  jobSectorPrivt = MBConstants.MB_JOBSECTOR_PRIVATE;
  govtEmployee: boolean;
  contractIndex: number;
  isManagerLogin = false;
  onlyContractedArray: Contracts[] = [];
  onlyVisitingArray: Contracts[] = [];
  latestArray: Contracts[] = [];
  otherTypeArray = [];
  documentsArray: DocumentItem[] = [];
  latestDate = new Date();
  indexOfLatest: number;
  indexOfOther: number;
  isDoctorActionAccess = BenefitsGosiShowRolesConstants.DOCTOR_DETAILS_ACTION;
  isDoctorEditAccess = BenefitsGosiShowRolesConstants.DOCTOR_DETAILS_EDIT;
  isMemberEdit = false;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly lookUpService: LookupService,
    readonly doctorService: DoctorService,
    readonly documentService: DocumentService,
    readonly memberService: MemberService,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly bsModalService: BsModalService,
    private route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly menuService: MenuService
  ) {
    super(alertService, lookUpService, memberService, appToken);
  }

  ngOnInit(): void {
    this.isMemberEdit = this.menuService.isUserEntitled(this.isDoctorEditAccess);
    this.isMBApp = this.appToken === ApplicationTypeEnum.MEDICAL_BOARD ? true : false;
    // reaches this file through routing, so value in base wont be available here
    this.identificationNo = this.authTokenService.getIndividual() || this.authTokenService.getEstablishment();
    this.alertService.clearAlerts();
    this.showPeriod = false;
    this.isInActive = false;
    this.isContractedActive = false;
    this.route.parent.params.subscribe(params => {
      this.identificationNo = params.identificationNo || this.identificationNo;
    });
    this.language.subscribe(language => (this.lang = language));
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;

    if (this.isMBApp) {
      this.getPersonDetailsInApp(this.identificationNo);
      this.getPersonContractInApp(this.identificationNo);
    } else {
      this.getPersonDetails(this.identificationNo);
      this.getPersonContract(this.identificationNo);
      this.getUserRoles(); //To get role of a member (Manager or Officer)
    }
  }
  /**
   * Method to get the role of login person
   */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp[0].role.toString() === RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString()) {
      this.isManagerLogin = true;
    }
  }
  ngOnDestroy() {
    this.doctorService.responseMessage = null;
  }
  /**
   * Method to get Multiple documents loop is given
   */
  //As discussed with BE contract id is only expected from UI in payload and others are removed
  // DocumentTransactionId.MTN_MB_TERMINATE,
  // DocumentTransactionType.MEDICAL_BOARD

  getPersonContract(identificationNo) {
    this.doctorService.getContractDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
        if (this.memberperson.contracts.findIndex(eachContract => eachContract.status.english === 'Active') >= 0) {
          this.isContractedActive = true;
        }
        this.onlyContractedArray = this.memberperson.contracts.filter(eachitem => {
          return eachitem.contractType.english === PersonTypeEnum.ContractedDoctor;
        });
        this.onlyVisitingArray = this.memberperson.contracts.filter(eachitem => {
          return eachitem.contractType.english === PersonTypeEnum.VisitingDoctor;
        });
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.Nurse) {
          this.latestArray = this.memberperson.contracts;
          if (this.memberperson?.contracts.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
          }
        } else if (this.onlyVisitingArray.length && !this.onlyContractedArray.length) {
          this.latestArray = this.memberperson.contracts;
        } else if (!this.onlyVisitingArray.length && this.onlyContractedArray.length) {
          this.latestArray = this.memberperson.contracts;
          if (this.onlyContractedArray.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
          }
          this.showPeriod = true;
        } else if ((this.onlyVisitingArray.length && this.onlyContractedArray.length) > 0) {
          this.getLatestStartDate(this.onlyContractedArray, this.onlyVisitingArray);
          this.getlatestArray();
          if (this.onlyContractedArray.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
          }
          this.showPeriod = true;
        }
        this.getIndex();
        this.doctorService.setmbProfessionalId(this.memberperson?.contracts[0]?.mbProfessionalId);
        this.getPeriodData(this.memberperson?.contracts[0]?.mbProfessionalId);
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.Nurse) {
          this.nurse = true;
          this.showPeriod = false;
        }
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.VisitingDoctor) {
          this.visitingDoctor = true;
        }
      },
      err => this.showError(err)
    );
  }

  getDocuments() {
    for (let i = 0; i < this.person.contracts.length; i++) {
      const contractId = this.person?.contracts[i]?.contractId;
      this.documentService.getMultipleDocuments(contractId).subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
          // this.documentsArray.push
        }
        for (i = 0; i < this.documents.length; i++) {
          this.documentsArray.push(this.documents[i]);
        }
      });
    }
  }
  getDocumentsApp() {
    for (let i = 0; i < this.memberperson.contracts.length; i++) {
      const contractId = this.memberperson?.contracts[i]?.contractId;
      this.documentService.getMultipleDocuments(contractId).subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
          // this.documentsArray.push
        }
        for (i = 0; i < this.documents.length; i++) {
          this.documentsArray.push(this.documents[i]);
        }
      });
    }
  }

  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
        this.doctorService.setmbProfessionalId(this.person.contracts[0].mbProfessionalId);
        this.getPeriodData(this.person.contracts[0].mbProfessionalId);
        this.getDocuments();
        switch (this.person?.bankAccount?.verificationStatus) {
          case SamaStatusEnum.NotApplicable:
          case SamaStatusEnum.SamaVerified: {
            this.bankStatus = SamaStatusConstants.VERIFIED;
            break;
          }
          case SamaStatusEnum.SamaNotVerified:
          case SamaStatusEnum.SamaVerificationPending: {
            this.bankStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
            break;
          }
          case SamaStatusEnum.SamaVerificationFailed:
          case SamaStatusEnum.SamaIbanNotVerifiable: {
            this.bankStatus = SamaStatusConstants.VERIFICATION_FAILED;
            break;
          }
          case SamaStatusEnum.SamaExpired: {
            this.bankStatus = SamaStatusConstants.EXPIRED;
            break;
          }
          default: {
            this.bankStatus = null;
          }
        }
      },
      err => this.showError(err)
    );
  }

  getLatestStartDate(date1, date2) {
    date1 = moment(this.onlyContractedArray[0].startDate.gregorian);
    date2 = moment(this.onlyVisitingArray[0].startDate.gregorian);
    if (date1.isBefore(date2)) {
      this.latestDate = this.onlyVisitingArray[0].startDate.gregorian;
    } else {
      this.latestDate = this.onlyContractedArray[0].startDate.gregorian;
    }
  }

  getlatestArray() {
    if (this.latestDate === this.onlyVisitingArray[0].startDate.gregorian) {
      this.latestArray = this.onlyVisitingArray;
      this.otherTypeArray = this.onlyContractedArray;
    } else if (this.latestDate === this.onlyContractedArray[0].startDate.gregorian) {
      this.latestArray = this.onlyContractedArray;
      this.otherTypeArray = this.onlyVisitingArray;
    }
  }

  getIndex() {
    if(this.memberperson && this.memberperson?.contracts) {
      this.indexOfLatest = this.memberperson.contracts.findIndex(
        eachContract => eachContract?.contractId === this.latestArray[0]?.contractId
      );
      this.indexOfOther = this.memberperson.contracts.findIndex(
        eachContract => eachContract?.contractId === this.otherTypeArray[0]?.contractId
      );  
    }
  }

  getPersonContractInApp(identificationNo: number) {
    this.doctorService.getContractDataDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
        if (this.memberperson.contracts.findIndex(eachContract => eachContract.status.english === 'Active') >= 0) {
          this.isContractedActive = true;
        }
        this.getDocumentsApp();
        this.doctorService.setmbProfessionalId(this.memberperson?.contracts[0]?.mbProfessionalId);
        this.getPeriodDataInApp();
        this.onlyContractedArray = this.memberperson.contracts.filter(eachitem => {
          return eachitem.contractType.english === PersonTypeEnum.ContractedDoctor;
        });
        this.onlyVisitingArray = this.memberperson.contracts.filter(eachitem => {
          return eachitem.contractType.english === PersonTypeEnum.VisitingDoctor;
        });
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.Nurse) {
          this.latestArray = this.memberperson.contracts;
          if (this.memberperson?.contracts.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
          }
        } else if (this.onlyVisitingArray.length && !this.onlyContractedArray.length) {
          this.latestArray = this.memberperson.contracts;
        } else if (!this.onlyVisitingArray.length && this.onlyContractedArray.length) {
          this.latestArray = this.memberperson.contracts;
          if (this.onlyContractedArray.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
          }
          this.showPeriod = true;
        } else if ((this.onlyVisitingArray.length && this.onlyContractedArray.length) > 0) {
          this.getLatestStartDate(this.onlyContractedArray, this.onlyVisitingArray);
          this.getlatestArray();
          if (this.onlyContractedArray.findIndex(eachContract => eachContract.status.english === 'Active') < 0) {
            this.isInActive = true;
            this.showPeriod = true;
          }
        }
        this.getIndex();
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.Nurse) {
          this.nurse = true;
        }
        if (this.memberperson?.contracts[0]?.contractType.english === PersonTypeEnum.VisitingDoctor) {
          this.visitingDoctor = true;
        }
      },
      err => this.showError(err)
    );
  }

  getPersonDetailsInApp(identificationNo: number) {
    this.doctorService.getContractProfileDetail(identificationNo).subscribe(res => {
      this.contractDoctorDetails = res;
      this.person = new MbProfile();
      this.person.contactDetail = this.contractDoctorDetails.contactDetail;
      this.person.bankAccount = this.contractDoctorDetails.bankAccount;
      this.getDocumentsApp();
      switch (this.person?.bankAccount?.verificationStatus) {
        case SamaStatusEnum.NotApplicable:
        case SamaStatusEnum.SamaVerified: {
          this.bankStatus = SamaStatusConstants.VERIFIED;
          break;
        }
        case SamaStatusEnum.SamaNotVerified:
        case SamaStatusEnum.SamaVerificationPending: {
          this.bankStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
          break;
        }
        case SamaStatusEnum.SamaVerificationFailed:
        case SamaStatusEnum.SamaIbanNotVerifiable: {
          this.bankStatus = SamaStatusConstants.VERIFICATION_FAILED;
          break;
        }
        case SamaStatusEnum.SamaExpired: {
          this.bankStatus = SamaStatusConstants.EXPIRED;
          break;
        }

        default: {
          this.bankStatus = null;
        }
      }
    });
  }
  /** Method to get unavailable Period data */
  getPeriodData(professionalId) {
    this.doctorService.getUnavailablePeriod(professionalId)?.subscribe(
      res => {
        if (res) this.unavailableList = res;
      },
      err => this.showError(err)
    );
  }
  /** Method to get unavailable Period data in app */
  getPeriodDataInApp() {
    this.doctorService.getContractUnavailableDetails(this.identificationNo)?.subscribe(
      res => {
        if (res) this.unavailableList = res;
      },
      err => this.showError(err)
    );
  }

  /**
   * Method to get the isdcode prefix
   * @param isdCode
   */
  getISDCodePrefix(mobileNo: MobileDetails): string {
    let prefix;
    if (mobileNo === null || (mobileNo && mobileNo.primary === null)) {
      prefix = null;
    } else if (mobileNo && mobileNo.isdCodePrimary === null) {
      prefix = MBConstants.ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(MBConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (mobileNo && key === mobileNo.isdCodePrimary) {
          prefix = MBConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }

  cancelForm() {
    this.router.navigate([MbRouteConstants.ROUTE_LIST_MEDICAL_MEMBERS]);
  }
  onEditContactDetails() {
    const contactediturl = MbRouteConstants.ROUTE_PROFILE_CONTACT_DETAILS_EDIT(this.identificationNo);
    this.router.navigate([contactediturl]);
    this.alertService.clearAlerts();
    this.addresses = this.person.contactDetail.addresses;
    this.currentMailing = this.person.contactDetail.currentMailingAddress;
  }
  oneditAddressDetail() {
    const addressediturl = MbRouteConstants.ROUTE_PROFILE_ADDRESS_DETAILS_EDIT(this.identificationNo);
    this.router.navigate([addressediturl]);
  }
  oneditMemberDetails() {
    const memberediturl = MbRouteConstants.ROUTE_PROFILE_DOCTOR_DETAILS_EDIT(this.identificationNo);
    this.router.navigate([memberediturl]);
  }
  onBankDetaitsEdit() {
    const bankediturl = MbRouteConstants.ROUTE_PROFILE_BANK_DETAILS_EDIT(this.identificationNo);
    this.router.navigate([bankediturl]);
  }
  onaddUnavailableData() {
    const unavailableurl = MbRouteConstants.ROUTE_PROFILE_ADD_UNAVAILABLE_PERIOD(this.identificationNo);
    this.router.navigate([unavailableurl]);
  }
  addUnavailableData() {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_ADD_UNAVAILABLE_PERIOD(this.identificationNo)]);
  }
  modifyUnavailableData() {
    this.router.navigate([
      MbRouteConstants.ROUTE_PROFILE_MODIFY_UNAVAILABLE_PERIOD(
        this.identificationNo,
        this.unavailableList[this.index]?.calendarId
      )
    ]);
  }
  setIndex(index) {
    this.index = index;
  }
  showRemoveModal(template: TemplateRef<HTMLElement>) {
    const startDate = moment(this.unavailableList[this.index]?.startDate.gregorian).format('DD-MM-YYYY');
    const endDate = moment(this.unavailableList[this.index]?.endDate.gregorian).format('DD-MM-YYYY');
    this.removeMessage = MBConstants.REMOVEMESSAGE(startDate, endDate);
    this.modalRef = this.modalService.show(template);
  }
  removePeriod() {
    let periodData: UnAvailabilityPeriod = new UnAvailabilityPeriod();
    periodData = this.unavailableList[this.index];
    if (periodData) {
      periodData.calendarId = this.unavailableList[this.index]?.calendarId;
      periodData.professionalId = this.person?.contracts ? this.person?.contracts[0]?.mbProfessionalId : null;
    }
    if (!this.isMBApp) {
      this.doctorService
        .removeUnavailablePeriod(periodData)
        ?.pipe(
          tap(res => {
            scrollToTop();
            this.doctorService.responseMessage = res.confirmMessage;
            this.getPeriodData(this.person?.contracts[0]?.mbProfessionalId);
            this.modalRef?.hide();
          })
        )
        .subscribe(noop, err => {
          this.showErrorMessage(err);
          this.modalRef?.hide();
        });
    } else {
      this.doctorService
        .removeUnavailablePeriodInApp(this.identificationNo, periodData.calendarId)
        ?.pipe(
          tap(res => {
            scrollToTop();
            this.doctorService.responseMessage = res.confirmMessage;
            this.getPeriodDataInApp();
            this.modalRef?.hide();
          })
        )
        .subscribe(noop, err => {
          this.showErrorMessage(err);
          this.modalRef?.hide();
        });
    }
  }
  showErrorMessage(err) {
    if (err && err.error) {
      this.doctorService.responseMessage = null;
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  cancelRemoving() {
    this.modalRef.hide();
  }

  modifyContractDetails(warningTemplate: TemplateRef<HTMLElement>) {
    this.doctorService.setmbProfessionalId(this.person.contracts[0].mbProfessionalId);
    if (
      this.person?.contracts[this.contractIndex]?.resourceType === null &&
      this.person?.contracts[this.contractIndex]?.transactionTraceId === null
    ) {
      this.router.navigate([MbRouteConstants.ROUTE_PROFILE_MODIFY_CONTRACT(this.identificationNo, this.contractId)]);
    } else {
      const type = this.person?.contracts[this.contractIndex]?.resourceType;
      if (type === MbTransactionTypeEnum.MODIFY) {
        this.warningMessage = 'MEDICAL-BOARD.MODIFY-WARNING';
      } else if (type === MbTransactionTypeEnum.TERMINATE) {
        this.warningMessage = 'MEDICAL-BOARD.MODIFY-TRANSACTION-WARNING';
      }
      this.showModal(warningTemplate, 'lg');
      this.modalHeading = 'MEDICAL-BOARD.MODIFY';
    }
  }
  getContractId(contractId, i) {
    this.contractIndex = i;
    if (this.person?.contracts[i]?.endDate) {
      // this.hasEndDate = true; //removed hasEndDate added showTerminateOption variable
      this.itemEndDate = this.person?.contracts[i]?.endDate; // for checking future date scenerio
    }
    if (this.person?.contracts[i]?.contractType?.english === PersonTypeEnum.Nurse) {
      this.nurse = true;
    }
    if (this.person?.contracts[i]?.contractType?.english === PersonTypeEnum.VisitingDoctor) {
      this.visitingDoctor = true;
    } else {
      this.visitingDoctor = false;
    }
    this.contractId = contractId;
    if (!this.person?.contracts[i]?.endDate) {
      this.showTerminateOption = true; //If No end date terminate option should show for (contrac dr or  gosi dr or nurse )
    } else {
      this.showTerminateOption = false;
    }
  }

  terminateContract(warningTemplate: TemplateRef<HTMLElement>) {
    this.doctorService.setmbProfessionalId(this.person.contracts[0]?.mbProfessionalId);
    if (
      this.person?.contracts[this.contractIndex]?.resourceType === null &&
      this.person?.contracts[this.contractIndex]?.transactionTraceId === null
    ) {
      this.router.navigate([MbRouteConstants.ROUTE_PROFILE_TERMINATE_CONTRACT(this.identificationNo, this.contractId)]);
    } else {
      const type = this.person?.contracts[this.contractIndex]?.resourceType;
      this.showModal(warningTemplate, 'lg');
      this.warningMessage = 'MEDICAL-BOARD.TERMINATE-WARNING';
      if (type === MbTransactionTypeEnum.MODIFY) {
        this.warningMessage = 'MEDICAL-BOARD.TERMINATE-TRANSACTION-WARNING';
      } else if (type === MbTransactionTypeEnum.TERMINATE) {
        this.warningMessage = 'MEDICAL-BOARD.TERMINATE-WARNING';
      }
      this.modalHeading = 'MEDICAL-BOARD.TERMINATE';
    }
  }

  contractHistory(contractId: number) {
    if (this.isMBApp) {
      this.router.navigate([MbRouteConstants.ROUTE_CONTRACT_HISTORY(this.identificationNo, contractId)]);
    } else {
      this.router.navigate([
        MbRouteConstants.ROUTE_CONTRACT_HISTORY(this.memberperson?.contracts[0].mbProfessionalId, contractId)
      ]);
    }
  }

  /**
   * Method to show modal
   * @param template
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.bsModalService.show(modalRef, config);
  }

  /**
   * Method to cancel the transaction
   */
  closeModal() {
    this.bsModalRef.hide();
  }
}