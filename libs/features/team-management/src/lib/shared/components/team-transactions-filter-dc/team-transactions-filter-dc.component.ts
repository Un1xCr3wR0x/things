/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken, LovList, bindToObject, Lov } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionFilter } from '../../models';
import { BPMTaskConstants } from '@gosi-ui/core/lib/constants/bpm-task-list-constants';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'tm-team-transactions-filter-dc',
  templateUrl: './team-transactions-filter-dc.component.html',
  styleUrls: ['./team-transactions-filter-dc.component.scss']
})
export class TeamTransactionsFilterDcComponent implements OnInit {
  /**
   * Component local variables
   */
  isFilterCleared = false;
  lang = 'en';
  selectedStatusOptions: Array<BilingualText>;
  statusValue: BilingualText[];
  teamMemberFilter: TransactionFilter = new TransactionFilter();
  statusFilterRadioForm: FormGroup = new FormGroup({});
  statusList: LovList = new LovList([]);
  olaSlaFilterForm: FormGroup;
  selectedSlaOlaOptions: Array<BilingualText>;
  
  @Input() olaSlaFilter: string[];
  @Output() olaSlaFilterOutput: EventEmitter<BilingualText[]> = new EventEmitter();
  @ViewChild('filterbtn') filterbutton: FilterDcComponent;
  // output varaiables
  @Output() teamMemberListFilter: EventEmitter<TransactionFilter> = new EventEmitter();
  @Output() statusFilter: EventEmitter<string> = new EventEmitter();
  /**
   *
   * @param fb
   * @param language
   */
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise taska
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.statusList = new LovList(
      BPMTaskConstants.STATE_LIST.map((item, index) => {
        return bindToObject(new Lov(), {
          value: item,
          sequence: index + 1
        });
      })
    );
    this.statusFilterRadioForm = this.fb.group({
      status: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
    this.olaSlaFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.olaSlaList.forEach(item => {
      const control = new FormControl(false);
      if (this.olaSlaFilter?.find(channel => item.english === channel)) control.setValue(true);
      (this.olaSlaFilterForm.controls.items as FormArray).push(control);
    });
  }
  /**
   * This method is to clear the filters without apply
   */
  clearAllFitersWA(): void {
    this.isFilterCleared = true;
    this.statusFilterRadioForm.reset();
  }
  /*
   * Method to clear filter params
   */
  clearAllFiters() {
    this.isFilterCleared = true;
    this.selectedSlaOlaOptions = null;
    this.statusFilterRadioForm.reset();
    this.olaSlaFilterForm.reset();
    this.olaSlaFilterOutput.emit(null);
    this.statusFilter.emit(null);
  }
  /**
   * method to emit filter action
   */
  applyFilter(): void {
    if(this.selectedSlaOlaOptions && this.selectedSlaOlaOptions.length >= 1){
      this.olaSlaFilterOutput.emit(this.selectedSlaOlaOptions);
    }else{
      this.olaSlaFilterOutput.emit(null);
    }
    this.statusFilter.emit(this.statusFilterRadioForm.value.status.english);
  }
  olaSlaList = [
    {
      english: 'OLA Exceeded',
      arabic: 'تجاوزت اتفاقية مستوى التشغيل'
    }
  ];
}
