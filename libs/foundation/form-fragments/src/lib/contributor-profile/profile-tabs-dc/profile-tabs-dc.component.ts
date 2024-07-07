import { Component, Input, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {
  RoleIdEnum,
  ContributorTokenDto,
  ContributorToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'frm-profile-tabs-dc',
  templateUrl: './profile-tabs-dc.component.html',
  styleUrls: ['./profile-tabs-dc.component.scss']
})
export class ProfileTabsDcComponent implements OnInit {
  showDropdown = false;
  activeInDropdown = false;
  activeBenefit = false;
  contributorVic$: Observable<boolean>;
  isVic = false;
  isAppPrivate: boolean;
  estAdminPublicRoles = [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.GCC_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.REG_ADMIN,RoleIdEnum.OH_ADMIN,RoleIdEnum.CNT_ADMIN];


  @Input() isUserLoggedIn;
  @Input() isCsr;
  @Input() OHRoles: RoleIdEnum[];
  @Input() registrationNo: number;
  @Input() sin: number;

  showBenefitActive(bool: boolean) {
    this.activeBenefit = true;
    this.activeInDropdown = bool;
    this.showDropdown = false;
  }
  constructor(
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.contributorVic$ = this.contributorToken.isVic;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.isAppPrivate) {
      this.contributorToken.hasOtherEngagements.subscribe(res => {
        this.cdr.detectChanges();
        if (!res) {
          this.isVic = true;
        } else {
          this.isVic = false;
        }
      });
    }
  }

  showDropdownTabs() {
    this.showDropdown = !this.showDropdown;
  }
  activateMore(bool: boolean) {
    this.activeBenefit = false;
    this.activeInDropdown = bool;
    this.showDropdown = false;
  }
}
