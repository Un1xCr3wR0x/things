import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { BilingualText, Contributor, LanguageToken } from '@gosi-ui/core';
import {
  BackdatedTerminationTransactionsDetails,
  EstablishmentDetails
} from '@gosi-ui/features/collection/billing/lib/shared/models';
import { BankAccountList } from '@gosi-ui/features/collection/billing/lib/shared/models/bank-account-list';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-contributor-refund-establishment-account-details-dc',
  templateUrl: './contributor-refund-establishment-account-details-dc.component.html',
  styleUrls: ['./contributor-refund-establishment-account-details-dc.component.scss']
})
export class ContributorRefundEstablishmentAccountDetailsDcComponent implements OnInit, OnChanges {
  // local variable
  lang = '';
  arabicName = '';
  contributorStatus = 'BILLING.ACTIVE';
  totalAmount = 0;

  // Input variables
  @Input() estDetails: EstablishmentDetails;
  @Input() contributorDetails: Contributor;
  @Input() backdatedTermination: BackdatedTerminationTransactionsDetails;
  @Input() vicAccountNumber: string;
  @Input() vicBankNameDetail: BilingualText;
  @Input() canEdit: boolean;
  ///Output variables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Initializes the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /** Method to get values on input change. */
  ngOnChanges(changes: SimpleChanges) {
    this.contributorStatus = this.contributorDetails?.hasActiveTerminatedOrCancelled
      ? 'BILLING.TERMINATED'
      : 'BILLING.ACTIVE';
    if (changes?.contributorDetails?.currentValue) {
      this.arabicName =
        changes.contributorDetails?.currentValue?.person?.name.arabic?.firstName +
        ' ' +
        changes.contributorDetails?.currentValue?.person?.name.arabic?.secondName +
        ' ' +
        changes.contributorDetails?.currentValue?.person?.name.arabic?.thirdName +
        ' ' +
        changes.contributorDetails?.currentValue?.person?.name.arabic?.familyName;
    }
    if (changes?.backdatedTermination?.currentValue) {
      this.backdatedTermination.terminatedContributions.forEach(val => (this.totalAmount += val.contributorShare));
    }
  }

  navigateToCsrPage() {
    this.onEdit.emit();
  }
}
