/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EntityTypeEnum } from '../../../shared/enums';

@Component({
  selector: 'blg-entity-type-select-dc',
  templateUrl: './entity-type-select-dc.component.html',
  styleUrls: ['./entity-type-select-dc.component.scss']
})
export class EntityTypeSelectDcComponent implements OnInit {
  establishment = EntityTypeEnum.Establishment;
  vic = EntityTypeEnum.VIC;
  allEntity = EntityTypeEnum.AllEntities;
  showAllEntityType = false; //not required for Release 2

  @Input() entityType: string;

  /**
   * Output event emitters
   */
  @Output() selectType: EventEmitter<EntityTypeEnum> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  /**
   * Method to catch the select event of contributor type and will emit event to parent
   * @param type
   */
  selectContributorType(type: EntityTypeEnum) {
    window.scrollTo(document.documentElement.scrollTop, document.body.scrollHeight);
    if (type) {
      // this.contributorType = type;
      this.selectType.emit(type);
    }
  }
}
