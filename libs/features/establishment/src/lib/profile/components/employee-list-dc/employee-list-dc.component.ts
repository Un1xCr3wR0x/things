/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderEnum } from '@gosi-ui/core';
import { ControlPerson } from '../../../shared/models';

@Component({
  selector: 'est-employee-list-dc',
  templateUrl: './employee-list-dc.component.html',
  styleUrls: ['./employee-list-dc.component.scss']
})
export class EmployeeListDcComponent implements OnInit, OnChanges {
  //local variables
  maleGender = GenderEnum.MALE;
  femaleGender = GenderEnum.FEMALE;
  filteredEmployees: ControlPerson[] = [];
  showAll = false;
  adminDetailsForm: FormGroup;
  isSelectAdmin = false;

  @Input() employees: ControlPerson[];
  @Input() showLoadMore = false;
  @Input() currentPage = 0;
  @Input() pageSize = 0;
  @Input() totalCount = 7;
  @Input() heading: string;
  @Input() actionLabel: string;
  @Input() viewAllLink: string;
  @Input() initalNoOfEmployees = 2;
  @Input() addScreenLink: string;
  @Input() showButton: boolean;
  @Input() showMoreOptions = false;
  @Input() showRole = false;
  @Input() showId = false;
  @Input() actionIcon = undefined;
  @Input() isWorkflow = true;
  @Input() disableButton = false;
  @Input() buttonTooltip: string;

  @Output() loadMore: EventEmitter<number> = new EventEmitter();
  @Output() displayModal: EventEmitter<void> = new EventEmitter();

  constructor(readonly router: Router, public fb: FormBuilder) {}

  ngOnInit() {
    this.filterItems(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.employees && changes.employees.currentValue) {
      this.filterItems(false);
    }

    this.adminDetailsForm = this.createAdminDetailsForm();
  }

  /**
   * To show or hide
   * @param showAll If true show all,else show only two
   */
  viewAll(showAll: boolean) {
    if (this.viewAllLink) {
      this.router.navigate([this.viewAllLink]);
    } else {
      this.filterItems(showAll);
    }
  }

  /**
   * Method to show all or filter
   * @param showAll
   */
  filterItems(showAll: boolean) {
    if (this.showLoadMore) {
      this.loadMoreEmployee({ currentPage: this.currentPage, pageSize: this.initalNoOfEmployees });
    } else {
      if (this.employees) {
        if (showAll === true) {
          this.showAll = true;
          this.filteredEmployees = [...this.employees];
        } else {
          this.showAll = false;
          this.filteredEmployees = this.employees.slice(0, this.initalNoOfEmployees);
        }
      } else {
        this.filteredEmployees = [];
      }
    }
  }
  createAdminDetailsForm() {
    return this.fb.group({
      checkBoxFlag: [null, { validators: Validators.required }]
    });
  }

  loadMoreEmployee(event: { currentPage: number; pageSize: number }) {
    const noToLoaded = (event.currentPage + 1) * event.pageSize;
    this.filteredEmployees = [...this.employees.slice(0, noToLoaded)];
    this.currentPage = event.currentPage;
  }
  displayModalDetails() {
    this.displayModal.emit();
  }
}
