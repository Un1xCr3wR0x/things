/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText, EstablishmentStatusEnum, RoleIdEnum } from '@gosi-ui/core';
import { EstablishmentTypeEnum } from '../../enums';
import { BranchList } from '../../models';

@Component({
  selector: 'est-branch-list-dc',
  templateUrl: './branch-list-dc.component.html',
  styleUrls: ['./branch-list-dc.component.scss']
})
export class BranchListDcComponent implements OnInit {
  //Local Variables
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  closedStatus = EstablishmentStatusEnum.CLOSED;
  @Input() itemsPerPage = 2;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  @Input() currentPage = 1;
  @Input() showRole = false;

  //Input Variables
  @Input() establishments: BranchList[];
  @Input() totalBranches: number;
  @Input() selectedBranchesRegNo: number[] = [];
  @Input() paginationId = 'establishmentBranchList';
  @Input() showNewStatus = false;
  @Input() showDelinkStatus = false;
  @Input() selectedBranches: BranchList[];
  @Input() selectedBranchesCount: number;
  @Input() isLoading = false;
  @Input() isResultEmpty = false;
  @Input() searchParam: string;
  @Input() showProactivePending = false;
  @Input() warningKey = undefined;
  private _proactiveStatusPending: number;
  @Input()
  set proactiveStatusPending(noOfEsts: number) {
    this._proactiveStatusPending = noOfEsts ? noOfEsts : 0;
  }
  get proactiveStatusPending() {
    return this._proactiveStatusPending;
  }

  //Output Variables
  @Output() selectedEstablishment: EventEmitter<BranchList> = new EventEmitter();
  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  /**
   * Method to get the establishment name
   * If english is missing use arabic name
   * @param name
   */
  getEstablishmentName(name: BilingualText) {
    if (name && !name.english) {
      name.english = name.arabic;
    }
    return name;
  }

  /**
   * Method to emit reg no details
   * @param branchEstablishment
   */
  selectRegNoDetails(branchEstablishment: BranchList) {
    this.selectedEstablishment.emit(branchEstablishment);
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (page !== this.pageDetails.currentPage) {
      this.pageIndexEvent.emit(page);
    }
  }
}
