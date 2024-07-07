import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BorderNumber, Establishment, Iqama, LovList, NIN, NationalId, Passport } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ContributorSummary, RaiseViolationContributor } from '../../../shared/models';
import { EngagementInfo } from '../../../shared/models/engagement-info';

@Component({
  selector: 'vol-report-contributor-details-dc',
  templateUrl: './report-contributor-details-dc.component.html',
  styleUrls: ['./report-contributor-details-dc.component.scss']
})
export class ReportContributorDetailsDcComponent implements OnInit, OnChanges {
  contributorsList = [];
  engagementList = [];
  accordionPanel = -1;
  @Input() hideContributor: boolean;
  @Input() violationYesOrNoList: Observable<LovList>;
  @Input() wrongBenefitsType: Observable<LovList>;
  @Input() isVerified: boolean;
  @Input() contributorSummaryDetails: ContributorSummary = new ContributorSummary();
  @Input() addedContributorDetail: ContributorSummary = new ContributorSummary();
  @Input() engagementsInfo: EngagementInfo;
  @Input() engInfo: EngagementInfo;
  @Input() raiseViolationData: RaiseViolationContributor = new RaiseViolationContributor();
  @Input() violationType: string = undefined;
  @Input() violationData: RaiseViolationContributor = new RaiseViolationContributor();
  @Input() isContributorEdit: boolean;
  @Input() removeNewlyAdedEng: boolean;
  @Input() establishmentDetails: Establishment;
  @Input() makeAddContributorRed: boolean;
  @Input() hasProactiveEng: boolean;

  @Output() verify: EventEmitter<number> = new EventEmitter();
  @Output() resetPerson: EventEmitter<null> = new EventEmitter();
  @Output() saveEng: EventEmitter<null> = new EventEmitter();
  @Output() addContributorBtn: EventEmitter<null> = new EventEmitter();
  @Output() saveContributor: EventEmitter<null> = new EventEmitter();
  @Output() cancelCurrentContributor: EventEmitter<null> = new EventEmitter();
  @Output() removeAddedContributor: EventEmitter<number> = new EventEmitter();
  @Output() updateAddedContributor: EventEmitter<number> = new EventEmitter();
  @Output() cancelCurrentEdit: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.engagementsInfo && changes.engagementsInfo.currentValue) {
      this.engagementsInfo = changes.engagementsInfo.currentValue;
    }
    if (changes.violationType && changes.violationType.currentValue) {
      this.violationType = changes.violationType.currentValue;
    }
    if (changes.hideContributor && changes.hideContributor.currentValue) {
      this.hideContributor = changes.hideContributor.currentValue;
    }
    // if (changes.violationData && changes.violationData.currentValue) {
    //   this.violationData = changes.violationData.currentValue;
    // }
    if (changes.isContributorEdit && changes.isContributorEdit.currentValue)
      this.isContributorEdit = changes.isContributorEdit.currentValue;

    if (changes.removeNewlyAdedEng && changes.removeNewlyAdedEng.currentValue)
      this.removeNewlyAdedEng = changes.removeNewlyAdedEng.currentValue;
    if (changes.hasProactiveEng) {
      this.hasProactiveEng = changes.hasProactiveEng.currentValue;
    }
  }

  saveEngagement() {
    this.saveEng.emit();
  }
  editAddedContributor(index: number) {
    this.violationData.contributorDetails[index].enableEdit = true;
    this.updateAddedContributor.emit(index);
    this.accordionPanel = index;
  }
  cancelCurrentContributorEdit(index) {
    this.violationData.contributorDetails[index].enableEdit = false;
    this.accordionPanel = -1;
    this.cancelCurrentEdit.emit();
  }
  deleteAddedContributor(index: number) {
    this.removeAddedContributor.emit(index);
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinNeeded(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    const types = ['NIN', 'IQAMA', 'GCCID'];
    let issin = false;
    if (identity.length > 0) {
      for (const item of identity) {
        issin = types.includes(item.idType);
        if (issin === true) break;
      }
      if (issin) return 1;
      else return 0;
    } else return 0;
  }
  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
}
