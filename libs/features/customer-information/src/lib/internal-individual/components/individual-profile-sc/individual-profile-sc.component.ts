import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  CoreContributorService,
  StorageService,
  RoleIdEnum,
  JWTPayload,
  SendSMSNotificationService,
  BilingualText,
  VerifyNiNumberService,
  MenuService,
  AuthTokenService,
  CoreAdjustmentService,
  checkIqamaOrBorderOrPassport,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ChangePersonScBaseComponent, ChangePersonService, ManagePersonService, ProfileAction } from '../../../shared';
import { ProfileActionConstants } from '../../../shared/constants/profile-action-constants';
import { QuickLinkActionContants } from '../../../shared/constants/quicklink-action-constants';
import { TransactionService as TransactionRoutingService } from '@gosi-ui/core';
import { OhService, Route } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/src/lib/shared/models';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { Location } from '@angular/common';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { VerifyNinumberDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets/verify-ninumber-dc/verify-ninumber-dc.component';
import { SendMessageDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets/send-message-dc/send-message-dc.component';
import { SendAttorneyDcComponent } from '../send-attorney-dc/send-attorney-dc.component';
import { AttorneyService } from '../../../shared/services/attorney.service';
import { AttorneyInquiryAuthorizerList } from '../../../shared/models/attorney/attorney-inquiry-authorizer-list';
import { Environment, EnvironmentToken } from '@gosi-ui/core';

@Component({
  selector: 'cim-individual-profile-sc',
  templateUrl: './individual-profile-sc.component.html',
  styleUrls: ['./individual-profile-sc.component.scss']
})
export class IndividualProfileScComponent extends ChangePersonScBaseComponent implements OnInit {
  personId: number;
  isClicked = false;
  profileAction: ProfileAction[] = [];
  quickLinkAction: ProfileAction[] = [];
  lang = 'en';
  showError: boolean;
  searchRequest: SearchRequest = new SearchRequest();
  param: number;
  isMouseHoverIndex: number = -1;
  estRegNo: number;
  fromEstablishment: boolean;
  enableBack: boolean;

  // related to verify NIN start
  isShowSendOtpBtn = false;
  uuid: string;
  isVerified = false;
  isSend = false;
  isResend = false;
  curNinumber = null;
  @ViewChild('verifyNinumberDcComp', { static: false })
  verifyNinumberDcComp: VerifyNinumberDcComponent;
  // related to verify NIN end

  // related to send SMS start
  isShowSmsBtn = false;
  accessRoles = [RoleIdEnum.SEND_SMS];
  modalRef: BsModalRef;
  isSendMessage = false;
  curMobileNumber = null;
  invalidMSISDN = null;
  messageID = null;
  status = null;
  statusDescription = null;
  responseTypes: SMSResponseType[];
  details = 'individual';
  token: JWTPayload;
  selectedLang = 'en';
  error: BilingualText;
  @ViewChild('sendMessageDcComp', { static: false })
  sendMessageDcComp: SendMessageDcComponent;
  accessRolesBenefits = [
    RoleIdEnum.CSR,
    RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
    RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
    RoleIdEnum.INS_PROT_EXT_SPVSR,
    RoleIdEnum.GCC_CSR,
    RoleIdEnum.RELATION_OFFICER,
    RoleIdEnum.CALL_CENTRE_AGENT,
    RoleIdEnum.INS_BENF_OFFICER_SPVR,
    RoleIdEnum.REG_CONT_OPER_SPVSR,
    RoleIdEnum.COLLECTION_OFFICER,
    RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_MANAGER,
    RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
    RoleIdEnum.CUSTOMER_CARE_OFFICER,
    RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
    RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
    RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
    RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
    RoleIdEnum.GDISO,
    RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
    RoleIdEnum.BENEFIT_SEARCH_READ,
    RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE,
    RoleIdEnum.SUBSCRIBER,
    RoleIdEnum.VIC,
    RoleIdEnum.BENEFICIARY,
    RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO,
    RoleIdEnum.BOARD_OFFICER
  ];
  // related to send SMS end

  // related to send Attorney start
  isShowSendAttorneyBtn = false;
  isAttorneyVerified = false;
  attorneyError: boolean;
  isAttorneySend = false;
  attorneyStatus: string;
  agentFullName: string;
  agentId: string;
  agentIsValid: string;
  authorizerListFullName: string;
  authorizerListId: string;
  authorizerListIsValid: string;
  attorneyText: string;
  authList: AttorneyInquiryAuthorizerList[];
  @ViewChild('sendAttorneyDcComp', { static: false })
  sendAttorneyDcComp: SendAttorneyDcComponent;
  roleParam: number;
  showRaiseQuicklink: boolean = false;
  // related to send Attorney end

  constructor(
    readonly menuService: MenuService,
    readonly authService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly coreContributorService: CoreContributorService,
    readonly contributorService: ContributorService,
    readonly transactionService: TransactionService,
    readonly manageService: ManagePersonService,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(EnvironmentToken) private environment: Environment,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly activatedRoute: ActivatedRoute,
    public modalService: BsModalService,
    private storageService: StorageService,
    readonly txnService: TransactionRoutingService,
    readonly ohService: OhService,
    readonly sendSMSNotificationService: SendSMSNotificationService,
    readonly verifyNiNumberService: VerifyNiNumberService,
    readonly attorneyService: AttorneyService,
    readonly router: Router,
    readonly location: Location,
    readonly coreAdjustmentService: CoreAdjustmentService
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
      activatedRoute
    );
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state?.loadPageWithLabel == 'BENEFITS') {
      this.enableBack = true;
    } else this.enableBack = false;
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot['_routerState'].url.includes('engagements/establishment')) {
      this.storageService.setLocalValue('fromEstablishment', true);
      this.fromEstablishment = true;
      this.estRegNo = this.dashboardSearchService.registrationNo;
      // console.log("estRegNo is", this.estRegNo)
      this.ohService.setRegistrationNo(this.estRegNo);
      this.coreContributorService.registartionNo = this.estRegNo;
    } else if (this.activatedRoute.snapshot['_routerState'].url.includes('/benefits')) {
      this.enableBack = true;
    }
    this.storageService.setLocalValue('individualProfile', true);
    this.language.subscribe(lang => (this.lang = lang));
    this.activatedRoute.params.subscribe(param => {
      if (param) this.personId = param.personId;
      this.changePersonService.setURLId(this.personId);
      const idType = this.storageService.getSessionValue('idType');
      if (idType == 'NIN' || 'IQAMA' || 'SIN') this.searchRequest.searchKey = this.personId.toString();
      else if (idType == 'GCCID') this.searchRequest.searchParam.gccId = Number(this.personId);
      else if (idType == 'BORDERNO') this.searchRequest.searchParam.borderNo = Number(this.personId);

      this.changePersonService.setSearchRequest(this.searchRequest);
      this.getIndividualDetails(this.searchRequest);
      this.token = this.authService.decodeToken(this.authService.getAuthToken());
      this.menuService.showSMSMessage.next(false);
      this.showSmsButton();
      this.showSendOtpBtn();
    });
    if (this.routerData?.previousOwnerRole === 'repatriation') {
      this.routerData.resourceType = 'Add dead body repatriation';
    }
    this.alertService.clearAllErrorAlerts();
  }

  getIndividualDetails(searchRequest) {
    this.dashboardSearchService.searchIndividual(searchRequest, false).subscribe(res => {
      let count = 0;
      res.listOfPersons.forEach(person => {
        if (person.socialInsuranceNumber[0]?.toString() === searchRequest.searchKey) {
          this.individualDetails = person;
          this.changePersonService._socialInsuranceNo.next(person.socialInsuranceNumber[0]);
          this.changePersonService._personId.next(person.personId);
          this.changePersonService.setSIN(person);
          this.changePersonService.setPersonInformation(person);
          this.changePersonService._personInfo.next(person);
          count++;
        }
      });
      if (count === 0) {
        this.individualDetails = res.listOfPersons[0];
        this.changePersonService._socialInsuranceNo.next(res.listOfPersons[0].socialInsuranceNumber[0]);
        this.changePersonService._personId.next(res.listOfPersons[0].personId);
        this.changePersonService.setSIN(res.listOfPersons[0]);
        this.changePersonService.setPersonInformation(res.listOfPersons[0]);
        this.changePersonService._personInfo.next(res.listOfPersons[0]);
      }
      //this.individualDetails = res.listOfPersons[0];
      this.activatedRoute.params.subscribe(params => {
        if (params.personId && (this.storageService.getSessionValue('idType') == 'NIN' || 'IQAMA')) {
          this.personIdentifier = Number(params.personId);
        }
      });
      // this.changePersonService._socialInsuranceNo.next(res.listOfPersons[0].socialInsuranceNumber[0]);
      // this.changePersonService._personId.next(res.listOfPersons[0].personId);
      // this.changePersonService.setSIN(res.listOfPersons[0]);
      // this.changePersonService.setPersonInformation(res.listOfPersons[0]);
      // this.changePersonService._personInfo.next(res.listOfPersons[0]);

      const NINArr = this.individualDetails?.identity.filter(x => x.idType == 'NIN');
      const IQAMAArr = this.individualDetails?.identity.filter(x => x.idType == 'IQAMA');
      const GCCIdArr = this.individualDetails?.identity.filter(x => x.idType == 'GCCID');
      const BorderNoArr = this.individualDetails?.identity.filter(x => x.idType == 'BORDERNO');
      const PassportArr = this.individualDetails?.identity.filter(x => x.idType == 'PASSPORT');

      let identifierArr;
      if (NINArr.length) identifierArr = NINArr;
      else if (IQAMAArr.length) identifierArr = IQAMAArr;
      else if (GCCIdArr.length) identifierArr = GCCIdArr;
      else if (BorderNoArr.length) identifierArr = BorderNoArr;
      else if (PassportArr.length) identifierArr = PassportArr;
      this.changePersonService._personIdentifierArr.next(identifierArr);

      this.contributorService.NINDetails = NINArr;
      this.contributorService.IqamaDetails = IQAMAArr;
      this.contributorService.GCCIdDetails = GCCIdArr;
      this.contributorService.BordeNoDetails = BorderNoArr;
      this.coreContributorService.NINDetails = NINArr;
      this.coreContributorService.IqamaDetails = IQAMAArr;
      this.coreContributorService.GCCIdDetails = GCCIdArr;
      this.coreContributorService.BordeNoDetails = BorderNoArr;
      this.checkContributor();
    });
  }

  navigateBack() {
    if (this.storageService.getLocalValue('fromEstablishment') === 'true') {
      this.router.navigate([`home/establishment/profile/${this.estRegNo}/view/contributor-list`]);
    } else if (this.enableBack) {
      this.location.back();
    } else this.router.navigate([`dashboard/search/individual`]);
  }

  checkContributor() {
    this.changePersonService.getSocialInsuranceNo().subscribe(res => {
      this.sin = res;
      this.param = this.sin ? this.sin : this.personIdentifier;
    });
    this.roleParam = this.personIdentifier ? this.personIdentifier : this.sin;
    this.getProfileDetails(this.param);
    this.getProfileAndQuickLinkActions(this.roleParam);
  }

  getProfileAndQuickLinkActions(roleParam) {
    let person: any = this.changePersonService.person;
    let identity: any = person.identity;
    let iqamaDetails = identity.filter(item => item.idType == 'IQAMA');
    let ninDetails = identity.filter(item => item.idType == 'NIN');
    if (iqamaDetails.length > 0 && iqamaDetails[0]?.iqamaNo) {
      this.showRaiseQuicklink = true;
    } else if (ninDetails.length > 0 && ninDetails[0]?.newNin) {
      this.showRaiseQuicklink = true;
    } else {
      this.showRaiseQuicklink = false;
    }
    this.coreAdjustmentService.identifier = checkIqamaOrBorderOrPassport(this.individualDetails.identity)?.id;
    this.coreAdjustmentService.socialNumber = this.individualDetails?.socialInsuranceNumber[0];
    this.changePersonService.getPersonRoles(roleParam).subscribe(res => {
      this.userRoles = res.personRoles;
      this.profileAction = ProfileActionConstants.ROUTE_CONSTANTS(
        this.personId,
        this.userRoles,
        this.fromEstablishment,
        this.estRegNo,
        this.environment.unifyEngTimeLine?.enabled,
        Boolean(this.token.gosiscp.match(RoleIdEnum.INDIVIDUAL_CERTIFICATES + ''))
      );
      this.quickLinkAction = QuickLinkActionContants.QUICKLINK_CONSTANTS(this.personId, this.userRoles);
    });
  }

  navigateToRoute(url: string, index: number) {
    this.alertService.clearAlerts();
    this.changePersonService.setMenuIndex(index);
    this.txnService.setTab(0);
    this.transactionService._transactionRequest = undefined;
    if (url.includes('occupational')) this.ohService.setRoute(Route.INDIVIDUAL_PROFILE_OH);
    this.router.navigate([url], { state: { registrationNo: this.personId } });
  }
  ngOnDestroy() {
    // this.contributorService.NINDetails = null;
    // this.contributorService.IqamaDetails = null;
    this.storageService.setLocalValue('individualProfile', false);
    this.menuService.showSMSMessage.next(true);
  }

  mouseOver(evnt, index) {
    if (evnt) this.isMouseHoverIndex = index;
  }

  mouseOut(evnt) {
    if (evnt) this.isMouseHoverIndex = -1;
  }

  // NIN verification start
  showSendOtpBtn() {
    if (this.token.gosiscp.match('296')) {
      this.isShowSendOtpBtn = true;
    } else this.isShowSendOtpBtn = false;
  }

  showPopupVerivication(ninumber, template: TemplateRef<HTMLElement>) {
    this.isVerified = false;
    this.isSend = false;
    this.curNinumber = ninumber;

    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  closeVerification() {
    this.isVerified = false;
    this.isSend = false;
    this.isResend = false;
    this.curNinumber = null;
    this.modalRef.hide();
  }

  sendVerification(ninumber) {
    this.verifyNiNumberService.generateOTP('SMS', 'Generating OTP', ninumber).subscribe(
      otpResponse => {
        this.uuid = otpResponse.uuid;
        this.isSend = true;
      },
      err => {
        this.error = err?.error?.message;
        this.isSend = false;
      }
    );
  }

  verifyOTP(otp, uuid) {
    this.verifyNiNumberService.verifyOTP(otp, uuid).subscribe(
      verifyOtpResponse => {
        this.isVerified = verifyOtpResponse.verified;
      },
      err => {
        this.error = err?.error?.message;
        this.isVerified = false;
      }
    );
  }

  resendOTP(uuid) {
    this.verifyNiNumberService.resendOTP(uuid).subscribe(
      resendOtpResponse => {
        this.isResend = resendOtpResponse.resend;
      },
      err => {
        this.error = err?.error?.message;
        this.isResend = false;
      }
    );
  }
  // NIN verification end

  // send SMS start
  showSmsButton() {
    if (this.token.gosiscp.match('184')) {
      this.isShowSmsBtn = true;
    } else this.isShowSmsBtn = false;
  }

  showPopupSendMessage(mobileNumber, template: TemplateRef<HTMLElement>) {
    this.isSendMessage = false;
    this.curMobileNumber = mobileNumber;
    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  getSourceSystem(event) {
    this.sendSMSNotificationService
      .getListOfResponses(this.lang, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.responseTypes = res.elements));
  }
  sendMessage(message) {
    this.sendSMSNotificationService.SendSMS(message.mobileNumber, message.message).subscribe(
      sendSMSResponse => {
        this.invalidMSISDN = sendSMSResponse.InvalidMSISDN;
        this.messageID = sendSMSResponse.MessageID;
        this.status = sendSMSResponse.Status;
        this.statusDescription = sendSMSResponse.StatusDescription;
        this.isSendMessage = true;
      },
      err => {
        this.error = err?.error?.message;
        this.isSendMessage = false;
      }
    );
  }
  closeSMS() {
    this.isSendMessage = false;
    this.curMobileNumber = null;
    this.modalRef.hide();
  }
  // send SMS end

  //send Attorney start
  showSendAttorneyBtn() {
    if (this.token.gosiscp.match('296')) {
      this.isShowSendAttorneyBtn = true;
    } else this.isShowSendAttorneyBtn = false;
  }

  showPopupSendAttorney(ninumber, template: TemplateRef<HTMLElement>) {
    this.isAttorneyVerified = false;
    this.isAttorneySend = false;
    this.curNinumber = ninumber;
    this.attorneyError = false;

    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  closeSendAttorney() {
    this.isAttorneyVerified = false;
    this.isAttorneySend = false;
    this.curNinumber = null;
    this.modalRef.hide();
    this.attorneyError = false;
  }

  sendAttorney(value) {
    this.attorneyService.getAttorneyFromMOJ(value.attorneyNumber, value.agentId).subscribe(
      attorneyServiceResponse => {
        if (attorneyServiceResponse.responseCode) {
          this.attorneyStatus = attorneyServiceResponse.attorneyStatus;

          this.agentFullName = attorneyServiceResponse.agent.fullName;
          this.agentId = attorneyServiceResponse.agent.id;
          if (this.lang === 'en') {
            this.agentIsValid = attorneyServiceResponse.agent.isValid ? 'Active' : 'Inactive';
          } else {
            this.agentIsValid = attorneyServiceResponse.agent.isValid ? 'ساريه' : 'غير ساريه';
          }

          if (attorneyServiceResponse?.authorizerList?.length > 0) {
            this.authList = attorneyServiceResponse?.authorizerList;
            attorneyServiceResponse?.authorizerList?.forEach((authList: AttorneyInquiryAuthorizerList) => {
              this.authorizerListFullName = authList.fullName;
              this.authorizerListId = authList.id;
              if (this.lang === 'en') {
                this.authorizerListIsValid = authList.isValid ? 'Active' : 'Inactive';
              } else {
                this.authorizerListIsValid = authList.isValid ? 'ساريه' : 'غير ساريه';
              }
            });
          }
          this.attorneyText = attorneyServiceResponse.attorneyText;
          this.isAttorneySend = true;
        } else {
          this.error = attorneyServiceResponse.responseMessage;
          this.isAttorneySend = false;
          this.attorneyError = true;
        }
      },
      err => {
        this.error = err?.error?.message;
        this.isAttorneySend = false;
      }
    );
  }
  //send Attorney end

  navigateToRaiseComplaint() {
    const personId = this.changePersonService.personId;
    this.router.navigate([`/home/complaints/register/general/${personId}`]);
  }
}
