import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageToken, BilingualText } from '@gosi-ui/core';
import { ClaimWrapper } from '../../../shared/models/claim-wrapper';
import { ClaimsWrapper } from '../../models';

@Component({
  selector: 'oh-vtr-allowance-details-dc',
  templateUrl: './allowance-details-dc.component.html',
  styleUrls: ['./allowance-details-dc.component.scss']
})
export class AllowanceDetailsDcComponent implements OnInit, OnChanges {
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /*Local Variable*/
  idLabel: string;
  dateLabel: string;
  lang = 'en';
  /**
   * Input variables
   */
  @Input() allowance: ClaimWrapper;
  @Input() showHeading = true;
  @Input() claims: boolean;
  @Input() injuryid: number;
  @Input() canEdit = false;
  @Input() dateDiff: string;
  @Input() allowanceType: string;
  @Input() rejectionReason: BilingualText;
  @Input() repatriationWrapper: ClaimsWrapper;
  @Input() totalRepatriationExpense: number;
  /**
   * Output variables
   */
  @Output() injurySelected: EventEmitter<number> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   *Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowance) {
      this.allowance = changes.allowance.currentValue;
    }
    if (changes && changes.dateDiff) {
      this.dateDiff = changes.dateDiff.currentValue;
      this.dateDiff = this.dateDiff;
    }
    if (changes && changes.allowanceType) {
      this.allowanceType = changes.allowanceType.currentValue;
      this.idLabel = 'OCCUPATIONAL-HAZARD.' + this.allowanceType + '.ID';
      this.dateLabel = 'OCCUPATIONAL-HAZARD.' + this.allowanceType + '.DATE';
    }
    if (changes && changes.repatriationWrapper) {
      this.getModifiedExpense();
    }
  }
  /**
   * Method to emit selected injury
   * @param injury
   */
  viewInjuryDetails(injury: number) {
    this.injurySelected.emit(injury);
  }
  /**
   * Edit option for injury details
   */
  injuryOnEdit() {
    this.onEdit.emit();
  }
  /**
   * Get Allowance Amount
   */
  getAllowanceAmount() {
    if (this.allowance) {
      if (this.lang === 'en') {
        return this.allowance.totalAmount + ' ' + 'SAR';
      } else {
        return this.allowance.totalAmount + ' ' + 'ر.س';
      }
    }
  }
  getModifiedExpense() {
    if (this.lang === 'en') {
      return this.totalRepatriationExpense + ' ' + 'SAR';
    } else {
      return this.totalRepatriationExpense + ' ' + 'ر.س';
    }
  }
}
