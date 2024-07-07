/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlPerson, FilterKeyValue } from '../../../shared';

@Component({
  selector: 'est-admin-list-dc',
  templateUrl: './admin-list-dc.component.html',
  styleUrls: ['./admin-list-dc.component.scss']
})
export class AdminListDcComponent implements OnInit, OnChanges {
  loadedAdmins = [];
  adminFilters: Array<FilterKeyValue>;

  @Input() adminsForView: ControlPerson[];
  @Input() totalAdmin: ControlPerson[];
  @Input() currentPage = 0;
  @Input() pageSize = 2;
  @Input() totalCount = 5;
  @Input() selectedAdminId: number;
  @Input() nationalityList$;
  @Input() roleList$;
  @Input() adminSearchParam;
  @Input() canAdd = true;
  @Input() showFilter = true;
  @Input() isLoadingAdmin = false;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() add: EventEmitter<string> = new EventEmitter();
  @Output() filter: EventEmitter<string> = new EventEmitter();
  @Output() load: EventEmitter<number> = new EventEmitter();
  @Output() select: EventEmitter<string> = new EventEmitter();
  @Output() apply: EventEmitter<FilterKeyValue[]> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.loadedAdmins = [];
    this.loadMore({ currentPage: this.currentPage, pageSize: this.pageSize });
  }

  /**
   * Method to detect input changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.adminsForView && changes.adminsForView.currentValue && !changes.adminsForView.firstChange) {
      this.loadedAdmins = [];
      this.loadMore({ currentPage: this.currentPage, pageSize: this.pageSize });
    }
  }

  /**
   * Method to emit the selected admin id
   * @param id
   */
  selectAdmin(id: string) {
    this.select.emit(id);
  }

  /**
   * Method to load more items in view
   * @param event
   */
  loadMore(event: { currentPage: number; pageSize: number }) {
    const currentIndex = event.currentPage * event.pageSize;
    this.loadedAdmins = [
      ...this.loadedAdmins,
      ...this.adminsForView.slice(currentIndex, currentIndex + event.pageSize)
    ];
  }

  applyFilter(filters: FilterKeyValue[]) {
    this.adminFilters = filters;
    this.apply.emit(filters);
  }
}
