/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Owner } from '../../models';
import { getIdentityByType, CommonIdentity } from '@gosi-ui/core';

@Component({
  selector: 'est-owner-identity-dc',
  templateUrl: './owner-identity-dc.component.html',
  styleUrls: ['./owner-identity-dc.component.scss']
})
export class OwnerIdentityDcComponent implements OnInit, OnChanges {
  @Input() owner: Owner;
  @Input() translateFromModule = 'ESTABLISHMENT.';

  identity: CommonIdentity;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.owner) {
      this.identity = this.getOwnerIdentity(changes.owner.currentValue);
    }
  }

  ngOnInit(): void {
    this.identity = this.getOwnerIdentity(this.owner);
  }

  /**
   * Get the owner identity
   * @param index
  //  */
  getOwnerIdentity(owner: Owner): CommonIdentity {
    const identity = getIdentityByType(owner.person.identity, owner.person.nationality.english);
    identity.idType = this.translateFromModule + identity.idType;

    return identity;
  }
}
