/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getArabicName, Person } from '@gosi-ui/core';
import { Owner } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-establishment-owner-details-dc',
  templateUrl: './establishment-owner-details-dc.component.html',
  styleUrls: ['./establishment-owner-details-dc.component.scss']
})
export class EstablishmentOwnerDetailsDcComponent implements OnInit {
  constructor() {}
  /* Input Variables*/
  @Input() newOwners: Person[] = [];
  @Input() showDate = false;
  @Input() canEdit = true;
  @Input() showHeading = true;
  @Input() isGcc = false;
  @Input() ownersToHighlight = [];
  @Input() hasOwnerDeleted = false;
  @Input() estOwnersList: Owner[] = [];

  //Output variable
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {}
  // method to emit edit values
  onEditOwnerDetails() {
    this.onEdit.emit();
  }
  /**
   * Get the owner name in arabic
   * @param person
  //  */
  getOwnerName(person: Person) {
    let ownerName = null;
    if (person.name.arabic.firstName) {
      ownerName = getArabicName(person.name.arabic);
    }

    return ownerName;
  }
}
