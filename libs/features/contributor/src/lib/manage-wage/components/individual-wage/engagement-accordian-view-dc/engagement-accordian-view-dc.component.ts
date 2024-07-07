/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthTokenService,
  IdentityTypeEnum,
  LanguageToken,
  RoleIdEnum,
  convertToYYYYMMDD,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import { AggregationTypeEnum } from '@gosi-ui/features/contributor/lib/shared/enums/aggregation-type';
import { TagType } from '@gosi-ui/features/contributor/lib/shared/enums/tag-type';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { ContributorConstants, ManageWageConstants } from '../../../../shared/constants';
import { EngagementType } from '../../../../shared/enums';
import { Contributor, DropDownItems, EngagementDetails, Establishment } from '../../../../shared/models';

@Component({
  selector: 'cnt-engagement-accordian-view-dc',
  templateUrl: './engagement-accordian-view-dc.component.html',
  styleUrls: ['./engagement-accordian-view-dc.component.scss']
})
export class EngagementAccordianViewDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  lang = 'en';
  isFutureEngagement: boolean;
  isFutureEndingEngagement: boolean;
  hasNinOrIqamaNumber = false;
  personId: number;
  isPartTimer = false;
  isVic = false;
  userRoles: any;
  identifier: number;
  isVicRole: boolean = false;
  nin: number;
  monthSelectedDate: string;

  /** Constants */
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;
  addContractAccessRoles = [RoleIdEnum.CSR, RoleIdEnum.GCC_CSR];
  EngagementType = EngagementType;

  /** Input  variables. */
  @Input() index: number;
  @Input() isOpenInitially: boolean;
  @Input() engagement: EngagementDetails;
  @Input() contributorData: Contributor;
  @Input() actionList: DropDownItems[];
  @Input() isNin: boolean;
  @Input() establishment: Establishment;
  @Input() isUnifiedProfile: boolean;
  @Input() individualApp: boolean;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @Input() engagementLength: any;
  @Input() enableCardTag = true;
  @Input() privateSector = true;
  @Input() engagementType: string;
  @Input() TagType: TagType = TagType.RibbonTag;
  @Input() isPREligible: boolean;

  count = 0;
  @Input() currentUserRoles: string[];
  @Input() isBackdatedFlag: boolean;
  /** Output variables. */
  @Output() selected: EventEmitter<string> = new EventEmitter();

  isShow = true;
  imageClick: boolean;
  AggregationType = AggregationTypeEnum;
  width;
  mobileView: boolean;
  /** Creates an instancce of EngagementAccordianViewDcComponent. */
  constructor(
    readonly changePersonService: ChangePersonService,
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>
  ) {}

  /** Method to initialize the commponent. */
  ngOnInit(): void {
    //this.getUserRoles();
    //console.log(this.actionList,'engagement',this.engagement);

    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    this.nin = this.authTokenService.getIndividual();
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.identifier = Number(params.get('personId'));
        //this.sin = this.changePersonService.getSIN();
      }
    });

    this.changePersonService.getPersonRoles(this.changePersonService.getSIN())?.subscribe(res => {
      this.userRoles = res.roleList;
      let reg: any = this.userRoles?.filter(item => item == 'VIC');
      if (reg?.length != 0) {
        this.isVicRole = true;
      }
    });
    this.language.subscribe(lan => (this.lang = lan));
    if (this.engagement.engagementType === EngagementType.VIC) this.isVic = true;
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.personId = Number(params.get('personId'));
      }
    });
  }
  /** Method  to check whether person has NIN or IQAMA. */
  isNinOrIqama(identityValue) {
    return identityValue
      ? identityValue.some(
          identity => identity.idType === IdentityTypeEnum.IQAMA || identity.idType === IdentityTypeEnum.NIN
        )
      : false;
  }

  // /** Method to get user roles. */
  // getUserRoles() {debugger
  //   const gosiscp = this.authTokenService.getEntitlements();
  //   if (gosiscp) this.userRoles = gosiscp?.[0]?.role?.map(r => r.toString());
  // }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagement && changes.engagement.currentValue) {
      this.checkEngagementType();
      if (this.isVic) {
        this.identifyFutureEngagement();
        this.identifyEngagementEndingInFuture();
      }
      if (
        (this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()) &&
          !this.currentUserRoles?.includes(RoleIdEnum.GCC_CSR.toString()) &&
          this.engagement?.gccEstablishment) ||
        (this.currentUserRoles?.includes(RoleIdEnum.GCC_CSR.toString()) &&
          !this.currentUserRoles?.includes(RoleIdEnum.CSR.toString()) &&
          !this.engagement?.gccEstablishment)
      ) {
        this.isShow = false;
      }
    }
    if (
      changes.contributorData &&
      changes.contributorData.currentValue &&
      changes.contributorData.currentValue.person.identity
    ) {
      this.hasNinOrIqamaNumber = this.isNinOrIqama(this.contributorData.person.identity);
    }
    if (changes.actionList && changes.actionList.currentValue) {
      if (this.engagement.contractDetailsFlag && this.engagement.status === 'CANCELLED') {
        this.actionList = [];
        this.actionList.push(ManageWageConstants.ViewContracts);
      }
      if (this.engagement.reactivationAllowed && this.engagement.status === 'CANCELLED') {
        this.actionList = [];
        this.actionList.push(ManageWageConstants.REACTIVATE_ENGAGEMENT_DROPDOWN);
        this.engagement.pendingTransaction.forEach(item => {
          if (item.type.english == 'Reactivate Engagement') {
            this.actionList[0].disabled = true;
            this.actionList[0].toolTipParam = item.referenceNo;
            this.actionList[0].toolTipValue = 'CONTRIBUTOR.UPDATE-REACTIVATE-ENGAGEMENT-INFO';
          }
        });
      }
      if (this.isVic && this.engagement.status === 'CANCELLED') {
        this.actionList = [];
        this.actionList.push(ManageWageConstants.REACTIVATE_ENGAGEMENT_DROPDOWN);
        this.engagement.pendingTransaction.forEach(item => {
          if (item.type.english == 'Reactivate VIC Engagement') {
            this.actionList[0].disabled = true;
            this.actionList[0].toolTipParam = item.referenceNo;
            this.actionList[0].toolTipValue = 'CONTRIBUTOR.UPDATE-REACTIVATE-ENGAGEMENT-INFO';
          }
        });
      }
    }
  }

  /** Method to identify future engagement. */
  identifyFutureEngagement() {
    if (moment(this.engagement?.joiningDate?.gregorian).isAfter(new Date()) && this.engagement?.status !== 'CANCELLED')
      this.isFutureEngagement = true;
  }

  identifyEngagementEndingInFuture() {
    if (
      moment(this.engagement?.leavingDate?.gregorian).isAfter(new Date()) &&
      moment(this.engagement?.joiningDate?.gregorian).isBefore(new Date())
    )
      this.isFutureEndingEngagement = true;
  }

  /** Method to check engagement type. */
  checkEngagementType() {
    if (this.engagement.engagementType === EngagementType.PART_TIMER) this.isPartTimer = true;
    else if (this.engagement.engagementType === EngagementType.VIC) this.isVic = true;
  }

  /** Method to handle actions. */
  handleActions(selectedValue: string) {
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    this.selected.emit(selectedValue);
    if (selectedValue == 'CONTRIBUTOR.VIEW-BILL-DASHBOARD-SCREEN') {
      this.router.navigate(['/home/billing/vic/dashboard'], {
        queryParams: {
          idNo: this.personId ? this.personId : this.nin,
          monthSelected: this.monthSelectedDate,
          isDashboard: 'true'
        }
      });
    }
  }
  imageClicked() {
    this.imageClick = true;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    // mobile view size changed
    if (this.width < 768) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  // navigateTo() {
  //   this.router.navigate(['/home/billing/vic/dashboard'], {
  //     queryParams: {
  //       idNo: this.identifier,
  //       monthSelected: this.monthSelectedDate,
  //       isDashboard: "false"
  //     }
  //   });
  // }
}
