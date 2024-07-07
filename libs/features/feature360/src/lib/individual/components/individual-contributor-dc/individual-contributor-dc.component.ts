import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContributorInfo } from '../../../models/individual/contributor-info';
import { EmploymentHistoryList } from '../../../models/individual/employment-history-list';

@Component({
  selector: 'fea-individual-contributor-dc',
  templateUrl: './individual-contributor-dc.component.html',
  styleUrls: ['./individual-contributor-dc.component.scss']
})
export class IndividualContributorDcComponent implements OnInit, OnChanges {
  @Input() contributorInfo: ContributorInfo = null;
  curActiveContributor: EmploymentHistoryList = null;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributorInfo) {
      this.getActiveContributor();
    }
  }

  getActiveContributor() {
    if (this.contributorInfo) {
      for (const contributor of this.contributorInfo.employmenthistorylist) {
        if (contributor.engagementstatus === 'Active' || contributor.engagementstatus === 'نشيط') {
          this.curActiveContributor = contributor;
        }
      }
    }
  }
}
