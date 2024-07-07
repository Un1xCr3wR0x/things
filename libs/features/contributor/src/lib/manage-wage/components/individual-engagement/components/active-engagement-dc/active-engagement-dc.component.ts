/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  Inject,
  ViewChild
} from '@angular/core';
import {
  CoveragePeriod,
  DropDownItems,
  EngagementDetails,
  EngagementBasicDetails
} from '@gosi-ui/features/contributor/lib/shared/models';
import { isNIN, LanguageToken, AuthTokenService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageWageService } from '@gosi-ui/features/contributor/lib/shared/services';
import { ContributionCategory, ContributorActionEnum } from '@gosi-ui/features/contributor/lib/shared/enums';

@Component({
  selector: 'cnt-active-engagement-dc',
  templateUrl: './active-engagement-dc.component.html',
  styleUrls: ['./active-engagement-dc.component.scss']
})
export class ActiveEngagementDcComponent implements OnInit, OnChanges {
  isShowCoverage: boolean = false;
  isShowAnnuity: boolean = false;
  isShowOH: boolean = false;
  isShowUi: boolean = false;
  constructor(
    readonly authTokenService: AuthTokenService,
    private modalService: BsModalService,
    @Inject(LanguageToken) readonly languag: BehaviorSubject<string>,
    readonly manageWageService: ManageWageService
  ) {}
  // Local Variables
  totalContributoryWage = 0;
  totalWage = 0;
  annuityAmount = 0;
  uiAmount = 0;
  displayIcon = true;
  ohAmount = 0;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  total = 0;
  contractId: number;
  contractDetailsFlag: boolean;
  modifyEngagement: EngagementBasicDetails = new EngagementBasicDetails();
  modifyEngagementDetails: EngagementBasicDetails = new EngagementBasicDetails();
  language: string;
  errMessage: string;
  errDetails: any = [];
  nin: number;
  modalRef: BsModalRef;

  labelStyle = {
    value: { color: '#666666', 'font-weight': '450' }
  };
  // Input Variables
  @Input() lang: string;
  @Input() isTotalShare = false;
  @Input() coverageDetails: CoveragePeriod;
  @Input() singleActive: boolean;
  @Input() isNin: boolean;
  @Input() actionList: DropDownItems[];
  @Input() activeEngagementsList: EngagementDetails[];
  @Input() showPendingContract: boolean;
  @Input() pendingContractsCount: number;

  /** Output variables. */

  @Output() selected: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() navigateToContract: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() show: EventEmitter<TemplateRef<HTMLElement>> = new EventEmitter();
  @Output() close = new EventEmitter();

