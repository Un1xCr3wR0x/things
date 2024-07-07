import { Component, Input, OnInit } from '@angular/core';
import { AuthTokenService, RoleIdEnum } from '@gosi-ui/core';
import { EstablishmentService } from '../../../shared';

@Component({
  selector: 'est-establishment-profile-links',
  templateUrl: './establishment-profile-links.component.html',
  styleUrls: ['./establishment-profile-links.component.css']
})
export class EstablishmentProfileLinksComponent implements OnInit {
  registerContributorRoute: string = '/home/contributor/search';
  billingReceiptRoute: string = '/home/billing/receipt/establishment';
  wageUpdateRoute: string = '/home/contributor/wage/update';
  penaltyWaiverRoute: string = '/home/billing/penalty-waiver/violation-late-fees/create';

  @Input() registrationNo: number;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() isPpaEstablishment: boolean;
  @Input() isAppPublic: boolean;
  nin: string;
  quickLinks: QuickLink[] = [];
  constructor(readonly authService: AuthTokenService, readonly establishmentService: EstablishmentService) {}

  ngOnInit(): void {
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    this.nin = token.uid;
    console.log('Admin access roles list for regNo. = ' + this.registrationNo);

    if (
      this.establishmentService.isUserEligible([RoleIdEnum.BRANCH_ADMIN], this.registrationNo) ||
      this.establishmentService.isUserEligible([RoleIdEnum.SUPER_ADMIN], this.registrationNo)
    ) {
      console.log(this.registrationNo + ' User Is Eligible for ' + RoleIdEnum.BRANCH_ADMIN);
      let superVisorsAdminsLink = new QuickLink();
      superVisorsAdminsLink.description = 'ESTABLISHMENT.ESTABLISHMENT-SUPERVISORS-MANAGEMENT'; //"ادارة مشرفى المنشأة";
      superVisorsAdminsLink.url = `/home/establishment/admin/branch/${this.registrationNo}/user/${this.nin}`;
      this.quickLinks.push(superVisorsAdminsLink);
    }

    if (
      (this.establishmentService.isUserEligible([RoleIdEnum.BRANCH_ADMIN], this.registrationNo) ||
        this.establishmentService.isUserEligible([RoleIdEnum.SUPER_ADMIN], this.registrationNo) ||
        this.establishmentService.isUserEligible([RoleIdEnum.REG_ADMIN], this.registrationNo)) 
    ) {
      console.log(
        this.registrationNo + ' User Is Eligible for ' + RoleIdEnum.BRANCH_ADMIN + ' AND ' + RoleIdEnum.REG_ADMIN
      );
      let registerContributorLink = new QuickLink();
      registerContributorLink.description = 'ESTABLISHMENT.REGISTER-CONTRIBUTOR-LINK'; //"تسجيل مشترك";
      registerContributorLink.url = '/home/contributor/search';
      this.quickLinks.push(registerContributorLink);
    }

    if (this.establishmentService.isUserEligible([RoleIdEnum.REG_ADMIN], this.registrationNo)) {
      console.log(this.registrationNo + ' User Is Eligible for ' + RoleIdEnum.REG_ADMIN);
      let wagesLink = new QuickLink();
      wagesLink.description = 'ESTABLISHMENT.WAGE-UPDATE-LINK'; //"ادارة الأجور";
      wagesLink.url = '/home/contributor/wage/update';
      this.quickLinks.push(wagesLink);

      let contributorsLink = new QuickLink();
      contributorsLink.description = 'ESTABLISHMENT.CONTRIBUTORS-LIST'; //"قائمة المشتركين";
      contributorsLink.url = `/home/establishment/profile/${this.registrationNo}/user/${this.nin}/contributor-list`;
      this.quickLinks.push(contributorsLink);
    }

    if (this.establishmentService.isUserEligible([RoleIdEnum.OH_ADMIN], this.registrationNo)) {
      console.log(this.registrationNo + ' User Is Eligible for ' + RoleIdEnum.OH_ADMIN);
      let ohIncidentLink = new QuickLink();
      ohIncidentLink.description = 'ESTABLISHMENT.REPORT-OCCUPATIONAL-HAZARDS'; //"إبلاغ عن أخطار مهنية";
      ohIncidentLink.url = '/home/oh/report';
      this.quickLinks.push(ohIncidentLink);
    }

    if (
      (this.establishmentService.isUserEligible([RoleIdEnum.BRANCH_ADMIN], this.registrationNo) ||
        this.establishmentService.isUserEligible([RoleIdEnum.SUPER_ADMIN], this.registrationNo) ||
        this.establishmentService.isUserEligible([RoleIdEnum.CNT_ADMIN], this.registrationNo)) &&
      !this.isPpaEstablishment
    ) {
      console.log(
        this.registrationNo + ' User Is Eligible for ' + RoleIdEnum.BRANCH_ADMIN + ' AND ' + RoleIdEnum.CNT_ADMIN
      );
      let billingLink = new QuickLink();
      billingLink.description = 'ESTABLISHMENT.INVOICE-DASHBOARD'; //;"لوحة معلومات الفاتورة";
      billingLink.url = `/home/billing/establishment/dashboard/view`;
      this.quickLinks.push(billingLink);
    }
  }
}
class QuickLink {
  url: string;
  description: string;
}
