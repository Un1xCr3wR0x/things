import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonIdentity, Contributor } from '@gosi-ui/core';

@Component({
  selector: 'mb-contributor-personal-details-dc',
  templateUrl: './contributor-personal-details-dc.component.html',
  styleUrls: ['./contributor-personal-details-dc.component.scss']
})
export class ContributorPersonalDetailsDcComponent implements OnInit {
  personId: number
  @Input() contributor: Contributor;
  @Input() identity: CommonIdentity | null;
  @Input() identityLabel = '';
  @Output() onContributorIdClicked = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
getIdByLabel(id){
  if(this.contributor.person.identity){
    // this.personId
  }
}
onNavigateToContributor(id) {
  this.onContributorIdClicked.emit(id);
}
}
