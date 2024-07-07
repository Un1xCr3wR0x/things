/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getArabicName } from '@gosi-ui/core';
import { Owner } from '../../models';

@Component({
  selector: 'est-owner-name-dc',
  templateUrl: './owner-name-dc.component.html',
  styleUrls: ['./owner-name-dc.component.scss']
})
export class OwnerNameDcComponent implements OnInit, OnChanges {
  @Input() owner: Owner;
  @Input() ownerIndex = 0;

  ownerName: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.owner) {
      this.ownerName = this.getOwnerName(changes.owner.currentValue);
    }
  }

  ngOnInit(): void {}

  /**
   * Get the owner name in arabic
   * @param index
  //  */
  getOwnerName(owner: Owner) {
    let ownerName = null;
    if (owner && owner?.person?.name?.arabic.firstName) {
      ownerName = getArabicName(owner?.person?.name?.arabic);
    }

    return ownerName;
  }
}
