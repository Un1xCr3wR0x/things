import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersonDetails } from '../../../shared/models/person-details';
import { checkIqamaOrBorderOrPassport, CommonIdentity, formatDate } from '@gosi-ui/core';
import { getIdentityLabel } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-validator-contribute-dc',
  templateUrl: './validator-contribute-dc.component.html',
  styleUrls: ['./validator-contribute-dc.component.scss']
})
export class ValidatorContributeDcComponent implements OnInit {
  @Input() personDetails: PersonDetails;
  @Input() lang = 'en';

  @Output() onNinClicked = new EventEmitter();

  primaryIdentity: CommonIdentity = new CommonIdentity();
  identity: CommonIdentity | null;
  identityLabel = '';

  constructor() {}

  ngOnInit() {
    if (this.personDetails) this.getIdentity();
  }
  ngOnChanges() {
    if (this.personDetails) {
      this.getIdentity();
    }
  }
  onIdentityClick() {
    this.onNinClicked.emit();
  }

  getIdentity() {
    this.identity = checkIqamaOrBorderOrPassport(this.personDetails?.identity);
    this.identityLabel = getIdentityLabel(this.identity);
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
