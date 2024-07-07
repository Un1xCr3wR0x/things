import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { checkIqamaOrBorderOrPassport, CommonIdentity, IdentityTypeEnum } from '@gosi-ui/core';
import { InjuryHistoryResponse, Injury, InjuryWrapper, ComplicationWrapper, DisabiliyDtoList } from '../../models';
import moment from 'moment';
import { AssessmentTypeEnum } from '../../enums/assessment-type';
import { getIdentityLabel } from '../../utils';
@Component({
  selector: 'mb-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit {
  @Input() personDetails;
  @Input() injuryDetails: Injury;
  @Input() complicationDetails: ComplicationWrapper;
  @Input() injuryDetailsById: InjuryWrapper;
  @Input() assessmentType: string;
  @Input() isContributor = true;
  @Input() assessmentDetails: DisabiliyDtoList;

  @Output() onContributorIdClicked = new EventEmitter<number>();
  @Output() onShowMBAssessmentClicked = new EventEmitter<null>();
  @Output() onOHClicked = new EventEmitter<null>();
  @Output() onInjuryIdClicked = new EventEmitter<null>();
  @Output() onShowEngagementClicked = new EventEmitter<null>();

  identity: CommonIdentity | null;
  identityLabel = '';
  assessmentTypeEnum = AssessmentTypeEnum;

  constructor() {}

  ngOnInit(): void {
    this.getIdentity();
  }
  onNavigateToContributor(id) {
    this.onContributorIdClicked.emit(id);
  }
  getIdentity() {
    this.identity = checkIqamaOrBorderOrPassport([this.personDetails?.identity[0]]);
    this.identityLabel = getIdentityLabel(this.identity);
  }
  getYears(engagementYears) {
    return moment().diff(engagementYears, 'years');
  }
}
