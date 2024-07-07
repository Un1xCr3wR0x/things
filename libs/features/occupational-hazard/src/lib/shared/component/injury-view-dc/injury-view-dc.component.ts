/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Injury } from '../../../shared/models';
import { TransactionReferenceData, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'oh-injury-view-dc',
  templateUrl: './injury-view-dc.component.html',
  styleUrls: ['./injury-view-dc.component.scss']
})
export class InjuryViewDcComponent implements OnInit, OnChanges {
  //TODO: remove unused methods.
  constructor() {}
  /**
   * Input variables
   */
  @Input() injury: Injury;
  @Input() modify = false;
  @Input() idCode: string;
  @Input() reopen: Injury;
  @Input() transactionId = 0;
  @Input() canEdit = false;
  @Input() status = '';
  @Input() transactionReferenceData: TransactionReferenceData[];
  @Input() showPayee = false;
  @Input() showHeading = true;
  @Input() allowanceFlagVal: boolean;
  @Input() allowanceFlagVal2: boolean;
  @Input() allowanceFlagVal3: boolean;
  @Input() allowanceFlagVal4: boolean;
  /**
   * Output variables
   */
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /**
   * Local Variables
   */
  payee: BilingualText = new BilingualText();
  //TODO: remove unused methods.
  ngOnInit(): void {}
  /**
   *Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
    if (changes && changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
    if (changes && changes.reopen) {
      this.reopen = changes.reopen.currentValue;
    }
  }
  /**
   * Method to emit selected injury
   * @param injury
   */
  viewInjuryDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
  /**
   * Edit option for injury details
   */
  injuryOnEdit() {
    this.onEdit.emit();
  }
  /**
   * get payee
   */
  getPayee() {
    if (this.injury.allowancePayee === 2) {
      this.payee.english = 'Contributor';
      this.payee.arabic = 'المشترك';
      return this.payee;
    } else if (this.injury.allowancePayee === 1) {
      this.payee.english = 'Establishment';
      this.payee.arabic = 'منشأة';
      return this.payee;
    }
  }
}
