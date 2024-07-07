import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonIdentity, InjuryWrapper, checkIqamaOrBorderOrPassport } from '@gosi-ui/core';
import moment from 'moment';
import { AssessmentTypeEnum } from '@gosi-ui/features/medical-board/lib/shared/enums/assessment-type';
import { getIdentityLabel } from '../../utils';
import { DisabiliyDtoList } from '../../models';

@Component({
  selector: 'oh-participant-details-dc',
  templateUrl: './participant-details-dc.component.html',
  styleUrls: ['./participant-details-dc.component.scss']
})
export class ParticipantDetailsDcComponent implements OnInit {
  @Input() personDetails;
  @Input() injuryDetailsById: InjuryWrapper;
  @Input() assessmentType: string;
  @Input() injuryIdNeeded = false;
  @Input() assessmentDetails: DisabiliyDtoList;
  
  @Output() onContributorIdClicked = new EventEmitter<number>();
  @Output() onShowEngagementClicked = new EventEmitter<null>();
  @Output() onShowMBAssessmentClicked = new EventEmitter<null>();
  @Output() onOHClicked = new EventEmitter<null>();
  
  identity: CommonIdentity | null;
  identityLabel = '';
  assessmentTypeEnum = AssessmentTypeEnum;

  constructor() {}

  ngOnInit(): void {
    this.getIdentity();
  }
  getIdentity() {
    this.identity = checkIqamaOrBorderOrPassport(this.personDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
  }
  onNavigateToContributor(id) {
    this.onContributorIdClicked.emit(id);
  }
  getAge(birthDate) {
    return moment(new Date()).diff(moment(birthDate), 'years');
  }
}
