import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BilingualText, LovList } from '@gosi-ui/core';
import { AddMemberFilterRequest, SessionRequest, MBConstants, DropDownItems } from '../../../shared';

@Component({
  selector: 'mb-participant-queue-heading-dc',
  templateUrl: './participant-queue-heading-dc.component.html',
  styleUrls: ['./participant-queue-heading-dc.component.scss']
})
export class ParticipantQueueHeadingDcComponent implements OnInit, OnChanges {
  @Input() locationLists: LovList;
  @Input() assessmentTypeLists: LovList;
  @Input() specialtyLists: LovList;
  @Output() searchParticipants: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filterMembers: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  actionDropDown: DropDownItems[];
  @Input() checkboxSelected = false;
   primarySpeciality: BilingualText[] = [];
  //@Input() secondarySpeciality: BilingualText[] = [];
  sessionRequest: SessionRequest = new SessionRequest();

  isSearched = false;
  @Input() searchParams = '';

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.actionDropDown = new Array<DropDownItems>();
    this.actionDropDown.push(
      { id: 1, key: 'MEDICAL-BOARD.ASSIGN-TO-SESSION' },
      { id: 2, key: 'MEDICAL-BOARD.CREATE-NEW-SESSION' }
    );

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.checkboxSelected) {
      this.checkboxSelected = changes?.checkboxSelected?.currentValue;
    }
  }
appendSelectedspecialities( primarySpeciality:BilingualText[]){
    this.primarySpeciality.push(...primarySpeciality);
  }
/* pushSpecialities(){
    const sessionRequest = new SessionRequest();
    sessionRequest.filterData.speciality.push(...this.primarySpeciality);
  }*/
  onCheckboxSelected(selected: boolean) {
    this.checkboxSelected = selected;
  }
  onSearchMember(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.searchParticipants.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  onSearchEnable(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.searchParticipants.emit(key);
    }
  }
  onResetSearch() {
    this.searchParticipants.emit(null);
  }
  /**
   * Method to navigate to create session page
   * @param id
   */
  navigateToAssign(id: number) {
    const sessionRequest = new SessionRequest();
    for (const speciality of this.primarySpeciality) {
      sessionRequest.filterData.speciality.push(speciality);
    } 
    let route : string;
    if (id === 1) {
      this.router.navigate([MBConstants.ROUTE_ASSIGN_SESSION], {state: {sessionRequest:sessionRequest}});
    } else if (id === 2) {
      this.router.navigate([MBConstants.ROUTE_ADHOC_SESSION_DETAILS]);
    }
  }
  onFilter(filterValue: AddMemberFilterRequest) {
    this.filter.emit(filterValue);
  }
}
