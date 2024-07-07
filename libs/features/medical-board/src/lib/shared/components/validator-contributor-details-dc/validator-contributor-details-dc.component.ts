import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { checkIqamaOrBorderOrPassport, CommonIdentity } from '@gosi-ui/core';
import { InjuryWrapper } from '../../models';
import { getIdentityLabel } from '../../utils';
import { AssessmentTypeEnum } from '../../enums/assessment-type';
import moment from 'moment';
@Component({
  selector: 'mb-validator-contributor-details-dc',
  templateUrl: './validator-contributor-details-dc.component.html',
  styleUrls: ['./validator-contributor-details-dc.component.scss']
})
export class ValidatorContributorDetailsDcComponent implements OnInit {
  @Input() personDetails;
  @Input() injuryDetailsById: InjuryWrapper;
  @Input() assessmentType: string;
  @Input() injuryIdNeeded = false;

  @Output() onContributorIdClicked = new EventEmitter<{id:number, idType:string}>();
  @Output() onInjuryIdClicked = new EventEmitter<null>();

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
    this.onContributorIdClicked.emit({id:id, idType:this.identity?.idType});
  }
  getAge(birthDate) {
    return moment(new Date()).diff(moment(birthDate), 'years');
  }
}
