import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { formatDate } from '@gosi-ui/core';
import { PersonalInformation } from '../../models';

@Component({
  selector: 'pmt-validator-adjustment-contributor-dc',
  templateUrl: './validator-adjustment-contributor-dc.component.html',
  styleUrls: ['./validator-adjustment-contributor-dc.component.scss']
})
export class ValidatorAdjustmentContributorDcComponent implements OnInit {
  @Input() canEdit: Boolean = false;
  @Input() personDetails: PersonalInformation;
  @Input() lang = 'en';

  @Output() onEditClicked = new EventEmitter();
  @Output() onContributorIdClicked = new EventEmitter();

  age;
  constructor() {}

  ngOnInit(): void {
    if (this.personDetails.birthDate) {
      const birthdate = moment(this.personDetails.birthDate.gregorian);
      const thisDay = moment();
      this.age = thisDay.diff(birthdate, 'years');
    }
  }

  editAddAdjustmentDetails() {
    this.onEditClicked.emit();
  }
  onNavigateToContributor() {
    this.onContributorIdClicked.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