  @ViewChild('einspectionPopUpTemplate', { static: true }) einspectionPopUpTemplate: any;
  /**Method to initialise tasks */
  ngOnInit(): void {
    this.nin = this.authTokenService.getIndividual();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.activeEngagementsList && changes.activeEngagementsList.currentValue) {
      this.activeEngagementsList?.forEach(eng => {
        eng?.engagementPeriod?.forEach(period => {
          if (!period?.effectiveEndDate?.gregorian) {
            this.totalContributoryWage += Number(period?.wage?.contributoryWage);
            this.totalWage += Number(period?.wage?.totalWage);
          }
          period.coverageType.forEach(item => {
            if (item.english == 'Annuity') {
              this.isShowAnnuity = true;
            }
            if (item.english == 'Occupational Hazard') {
              this.isShowOH = true;
            }
            if (item.english == 'Unemployment Insurance') {
              this.isShowUi = true;
            }
          });
        });
      });
    }
    if (
      changes &&
      changes.coverageDetails &&
      changes.coverageDetails.currentValue &&
      !changes.coverageDetails.isFirstChange()
    ) {
      this.coverageDetails?.coverages?.forEach(cov => {
        if (cov?.coverageType?.english === this.annuity) {
          this.annuityAmount = cov.contributorShare;
        }
        if (cov?.coverageType?.english === this.ui) {
          this.uiAmount = cov.contributorShare;
        }
        if (cov?.coverageType?.english === this.oh) {
          // if(cov.contributorPercentage==0 && !this.singleActive )
          // {
          //   cov.contributorPercentage=2;
          // }
          this.ohAmount = cov.contributorShare;
        }
        this.total = this.uiAmount + this.annuityAmount + this.ohAmount;
      });
    }
  }
  fetchContracts(engagement: EngagementDetails) {
    this.navigateToContract.emit(engagement);
  }
  handleActions(engagement: EngagementDetails, selectedValue: string) {
    if (selectedValue === ContributorActionEnum.VIEW_CONTRACT && this.singleActive) {
      this.fetchContracts(engagement);
    } else if (
      (selectedValue === ContributorActionEnum.CANCEL_ENGAGEMENT ||
        selectedValue === ContributorActionEnum.MODIFY_JOINING_DATE ||
        selectedValue === ContributorActionEnum.MODIFY_LEAVING_DATE ||
        selectedValue === ContributorActionEnum.TERMINATE_ENGAGEMENT) &&
      this.singleActive
    ) {
      this.modifyEngagement.comments = null;
      this.modifyEngagement.leavingReason.english = engagement.leavingReason?.english;
      this.modifyEngagement.leavingReason.arabic = engagement.leavingReason?.arabic;
      this.modifyEngagement.leavingDate.hijiri = null;
      this.modifyEngagement.joiningDate.hijiri = null;
      if (selectedValue === ContributorActionEnum.MODIFY_JOINING_DATE) {
        this.modifyEngagement.violationSubType = 'Modify Joining Date';
        this.modifyEngagement.violationType = 'Modify Engagement';
      } else if (selectedValue === ContributorActionEnum.MODIFY_LEAVING_DATE) {
        this.modifyEngagement.violationType = 'Modify Engagement';
        this.modifyEngagement.violationSubType = 'Modify Leaving Date';
      } else if (selectedValue === ContributorActionEnum.TERMINATE_ENGAGEMENT) {
        this.modifyEngagement.violationType = 'Terminate Engagement';
        this.modifyEngagement.violationSubType = null;
      } else if (selectedValue === ContributorActionEnum.CANCEL_ENGAGEMENT) {
        this.modifyEngagement.violationType = 'Cancel Engagement';
        this.modifyEngagement.violationSubType = null;
      }
      this.manageWageService.openEngagementDate(this.nin, engagement.engagementId, this.modifyEngagement).subscribe(
        res => {
          engagement.selectedItem = selectedValue;
          this.selected.emit(engagement);
        },
        err => {
          if (err.status === 400) {
            this.languag.subscribe(language => {
              this.language = language;
            });
            if (err.error.details) {
              for (var i = 0; i < err.error.details?.length; i++) {
                if (this.language == 'en') {
                  this.errDetails[i] = err?.error?.details[i]?.message?.english;
                } else if (this.language == 'ar') {
                  this.errDetails[i] = err?.error?.details[i]?.message?.arabic;
                }
              }
            } else {
              if (this.language == 'en') {
                this.errMessage = err.error.message.english;
              } else if (this.language == 'ar') {
                this.errMessage = err.error.message.arabic;
              }
            }
            this.showModalPopUp(this.einspectionPopUpTemplate, 'lg');
          }
        }
      );
    }
  }
  selectedItem(engagement: EngagementDetails, value: string, template?: TemplateRef<HTMLElement>) {
    if (value === ContributorActionEnum.VIEW_CONTRACT) {
      this.fetchContracts(engagement);
    } else if (value === ContributorActionEnum.VIEW_WAGE_BREAKUP) {
      this.show.emit(template);
    } else if (
      value === ContributorActionEnum.CANCEL_ENGAGEMENT ||
      value === ContributorActionEnum.MODIFY_JOINING_DATE ||
      value === ContributorActionEnum.MODIFY_LEAVING_DATE ||
      value === ContributorActionEnum.TERMINATE_ENGAGEMENT
    ) {
      this.modifyEngagementDetails.comments = null;
      this.modifyEngagementDetails.leavingReason.english = engagement.leavingReason?.english;
      this.modifyEngagementDetails.leavingReason.arabic = engagement.leavingReason?.arabic;
      this.modifyEngagementDetails.leavingDate.hijiri = null;
      this.modifyEngagementDetails.joiningDate.hijiri = null;
      if (value === ContributorActionEnum.MODIFY_JOINING_DATE) {
        this.modifyEngagementDetails.violationSubType = 'Modify Joining Date';
        this.modifyEngagementDetails.violationType = 'Modify Engagement';
      } else if (value === ContributorActionEnum.MODIFY_LEAVING_DATE) {
        this.modifyEngagementDetails.violationType = 'Modify Engagement';
        this.modifyEngagementDetails.violationSubType = 'Modify Leaving Date';
      } else if (value === ContributorActionEnum.TERMINATE_ENGAGEMENT) {
        this.modifyEngagementDetails.violationType = 'Terminate Engagement';
        this.modifyEngagementDetails.violationSubType = null;
      } else if (value === ContributorActionEnum.CANCEL_ENGAGEMENT) {
        this.modifyEngagementDetails.violationType = 'Cancel Engagement';
        this.modifyEngagementDetails.violationSubType = null;
      }
      this.manageWageService
        .openEngagementDate(this.nin, engagement.engagementId, this.modifyEngagementDetails)
        .subscribe(
          res => {
            engagement.selectedItem = value;
            this.selected.emit(engagement);
          },
          err => {
            if (err.status === 400) {
              this.languag.subscribe(language => {
                this.language = language;
              });
              if (err.error.details) {
                for (var i = 0; i < err.error.details?.length; i++) {
                  if (this.language == 'en') {
                    this.errDetails[i] = err.error.details[i].message.english;
                  } else if (this.language == 'ar') {
                    this.errDetails[i] = err.error.details[i].message.arabic;
                  }
                }
              } else {
                if (this.language == 'en') {
                  this.errMessage = err.error.message.english;
                } else if (this.language == 'ar') {
                  this.errMessage = err.error.message.arabic;
                }
              }
              this.showModalPopUp(this.einspectionPopUpTemplate, 'lg');
            } else {
              engagement.selectedItem = value;
              this.selected.emit(engagement);
            }
          }
        );
    }
  }

  showModalPopUp(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  hideModal() {
    this.close.emit();
    this.modalRef.hide();
    this.errMessage = undefined;
    this.errDetails = [];
  }
}
