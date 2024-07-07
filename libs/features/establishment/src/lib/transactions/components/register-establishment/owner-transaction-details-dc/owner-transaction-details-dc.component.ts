import { Component, Input, OnInit } from '@angular/core';
import { getArabicName, Person } from '@gosi-ui/core';
import { Owner } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-owner-transaction-details-dc',
  templateUrl: './owner-transaction-details-dc.component.html',
  styleUrls: ['./owner-transaction-details-dc.component.scss']
})
export class OwnerTransactionDetailsDcComponent implements OnInit {
  @Input() estNewOwners: Person[] = [];
  @Input() isGcc = false;
  @Input() estOwnersList: Owner[] = [];
  isUpperArrowOpen: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  /**
   * Get the owner name in arabic
   * @param person
  //  */
  getOwnerName(person: Person) {
    let ownerName = null;
    if (person?.name?.arabic?.firstName) {
      ownerName = getArabicName(person?.name?.arabic);
    } else if (person?.name?.english?.name) {
      ownerName = person?.name?.english?.name;
    }

    return ownerName;
  }
  isUpperArrow() {
    this.isUpperArrowOpen = !this.isUpperArrowOpen;
  }
}
