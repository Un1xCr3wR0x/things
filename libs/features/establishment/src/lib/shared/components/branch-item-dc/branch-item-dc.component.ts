/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EstablishmentStatusEnum } from '@gosi-ui/core';
import { EstablishmentTypeEnum } from '../../enums';
import { BranchList } from '../../models';

@Component({
  selector: 'est-branch-item-dc',
  templateUrl: './branch-item-dc.component.html',
  styleUrls: ['./branch-item-dc.component.scss']
})
export class BranchItemDcComponent implements OnInit, OnChanges {
  //Local Variables
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  isRegistered: boolean;
  isClosed: boolean;
  isProactive = true;
  _establishment: BranchList;
  //Input Variables
  @Input() set establishment(est: BranchList) {
    this.isProactive = est.showCompleteInfo;
    this._establishment = est;
  }
  get establishment(): BranchList {
    return this._establishment;
  }

  @Input() showNewStatus = false;
  @Input() showDelinkStatus = false;
  @Input() showRole = false;

  //Output Variables
  @Output() selectedEstablishment: EventEmitter<BranchList> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.establishment) {
      this.isRegistered = this.establishment.status?.english === EstablishmentStatusEnum.REGISTERED ? true : false;
      this.isClosed = this.establishment.status?.english === EstablishmentStatusEnum.CLOSED ? true : false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment && !changes.establishment.firstChange) {
      this.isRegistered = this.establishment.status?.english === EstablishmentStatusEnum.REGISTERED ? true : false;
      this.isClosed = this.establishment.status?.english === EstablishmentStatusEnum.CLOSED ? true : false;
    }
  }

  /**
   * Method to emit reg no details
   * @param branchEstablishment
   */
  selectRegNoDetails(branchEstablishment: BranchList) {
    this.selectedEstablishment.emit(branchEstablishment);
  }
}
