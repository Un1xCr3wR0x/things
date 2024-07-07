import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContactDetails, EducationDetails, FinancialDetails, PersonDetails } from '../../../shared';
import { VerifyBankDetails } from '../../../shared/models/benefits/verify-bank-details';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared';
import { ActiveBenefits } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'cim-personal-details-tabset-dc',
  templateUrl: './personal-details-tabset-dc.component.html',
  styleUrls: ['./personal-details-tabset-dc.component.scss']
})
export class PersonalDetailsTabsetDcComponent implements OnInit, OnChanges {
  currentTab = 0;
  @Input() userDetails: Contributor;
  @Input() activeBenefit: ActiveBenefits;
  @Input() educationDetails: EducationDetails;
  @Input() contactDetails: ContactDetails;
  @Input() personDetails: PersonDetails;
  @Input() financialDetails: FinancialDetails;
  @Input() lang: string;
  @Input() navigatedFrom: string;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @Output() select: EventEmitter<null> = new EventEmitter();
  @Output() limit: EventEmitter<number> = new EventEmitter();
  @Output() reverifyDetails: EventEmitter<VerifyBankDetails> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.educationDetails && changes.educationDetails.currentValue) {
      this.educationDetails = changes.educationDetails.currentValue;
    }
    if (changes.contactDetails && changes.contactDetails.currentValue) {
      this.contactDetails = changes.contactDetails.currentValue;
    }
    if (changes.personDetails && changes.personDetails.currentValue) {
      this.personDetails = changes.personDetails.currentValue;
    }
    if (changes.financialDetails && changes.financialDetails.currentValue) {
      this.financialDetails = changes.financialDetails.currentValue;
    }
    if (changes.navigatedFrom && changes.navigatedFrom.currentValue) {
      this.currentTab = 1;
    }
  }
  onSelectTab(tab) {
    this.currentTab = tab;
    this.select.emit(tab);
  }
  navigateTo() {
    this.navigate.emit();
  }
  onSelectPage(page) {
    this.limit.emit(page);
  }
  reverifyDetailsFn(bankDetails) {
    this.reverifyDetails.emit(bankDetails);
  }
}
