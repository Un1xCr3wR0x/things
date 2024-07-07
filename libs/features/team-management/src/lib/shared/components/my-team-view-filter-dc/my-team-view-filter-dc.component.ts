/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { TeamMemberFilter } from '../../models';

@Component({
  selector: 'tm-my-team-view-filter-dc',
  templateUrl: './my-team-view-filter-dc.component.html',
  styleUrls: ['./my-team-view-filter-dc.component.scss']
})
export class MyTeamViewFilterDcComponent implements OnInit {
  /**
   * Component local variables
   */
  lang = 'en';
  selectedStatusOptions: Array<BilingualText>;
  statusFilterForm: FormGroup;
  statusValue: BilingualText[];
  teamMemberFilter: TeamMemberFilter = new TeamMemberFilter();
  // output varaiables
  @Output() teamMemberListFilter: EventEmitter<TeamMemberFilter> = new EventEmitter();
  /**
   * Status list Values
   */
  memberStatusList = [
    {
      english: 'Active',
      arabic: 'نشطة'
    },
    {
      english: 'On Leave',
      arabic: 'في إجازة'
    }
  ];
  /**
   *
   * @param fb
   * @param language
   */
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.memberStatusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
  }

  /**
   * This method is to clear the filters
   */

  clearAllFiters(): void {
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
    this.applyFilter();
  }
  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }

    this.teamMemberFilter.status = this.statusValue;

    this.teamMemberListFilter.emit(this.teamMemberFilter);
  }
}
