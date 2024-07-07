/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import moment from 'moment';
import { TransactionSummary } from '../../models';

@Component({
  selector: 'ces-previous-transactions-dc',
  templateUrl: './previous-transactions-dc.component.html',
  styleUrls: ['./previous-transactions-dc.component.scss']
})
export class PreviousTransactionsDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() previousTransactions: TransactionSummary[] = [];
  @Input() transactionCount = 0;
  @Input() isLoading = false;
  /**
   * local variables
   */
  selectedOption = 'All Categories';
  categoryForm: FormGroup;
  categoryList: LovList;
  dateList: string[] = [];
  /**
   * output variables
   */
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() select: EventEmitter<BilingualText> = new EventEmitter();
  @Output() load: EventEmitter<null> = new EventEmitter();
  @Output() navigate: EventEmitter<TransactionSummary> = new EventEmitter();
  @ViewChild('previousTransactionWrapper') previousTransactionWrapper: ElementRef;
  /**
   *
   * @param formBuilder
   */
  constructor(readonly formBuilder: FormBuilder) {}
  /**
   * method to initialise tasks
   */
  ngOnInit() {
    this.categoryForm = this.createCategoryForm();
    this.categoryList = {
      items: [
        { value: { english: 'All Categories', arabic: 'جميع الفئات' }, sequence: 0 },
        { value: { english: 'Complaint', arabic: 'شكوى' }, sequence: 1 },
        { value: { english: 'Enquiry', arabic: 'استفسار' }, sequence: 2 },
        { value: { english: 'Suggestion', arabic: 'اقتراح' }, sequence: 3 },
        { value: { english: 'Appeal', arabic: 'اعتراض' }, sequence: 4 },
        { value: { english: 'Plea', arabic: 'استئناف' }, sequence: 5 }
      ]
    };
  }
  /**
   * method to hide modal
   */
  hideModal() {
    this.hide.emit();
  }
  /**
   * Method to create contact us form
   */
  createCategoryForm(): FormGroup {
    return this.formBuilder.group({
      category: this.formBuilder.group({
        english: [this.selectedOption, Validators.compose([Validators.required])],
        arabic: [null]
      })
    });
  }
  /**
   *
   * @param category method to emit selected category
   */
  onCategorySelection(category: BilingualText) {
    this.select.emit(category);
    this.previousTransactionWrapper?.nativeElement?.scrollTo(0, 0);
  }
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.previousTransactions && changes.previousTransactions.currentValue) {
        this.previousTransactions = changes.previousTransactions.currentValue;
        this.dateList = [];
        /**
      *   this.previousTransactions.forEach(item => {
          if (
            !this.dateList.find(
              date =>
                moment(date).format('dd/MM/yyyy').toString() ===
                moment(item.createdDate.gregorian).format('dd/MM/yyyy').toString()
            )
          ) {
            this.dateList.push(item.createdDate.gregorian.toString());
          }
        });
      *  */
      }
      if (changes.isLoading && changes.isLoading.currentValue) {
        this.isLoading = changes.isLoading.currentValue;
      }
      if (changes.transactionCount && changes.transactionCount.currentValue) {
        this.transactionCount = changes.transactionCount.currentValue;
      }
    }
  }
  /**
   *
   * @param date method to get txn list
   */
  getTransactionList(date: string) {
    return this.previousTransactions.filter(
      item =>
        moment(date).format('dd/MM/yyyy').toString() ===
        moment(item.createdDate.gregorian).format('dd/MM/yyyy').toString()
    );
  }
  /**
   * method to set load more
   */
  loadTransactions() {
    this.load.emit();
    this.previousTransactionWrapper.nativeElement.scrollTop = this.previousTransactionWrapper.nativeElement.scrollHeight;
  }
  /**
   *
   * @param transaction method to emit navigate event
   */
  onNavigate(transaction: TransactionSummary) {
    this.navigate.emit(transaction);
  }
}
