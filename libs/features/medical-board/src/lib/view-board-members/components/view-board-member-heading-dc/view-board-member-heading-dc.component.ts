import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'mb-view-board-member-heading-dc',
  templateUrl: './view-board-member-heading-dc.component.html',
  styleUrls: ['./view-board-member-heading-dc.component.scss']
})
export class ViewBoardMemberHeadingDcComponent implements OnInit {
  /** Input variables. */
  @Input() specialty$;
  @Input() nationalityList$;
  @Input() region$;
  @Input() doctorType$;
  @Input() isAppPrivate;
  roleValidation = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];
  /** output variables. */
  @Output() searchMembers: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filterMembers: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() addMember: EventEmitter<null> = new EventEmitter<null>();

  ngOnInit(): void {
    // this.roleValidation.push(RoleIdEnum.BOARD_OFFICER);
  }
  /** Method to search board members from list. */
  searchBoardMembers(value) {
    this.searchMembers.emit(value);
  }

  filterBoardMembers(value) {
    this.filterMembers.emit(value);
  }
}
