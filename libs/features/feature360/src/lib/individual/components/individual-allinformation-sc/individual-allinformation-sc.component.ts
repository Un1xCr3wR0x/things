import { Component, Inject, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BilingualText, LanguageToken, AuthTokenService, JWTPayload, MenuService } from '@gosi-ui/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ContributorInfo } from '../../../models/individual/contributor-info';
import { CustomerProfile } from '../../../models/individual/customer-profile';
import { Merged } from '../../../models/individual/merged';
import { ContributorInfoService } from '../../../services/individual/contributor-info.service';
import { CustomerProfileService } from '../../../services/individual/customer-profile.service';
import { BeneficiaryInfo } from '../../../models/individual/beneficiary-info';
import { BeneficiaryInfoService } from '../../../services/individual/beneficiary-info.service';
import { MergedService } from '../../../services/individual/merged.service';
import { ChooseDetailsTypeComponent, EnterComplaintDcComponent, VerifyNinumberDcComponent } from '../../../shared';
import { IndividualBeneficiaryDcComponent } from '../individual-beneficiary-dc/individual-beneficiary-dc.component';
import { IndividualContributorDcComponent } from '../individual-contributor-dc/individual-contributor-dc.component';
import { IndividualEstablishmentsDcComponent } from '../individual-establishments-dc/individual-establishments-dc.component';
import { EstablishmentInfoByNinumberService } from '../../../services/establishments/establishment-info-by-ninumber.service';
import { EstablishmentInfoByNinumber } from '../../../models/establishments/establishment-info-by-ninumber';
import { NotificationService } from '../../../services/shared/notification.service';

@Component({
  selector: 'fea-individual-allinformation-sc',
  templateUrl: './individual-allinformation-sc.component.html',
  styleUrls: ['./individual-allinformation-sc.component.scss']
})
export class IndividualAllinformationScComponent implements OnInit, AfterViewInit, OnDestroy {
  niNumber;
  lang = 'en';
  uuid: string;
  error: BilingualText;
  token: JWTPayload;
  details = 'individual';
  modalRef: BsModalRef;
  isVerified = false;
  isSend = false;
  isResend = false;
  isSendComplaint = false;
  isHiddenComplaint = false;
  curNinumber = null;
  invalidMSISDN = null;
  messageID = null;
  status = null;
  statusDescription = null;
  beneficiaryInfo: BeneficiaryInfo;
  establishmentInfoByNinumber: EstablishmentInfoByNinumber[] = [];

  isShowSmsBtn = false;

  contributorInfo: ContributorInfo = null;
  mergedList: Merged[] = [];
  customerProfile: CustomerProfile = null;
  currentDetailsTap = 'Contributor';

  detailsTypeList = [
    {
      name: {
        english: 'Contributor',
        arabic: 'مشترك'
      }
    },
    {
      name: {
        english: 'Beneficiary',
        arabic: 'مستفيد'
      }
    },
    {
      name: {
        english: 'Establishments',
        arabic: 'منشأت'
      }
    }
  ];

  @ViewChild('chooseDetailsTypeComp', { static: false })
  chooseDetailsTypeComp: ChooseDetailsTypeComponent;

  @ViewChild('individualContributorDcComp', { static: false })
  individualContributorDcComp: IndividualContributorDcComponent;

  @ViewChild('individualBeneficiaryDcComp', { static: false })
  individualBeneficiaryDcComp: IndividualBeneficiaryDcComponent;

  @ViewChild('individualEstablishmentsDcComp', { static: false })
  individualEstablishmentsDcComp: IndividualEstablishmentsDcComponent;

  @ViewChild('verifyNinumberDcComp', { static: false })
  verifyNinumberDcComp: VerifyNinumberDcComponent;

  @ViewChild('enterComplaintDcComp', { static: false })
  enterComplaintDcComp: EnterComplaintDcComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private modalService: BsModalService,
    readonly menuService: MenuService,
    readonly authService: AuthTokenService,
    readonly contributorInfoService: ContributorInfoService,
    readonly mergedService: MergedService,
    readonly customerProfileService: CustomerProfileService,
    readonly beneficiaryInfoService: BeneficiaryInfoService,
    readonly establishmentInfoByNinumberService: EstablishmentInfoByNinumberService,
    readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.niNumber = this.activatedRoute.snapshot.params.niNum;
    this.language.subscribe(language => (this.lang = language));
    this.getUserInfo();
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    this.menuService.showSMSMessage.next(false);
    this.showSmsButton();
  }

  showSmsButton() {
    if (this.token.gosiscp.match('184') || this.token.gosiscp.match('185') || this.token.gosiscp.match('187')) {
      this.isShowSmsBtn = true;
    } else this.isShowSmsBtn = false;
  }

  ngAfterViewInit() {
    this.chooseDetailsTypeComp.detailsTypeForm.valueChanges.subscribe(() => {
      this.currentDetailsTap = this.chooseDetailsTypeComp.detailsTypeForm
        .get('organizationCategory')
        .get('english').value;
    });
  }

  getUserInfo() {
    this.getCustomerProfile();
    this.getContributorInfoDetails();
    this.getMergedDetails();
    this.getEstablishmentInfoByNinumber();
    this.getBeneficiaryInfoDetails();
  }

  getCustomerProfile() {
    this.customerProfileService.getCustomerProfileDetails(this.niNumber).subscribe(customerProfile => {
      this.customerProfile = customerProfile;
    });
  }
  getContributorInfoDetails() {
    this.contributorInfoService.getContributorInfoDetails(this.niNumber).subscribe(contributorInfo => {
      this.contributorInfo = contributorInfo;
    });
  }
  getMergedDetails() {
    this.mergedService.getMergedDetails(this.niNumber).subscribe(mergedList => {
      this.mergedList = mergedList;
    });
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

  showPopupSendComplaint(template: TemplateRef<HTMLElement>) {
    this.isSendComplaint = false;

    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }
  close() {
    this.isVerified = false;
    this.isSend = false;
    this.isResend = false;
    this.curNinumber = null;
    this.isSendComplaint = false;
    this.modalRef.hide();
  }

  sendVerification(ninumber) {
    this.notificationService.generateOTP('SMS', 'Generating OTP', ninumber).subscribe(
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
    this.notificationService.verifyOTP(otp, uuid).subscribe(
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
    this.notificationService.resendOTP(uuid).subscribe(
      resendOtpResponse => {
        this.isResend = resendOtpResponse.resend;
      },
      err => {
        this.error = err?.error?.message;
        this.isResend = false;
      }
    );
  }

  sendComplaint(complaint) {
    this.isSendComplaint = true;
  }

  getBeneficiaryInfoDetails() {
    this.beneficiaryInfoService.getBeneficiaryInfoDetails(this.niNumber).subscribe(beneficiaryInfo => {
      this.beneficiaryInfo = beneficiaryInfo;
    });
  }

  getEstablishmentInfoByNinumber() {
    this.establishmentInfoByNinumberService
      .getEstablishmentInfoByNinumber(this.niNumber, this.niNumber, this.niNumber)
      .subscribe(value => {
        value.forEach(establishmentInfoByNinumber => {
          this.establishmentInfoByNinumber.push(establishmentInfoByNinumber);
        });
      });
  }

  ngOnDestroy() {
    this.menuService.showSMSMessage.next(true);
  }
}
